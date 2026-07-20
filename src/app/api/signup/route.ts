import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const signupSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست").max(254),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .max(72, "رمز عبور خیلی طولانی است"),
  name: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  // حداکثر ۵ تلاش ثبت‌نام در هر ساعت برای هر IP —
  // جلوگیری از ساخت انبوه اکانت رایگان توسط بات‌ها
  const ip = getClientIp(req);
  const { allowed } = rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "تعداد درخواست‌های شما زیاد است، کمی بعد دوباره تلاش کنید" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بدنه‌ی درخواست نامعتبر است" }, { status: 400 });
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "ورودی نامعتبر است" },
      { status: 400 }
    );
  }

  const { email, password, name } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "این ایمیل قبلا ثبت شده است" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, hashedPassword, name },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("خطا در ثبت‌نام:", err);
    return NextResponse.json(
      { error: "خطای سرور، لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
