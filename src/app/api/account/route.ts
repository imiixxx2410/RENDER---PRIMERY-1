import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const accountUpdateSchema = z.object({
  name: z.string().max(80).optional(),
  bio: z.string().max(500).optional(),
  website: z
    .union([z.string().url("آدرس وب‌سایت معتبر نیست").max(200), z.literal("")])
    .optional(),
  isPublic: z.boolean().optional(),
  avatarUrl: z.string().max(2000).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const rendersThisMonth = await prisma.render.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    });

    return NextResponse.json({
      email: user?.email,
      name: user?.name,
      avatarUrl: user?.avatarUrl,
      bio: user?.bio,
      website: user?.website,
      isPublic: user?.isPublic,
      plan: user?.plan,
      rendersThisMonth,
    });
  } catch (err) {
    console.error("خطا در دریافت اطلاعات حساب:", err);
    return NextResponse.json(
      { error: "خطای سرور، لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بدنه‌ی درخواست نامعتبر است" }, { status: 400 });
  }

  const parsed = accountUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "ورودی نامعتبر است" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, name: user.name });
  } catch (err) {
    console.error("خطا در به‌روزرسانی حساب:", err);
    return NextResponse.json(
      { error: "خطای سرور، لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
