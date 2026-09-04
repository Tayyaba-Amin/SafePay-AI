import type { AnalysisResult } from "./api";

/**
 * Realistic mock analysis results for demo / offline UI testing.
 * The analyzer pages use these when the backend is unreachable.
 */

export const MOCK_RECEIPT_RESULT: AnalysisResult = {
  risk_level: "High",
  risk_score: 82,
  threat_category: "Tampered Payment Receipt",
  threat_category_urdu: "ہیرا پھیری شدہ رسید",
  detected_indicators: [
    "Transaction amount appears digitally altered — font mismatch between amount and rest of receipt",
    "Merchant name does not match any registered business in the payment network",
    "Date/time stamp format inconsistent with standard JazzCash/Easypaisa receipts",
    "Missing transaction reference ID typically present on genuine receipts",
  ],
  detected_indicators_urdu: [
    "لین دین کی رقم ڈیجیٹل طور پر تبدیل شدہ لگتی ہے — رقم اور باقی رسید کے درمیان فونٹ کا فرق",
    "دکاندار کا نام پیمنٹ نیٹ ورک میں کسی بھی رجسٹرڈ کاروبار سے میل نہیں کھاتا",
    "تاریخ/وقت کی مہر کا فارمیٹ JazzCash/Easypaisa کی معیاری رسیدوں سے مختلف ہے",
    "ٹرانزیکشن ریفرنس آئی ڈی غائب ہے جو عام طور پر اصلی رسیدوں پر موجود ہوتی ہے",
  ],
  visible_receipt_information: {
    sender: "03**‑*******",
    recipient: "Unknown Merchant",
    amount: "PKR 45,000",
    currency: "PKR",
    date_time: "2026-09-03 14:22",
    status: "Payment Successful",
    transaction_id: "",
    payment_platform: "JazzCash",
  },
  explanation:
    "This receipt shows multiple signs of digital manipulation. The transaction amount appears to have been edited after the original screenshot was taken. The merchant name cannot be verified, and the receipt format does not match known templates from Pakistani mobile payment providers. This is not an official verification — please confirm the transaction in your payment app.",
  explanation_urdu:
    "یہ رسید ڈیجیٹل ہیرا پھیری کی متعدد علامات دکھاتی ہے۔ لین دین کی رقم اصل اسکرین شاٹ لینے کے بعد تبدیل کی گئی لگتی ہے۔ دکاندار کا نام پاکستانی موبائل پیمنٹ فراہم کنندگان کی معروف رسیدوں سے میل نہیں کھاتا۔ یہ آفیشل تصدیق نہیں ہے — براہ کرم اپنی پیمنٹ ایپ میں ٹرانزیکشن کی تصدیق کریں۔",
  recommended_action:
    "Do not accept this receipt as proof of payment. Ask the sender to share the transaction directly from their payment app, or verify the transaction ID with your bank.",
  recommended_action_urdu:
    "اس رسید کو ادائیگی کے ثبوت کے طور پر قبول نہ کریں۔ بھیجنے والے سے کہیں کہ وہ اپنی پیمنٹ ایپ سے براہ راست ٹرانزیکشن شیئر کریں، یا اپنے بینک سے ٹرانزیکشن آئی ڈی کی تصدیق کریں۔",
  language: "English",
};

export const MOCK_MESSAGE_RESULT: AnalysisResult = {
  risk_level: "Critical",
  risk_score: 95,
  threat_category: "Phishing / Account Takeover Attempt",
  threat_category_urdu: "فشنگ / اکاؤنٹ پر قبضے کی کوشش",
  detected_indicators: [
    "Message claims your account will be blocked — classic urgency/pressure tactic",
    "Contains a suspicious shortened URL not linked to any official bank domain",
    "Sender number is a personal mobile, not an official bank shortcode",
    "Requests personal information (CNIC, OTP, or account details) — banks never ask this via SMS",
    "Grammar and formatting inconsistencies suggest mass-produced scam template",
  ],
  detected_indicators_urdu: [
    "پیغام میں دعویٰ ہے کہ آپ کا اکاؤنٹ بلاک ہو جائے گا — کلاسک جلدی/دباؤ کا ہتھکنڈہ",
    "ایک مشتبہ مختصر URL شامل ہے جو کسی آفیشل بینک ڈومین سے منسلک نہیں ہے",
    "بھیجنے والا نمبر ایک ذاتی موبائل ہے، آفیشل بینک شارٹ کوڈ نہیں",
    "ذاتی معلومات مانگتا ہے (CNIC، OTP، یا اکاؤنٹ کی تفصیلات) — بینک SMS کے ذریعے ایسا کبھی نہیں مانگتے",
    "گرامر اور فارمیٹنگ کی بے ضابطگیاں بڑے پیمانے پر تیار کردہ اسکیم ٹیمپلیٹ کی نشاندہی کرتی ہیں",
  ],
  explanation:
    "This message is a textbook phishing attempt. It uses fear (account blocking) to pressure you into clicking a malicious link. Legitimate banks in Pakistan never ask for OTPs, PINs, or CNIC numbers via SMS or WhatsApp. The link leads to a fake website designed to steal your credentials. Delete this message immediately.",
  explanation_urdu:
    "یہ پیغام ایک واضح فشنگ کوشش ہے۔ یہ خوف (اکاؤنٹ بلاک ہونے) کا استعمال کرتا ہے تاکہ آپ کو ایک نقصان دہ لنک پر کلک کرنے پر مجبور کرے۔ پاکستان میں قانونی بینک کبھی بھی SMS یا WhatsApp کے ذریعے OTP، PIN، یا CNIC نمبر نہیں مانگتے۔ یہ لنک ایک جعلی ویب سائٹ کی طرف لے جاتا ہے جو آپ کی معلومات چوری کرنے کے لیے بنائی گئی ہے۔ اس پیغام کو فوری طور پر حذف کریں۔",
  recommended_action:
    "Do NOT click any links. Do NOT reply. Block this number immediately. If you are concerned about your account, call your bank directly using the number on the back of your card.",
  recommended_action_urdu:
    "کسی بھی لنک پر کلک نہ کریں۔ جواب نہ دیں۔ اس نمبر کو فوری طور پر بلاک کریں۔ اگر آپ کو اپنے اکاؤنٹ کی فکر ہے تو اپنے کارڈ کے پیچھے دیے گئے نمبر پر اپنے بینک کو براہ راست کال کریں۔",
  language: "English",
};

