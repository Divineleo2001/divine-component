import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createComorbidity,
  deleteComorbidity,
  updateComorbidity,
} from "@/lib/api/comorbidities/mutations";
import { 
  comorbidityIdSchema,
  insertComorbidityParams,
  updateComorbidityParams 
} from "@/lib/db/schema/comorbidities";

export async function POST(req: Request) {
  try {
    const validatedData = insertComorbidityParams.parse(await req.json());
    const { success } = await createComorbidity(validatedData);

    revalidatePath("/comorbidities"); // optional - assumes you will have named route same as entity

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

    const validatedData = updateComorbidityParams.parse(await req.json());
    const validatedParams = comorbidityIdSchema.parse({ id });

    const { success } = await updateComorbidity(validatedParams.id, validatedData);

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

    const validatedParams = comorbidityIdSchema.parse({ id });
    const { success } = await deleteComorbidity(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
