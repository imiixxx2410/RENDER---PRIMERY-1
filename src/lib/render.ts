/**
 * اتصال واقعی به AvalAI (مدل تصویری Gemini).
 *
 * عکس ورودی (به‌صورت data URL) + یک دستور متنی متناسب با استایل
 * انتخاب‌شده به API فرستاده می‌شود و عکس نتیجه برگردانده می‌شود.
 *
 * نیازمند متغیر محیطی AVALAI_API_KEY در فایل .env
 */

// دستور متنی برای هر استایل — هر وقت خواستی می‌تونی این متن‌ها را دقیق‌تر کنی
const STYLE_PROMPTS: Record<string, string> = {
  photorealistic:
    "این تصویر معماری را به یک رندر فوق واقع‌گرایانه (photorealistic) با نور روز طبیعی و متریال‌های واقعی تبدیل کن. ساختار و زاویه‌ی اصلی عکس را حفظ کن.",
  night:
    "این تصویر معماری را به یک رندر شبانه (night render) با نورپردازی مصنوعی گرم و آسمان تاریک تبدیل کن. ساختار و زاویه‌ی اصلی عکس را حفظ کن.",
  sketch:
    "این تصویر معماری را به یک طرح اسکیس دستی با جوهر سیاه‌وسفید (ink sketch) تبدیل کن. ساختار و زاویه‌ی اصلی عکس را حفظ کن.",
  warm:
    "این تصویر معماری را با فضای داخلی گرم، نورپردازی دنج و رنگ‌های سپیا بازسازی کن. ساختار و زاویه‌ی اصلی عکس را حفظ کن.",
};

export async function renderImage(
  imageUrl: string,
  style: string
): Promise<string> {
  const prompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.photorealistic;

  const response = await fetch("https://api.avalai.ir/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AVALAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-3.1-flash-lite-image",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      modalities: ["image", "text"],
      generationConfig: {
        imageConfig: { imageSize: "1K" },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`خطا از سمت AvalAI (${response.status}): ${errText}`);
  }

  const data = await response.json();
  console.log("پاسخ خام AvalAI:", JSON.stringify(data, null, 2));

  const resultImage: string | undefined =
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!resultImage) {
    throw new Error("عکس نتیجه‌ای از API دریافت نشد");
  }

  return resultImage;
}