export const MOCK_VOICE_RESULT: AnalysisResult = {
  risk_level: "Medium",
  risk_score: 58,
  threat_category: "Impersonation / Social Engineering Call",
  threat_category_urdu: "نقلی پہچان / سماجی ہیرا پھیری کی کال",
  detected_indicators: [
    "Caller claims to be from a bank but does not provide an employee ID or callback number",
    "Requests verification of account details over the phone",
    "Creates a sense of urgency — mentions 'suspicious activity' requiring immediate action",
    "Background audio suggests a call center environment, not an official bank helpline",
  ],
  detected_indicators_urdu: [
    "کالر بینک کا دعویٰ کرتا ہے لیکن ملازم کی آئی ڈی یا کال بیک نمبر فراہم نہیں کرتا",
    "فون پر اکاؤنٹ کی تفصیلات کی تصدیق مانگتا ہے",
    "جلدی کا احساس پیدا کرتا ہے — 'مشتبہ سرگرمی' کا ذکر کرتا ہے جس کے لیے فوری اقدام ضروری ہے",
    "پس منظر کی آواز کال سینٹر ماحول کی نشاندہی کرتی ہے، آفیشل بینک ہیلپ لائن نہیں",
  ],
  transcript:
    "Hello, this is Ahmed from HBL customer support. We have detected suspicious activity on your account. Your account may be blocked if you do not verify your details right now. Please confirm your account number and the last four digits of your CNIC so we can secure your account immediately.",
  explanation:
    "This recording contains several social engineering red flags. The caller claims bank authority without proper identification and pressures the listener to act immediately. While not definitively a scam, these patterns match common impersonation tactics. Always independently verify by calling your bank's official helpline.",
  explanation_urdu:
    "اس ریکارڈنگ میں کئی سوشل انجینئرنگ کی سرخ جھنڈیاں ہیں۔ کالر بینک کا دعویٰ کرتا ہے بغیر مناسب شناخت کے اور سننے والے پر فوری عمل کا دباؤ ڈالتا ہے۔ اگرچہ یہ یقینی طور پر اسکیم نہیں ہے، لیکن یہ پیٹرن عام نقلی ہیرا پھیری کے حربوں سے میل کھاتے ہیں۔ ہمیشہ اپنے بینک کی آفیشل ہیلپ لائن پر کال کرکے آزادانہ تصدیق کریں۔",
  recommended_action:
    "Hang up. Do not share any personal or account information. Call your bank's official helpline (from their website or your card) to verify if there is actually an issue with your account.",
  recommended_action_urdu:
    "فون رکھ دیں۔ کوئی ذاتی یا اکاؤنٹ کی معلومات شیئر نہ کریں۔ اپنے بینک کی آفیشل ہیلپ لائن پر کال کریں (ان کی ویب سائٹ یا اپنے کارڈ سے) تاکہ تصدیق ہو سکے کہ آیا واقعی آپ کے اکاؤنٹ میں کوئی مسئلہ ہے۔",
  language: "English",
};

/** Returns mock data after a brief delay to simulate real analysis. */
export async function getMockResult(
  type: "receipt" | "message" | "voice"
): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 2000));
  switch (type) {
    case "receipt":
      return MOCK_RECEIPT_RESULT;
    case "message":
      return MOCK_MESSAGE_RESULT;
    case "voice":
      return MOCK_VOICE_RESULT;
  }
}
