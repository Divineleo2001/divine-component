import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createDisability,
  deleteDisability,
  updateDisability,
} from "@/lib/api/disabilities/mutations";
import { 
  disabilityIdSchema,
  insertDisabilityParams,
  updateDisabilityParams 
} from "@/lib/db/schema/disabilities";

export async function POST(req: Request) {
  try {
    const validatedData = insertDisabilityParams.parse(await req.json());
    const { success } = await createDisability(validatedData);

    revalidatePath("/disabilities"); // optional - assumes you will have named route same as entity

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

    const validatedData = updateDisabilityParams.parse(await req.json());
    const validatedParams = disabilityIdSchema.parse({ id });

    const { success } = await updateDisability(validatedParams.id, validatedData);

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

    const validatedParams = disabilityIdSchema.parse({ id });
    const { success } = await deleteDisability(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
