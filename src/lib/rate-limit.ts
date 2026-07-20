/**
 * محدودکننده‌ی نرخ درخواست، ساده و درون‌حافظه‌ای (in-memory).
 *
 * ⚠️ محدودیت مهم: این پیاده‌سازی فقط برای یک instance تکی از سرور درست کار می‌کند.
 * اگر پروژه روی چند instance/container همزمان (مثلاً چند سرور پشت لود بالانسر،
 * یا چند serverless function جدا) دیپلوی شود، هر instance حافظه‌ی جدای خودش را
 * دارد و این محدودیت به‌درستی اعمال نمی‌شود.
 *
 * برای production واقعی، این را با یک storage مشترک مثل Redis
 * (مثلاً پکیج @upstash/ratelimit) جایگزین کن.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// جلوگیری از نشتی حافظه: هر چند وقت یک‌بار bucket های منقضی‌شده را پاک کن
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
