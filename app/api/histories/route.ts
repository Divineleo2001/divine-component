import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createHistory,
  deleteHistory,
  updateHistory,
} from "@/lib/api/histories/mutations";
import { 
  historyIdSchema,
  insertHistoryParams,
  updateHistoryParams 
} from "@/lib/db/schema/histories";

export async function POST(req: Request) {
  try {
    const validatedData = insertHistoryParams.parse(await req.json());
    const { success } = await createHistory(validatedData);

    revalidatePath("/histories"); // optional - assumes you will have named route same as entity

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

    const validatedData = updateHistoryParams.parse(await req.json());
    const validatedParams = historyIdSchema.parse({ id });

    const { success } = await updateHistory(validatedParams.id, validatedData);

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

    const validatedParams = historyIdSchema.parse({ id });
    const { success } = await deleteHistory(validatedParams.id);

    return NextResponse.json(success, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
