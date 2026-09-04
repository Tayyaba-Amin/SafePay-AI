const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AnalysisResult {
  risk_level: string;
  risk_score: number;
  threat_category: string;
  threat_category_urdu?: string;
  detected_indicators: string[];
  detected_indicators_urdu?: string[];
  explanation: string;
  explanation_urdu: string;
  recommended_action: string;
  recommended_action_urdu: string;
  language: string;
  visible_receipt_information?: Record<string, string> | null;
  transcript?: string | null;
}

export interface ApiError {
  detail: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `Request failed with status ${response.status}`,
    }));
    throw new Error(error.detail);
  }
  return response.json();
}

function uploadFile(endpoint: string, file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  }).then((r) => handleResponse<AnalysisResult>(r));
}

export function analyzeReceipt(file: File): Promise<AnalysisResult> {
  return uploadFile("/api/receipt/analyze", file);
}

export function analyzeMessageText(message: string): Promise<AnalysisResult> {
  return fetch(`${API_URL}/api/message/analyze-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }).then((r) => handleResponse<AnalysisResult>(r));
}

export function analyzeVoice(file: File): Promise<AnalysisResult> {
  return uploadFile("/api/voice/analyze", file);
}

export async function checkHealth(): Promise<{
  status: string;
  service: string;
  version: string;
}> {
  const res = await fetch(`${API_URL}/health`);
  return handleResponse(res);
}
