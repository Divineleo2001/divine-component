import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPatientDisability,
  deletePatientDisability,
  updatePatientDisability,
} from "@/lib/api/patientDisabilities/mutations";
import { 
  patientDisabilityIdSchema,
  insertPatientDisabilityParams,
  updatePatientDisabilityParams 
} from "@/lib/db/schema/patientDisabilities";

export async function POST(req: Request) {
  try {
    const validatedData = insertPatientDisabilityParams.parse(await req.json());
    const { success } = await createPatientDisability(validatedData);

    revalidatePath("/patientDisabilities"); // optional - assumes you will have named route same as entity

    return NextResponse.json(success, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updatePatientDisabilityParams.parse(await req.json());
    const validatedParams = patientDisabilityIdSchema.parse({ id });

    const { success } = await updatePatientDisability(validatedParams.id, validatedData);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = patientDisabilityIdSchema.parse({ id });
    const { success } = await deletePatientDisability(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
