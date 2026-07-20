import { NextResponse } from "next/server";

// این route هنوز به Stripe وصل نشده است.
// وقتی کلیدهای Stripe را آماده کردی، اینجا باید یک
// Stripe Checkout Session ساخته شود و آدرس آن برگردانده شود.
export async function POST() {
  return NextResponse.json(
    { error: "Stripe is not configured yet." },
    { status: 501 }
  );
}
