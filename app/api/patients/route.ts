import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createPatient,
  deletePatient,
  updatePatient,
} from "@/lib/api/patients/mutations";
import { 
  patientIdSchema,
  insertPatientParams,
  updatePatientParams 
} from "@/lib/db/schema/patients";

export async function POST(req: Request) {
  try {
    const validatedData = insertPatientParams.parse(await req.json());
    const { success } = await createPatient(validatedData);

    revalidatePath("/patients"); // optional - assumes you will have named route same as entity

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

    const validatedData = updatePatientParams.parse(await req.json());
    const validatedParams = patientIdSchema.parse({ id });

    const { success } = await updatePatient(validatedParams.id, validatedData);

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

    const validatedParams = patientIdSchema.parse({ id });
    const { success } = await deletePatient(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
