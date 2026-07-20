import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderImage } from "@/lib/render";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_STYLES = ["photorealistic", "night", "sketch", "warm"] as const;
const MAX_IMAGE_BYTES = 6 * 1024 * 1024; // ~۶ مگابایت

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // حداکثر ۱۰ درخواست رندر در دقیقه برای هر کاربر —
  // جدا از سقف پلن ماهانه، جلوی اسپم سریع رو هم می‌گیره
  const { allowed } = rateLimit(`render:${session.user.id}`, 10, 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "تعداد درخواست‌های شما زیاد است، کمی صبر کنید" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "بدنه‌ی درخواست نامعتبر است" }, { status: 400 });
  }

  const { imageDataUrl, style } = (body ?? {}) as {
    imageDataUrl?: unknown;
    style?: unknown;
  };

  if (!imageDataUrl || typeof imageDataUrl !== "string") {
    return NextResponse.json({ error: "تصویری ارسال نشده" }, { status: 400 });
  }

  // تخمین حجم واقعی base64 (هر ۴ کاراکتر ≈ ۳ بایت)
  const approxBytes = (imageDataUrl.length * 3) / 4;
  if (approxBytes > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "حجم تصویر خیلی زیاد است (حداکثر ۶ مگابایت)" },
      { status: 413 }
    );
  }

  // هرگز مقدار style را مستقیم از کاربر قبول نکن؛ فقط مقادیر مجاز
  const safeStyle = ALLOWED_STYLES.includes(style as (typeof ALLOWED_STYLES)[number])
    ? (style as string)
    : "photorealistic";

  try {
    // چک کردن سقف تعداد رندر بر اساس پلن (نمونه‌ی ساده)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const renderCountThisMonth = await prisma.render.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const limit = user?.plan === "pro" ? 100 : user?.plan === "studio" ? 500 : 5;

    if (renderCountThisMonth >= limit) {
      return NextResponse.json(
        { error: "سقف رندر ماهانه‌ی پلن شما تمام شده است" },
        { status: 403 }
      );
    }

    let resultUrl: string;
    try {
      resultUrl = await renderImage(imageDataUrl, safeStyle);
    } catch (err) {
      console.error("خطا در renderImage:", err);
      const message = err instanceof Error ? err.message : "خطای نامشخص در رندرگیری";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const render = await prisma.render.create({
      data: {
        userId: session.user.id,
        originalUrl: imageDataUrl,
        resultUrl,
        style: safeStyle,
        status: "completed",
      },
    });

    return NextResponse.json(render);
  } catch (err) {
    console.error("خطا در ایجاد رندر:", err);
    return NextResponse.json(
      { error: "خطای سرور، لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
