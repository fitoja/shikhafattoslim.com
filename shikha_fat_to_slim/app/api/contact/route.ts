import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type ConsultationPayload = {
  name?: unknown;
  phone?: unknown;
  height?: unknown;
  weight?: unknown;
  age?: unknown;
};

type LeadFields = {
  name: string;
  phone: string;
  height: string;
  weight: string;
  age: string;
};

function readField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: ConsultationPayload): LeadFields {
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

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ConsultationPayload;
    const fields = validatePayload(payload);
    const now = new Date();
    const db = await getDb();

    await db.collection("leads").insertOne({
      ...fields,
      status: "new",
      notes: "",
      source: "website",
      createdAt: now,
      updatedAt: now,
    });

    return Response.json({
      message: "Thank you. Our team will contact you soon.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return Response.json({ message }, { status: 400 });
  }
}
