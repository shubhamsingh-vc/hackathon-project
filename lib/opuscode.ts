// OpusCode API client — Anthropic-compatible format

const BASE_URL = process.env.OPUSCODE_BASE_URL || "https://claude.opuscode.pro";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface OpusCodeResponse {
  id: string;
  type: string;
  role: string;
  model: string;
  content: Array<{ type: string; text?: string; thinking?: string }>;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
  base_resp?: {
    status_code: number;
    status_msg: string;
  };
}

export async function createMessage(
  model: string,
  messages: Message[],
  maxTokens: number,
  stream = false
): Promise<OpusCodeResponse> {
  const apiKey = process.env.OPUSCODE_API_KEY;

  if (!apiKey) {
    throw new Error("OPUSCODE_API_KEY is not set");
  }

  const response = await fetch(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpusCode API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<OpusCodeResponse>;
}

export function extractText(response: OpusCodeResponse): string {
  return (
    response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text ?? "")
      .join("")
  );
}
