import tls from "node:tls";

export const runtime = "nodejs";

type ConsultationPayload = {
  name?: unknown;
  phone?: unknown;
  height?: unknown;
  weight?: unknown;
  age?: unknown;
};

type MailFields = {
  name: string;
  phone: string;
  height: string;
  weight: string;
  age: string;
};

type SmtpResponse = {
  code: number;
  message: string;
};

const REQUIRED_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_APP_PASSWORD",
  "SMTP_FROM_NAME",
  "CONSULTATION_TO",
] as const;

function readField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n"]/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validatePayload(payload: ConsultationPayload): MailFields {
  const fields = {
    name: readField(payload.name),
    phone: readField(payload.phone),
    height: readField(payload.height),
    weight: readField(payload.weight),
    age: readField(payload.age),
  };

  if (
    !fields.name ||
    !fields.phone ||
    !fields.height ||
    !fields.weight ||
    !fields.age
  ) {
    throw new Error("Please fill in every field.");
  }

  return fields;
}

function getSmtpConfig() {
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing SMTP configuration: ${missingKeys.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT);

  if (port !== 465) {
    throw new Error("SMTP_PORT must be 465 for Gmail SSL SMTP.");
  }

  return {
    host: process.env.SMTP_HOST!,
    port,
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_APP_PASSWORD!.replace(/\s/g, ""),
    fromName: process.env.SMTP_FROM_NAME!,
    to: process.env.CONSULTATION_TO!,
  };
}

function buildEmail(fields: MailFields, from: string, fromName: string, to: string) {
  const boundary = `consultation-${Date.now().toString(36)}`;
  const safeFromName = cleanHeader(fromName);
  const textBody = [
    "New contact form submission",
    "",
    `Name: ${fields.name}`,
    `Phone number: ${fields.phone}`,
    `Height: ${fields.height}`,
    `Weight: ${fields.weight}`,
    `Age: ${fields.age}`,
  ].join("\r\n");

  const htmlRows = [
    ["Name", fields.name],
    ["Phone number", fields.phone],
    ["Height", fields.height],
    ["Weight", fields.weight],
    ["Age", fields.age],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${escapeHtml(label)}</td>
          <td style="padding:10px 14px;border:1px solid #e2e8f0;color:#334155;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h2 style="margin:0 0 12px;">New contact form submission</h2>
      <p style="margin:0 0 18px;color:#475569;">A visitor submitted consultation details from the ShikhaFatToSlim website.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px;">${htmlRows}</table>
    </div>`;

  return [
    `From: "${safeFromName}" <${from}>`,
    `To: <${to}>`,
    "Subject: New consultation request - ShikhaFatToSlim Website",
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@shikhafattoslim.com>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    textBody,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    htmlBody,
    "",
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

function dotStuff(message: string) {
  return message.replace(/^\./gm, "..");
}

function readResponse(socket: tls.TLSSocket): Promise<SmtpResponse> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("timeout", onTimeout);
    };

    const finish = (message: string) => {
      const match = message.match(/(?:^|\r\n)(\d{3}) [^\r\n]*\r\n$/);

      if (!match) {
        return;
      }

      cleanup();
      resolve({ code: Number(match[1]), message: message.trim() });
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      finish(buffer);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onTimeout = () => {
      cleanup();
      reject(new Error("SMTP connection timed out."));
    };

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("timeout", onTimeout);
  });
}

async function sendCommand(
  socket: tls.TLSSocket,
  command: string,
  expectedCodes: number[],
) {
  socket.write(`${command}\r\n`);
  const response = await readResponse(socket);

  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed with ${response.code}: ${response.message}`);
  }

  return response;
}

function connectSmtp(host: string, port: number): Promise<tls.TLSSocket> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host });

    socket.setTimeout(20000);
    socket.once("secureConnect", () => resolve(socket));
    socket.once("error", reject);
  });
}

async function sendMail(fields: MailFields) {
  const config = getSmtpConfig();
  const socket = await connectSmtp(config.host, config.port);

  try {
    const greeting = await readResponse(socket);

    if (greeting.code !== 220) {
      throw new Error(`SMTP greeting failed with ${greeting.code}: ${greeting.message}`);
    }

    await sendCommand(socket, "EHLO shikhafattoslim.com", [250]);

    const auth = Buffer.from(`\u0000${config.user}\u0000${config.pass}`).toString(
      "base64",
    );
    await sendCommand(socket, `AUTH PLAIN ${auth}`, [235]);
    await sendCommand(socket, `MAIL FROM:<${config.user}>`, [250]);
    await sendCommand(socket, `RCPT TO:<${config.to}>`, [250, 251]);
    await sendCommand(socket, "DATA", [354]);

    const email = buildEmail(fields, config.user, config.fromName, config.to);
    socket.write(`${dotStuff(email)}\r\n.\r\n`);

    const dataResponse = await readResponse(socket);

    if (dataResponse.code !== 250) {
      throw new Error(
        `SMTP message send failed with ${dataResponse.code}: ${dataResponse.message}`,
      );
    }

    await sendCommand(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ConsultationPayload;
    const fields = validatePayload(payload);

    await sendMail(fields);

    return Response.json({
      message: "Thank you. Your details have been sent successfully.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return Response.json({ message }, { status: 400 });
  }
}
