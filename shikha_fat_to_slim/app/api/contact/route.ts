import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type ConsultationPayload = {
  name?: unknown;
  phone?: unknown;
  weight?: unknown;
  goal?: unknown;
};

type LeadFields = {
  name: string;
  phone: string;
  weight: string;
  goal: string;
};

const allowedGoals = new Set(["Weight loss", "Weight gain", "Other"]);

function readField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: ConsultationPayload): LeadFields {
  const fields = {
    name: readField(payload.name),
    phone: readField(payload.phone),
    weight: readField(payload.weight),
    goal: readField(payload.goal),
  };

  if (!fields.name || !fields.phone || !fields.weight || !fields.goal) {
    throw new Error("Please fill in every field.");
  }

  if (!allowedGoals.has(fields.goal)) {
    throw new Error("Please choose a valid goal.");
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
