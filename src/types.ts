import type { FetchFn, openai } from "chatgpt";

export interface ChatContext {
  conversationId?: string;
  parentMessageId?: string;
  accessToken?: string;
}

export interface ChatGPTAPIOptions {
  apiKey: string;
  debug?: boolean;
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string;
  apiReverseProxyUrl?: string;
  model?: string;
  debug?: boolean;
  headers?: Record<string, string>;
  fetch?: FetchFn;
}

export interface ModelConfig {
  apiModel?: ApiModel;
  reverseProxy?: string;
  timeoutMs?: number;
  socksProxy?: string;
}

export interface TokenUsageInfo {
  uid: string;
  lastRequestTimestamp: number;
}

export interface CreateAppConfig {
  phone: string;
  appName: string;
  appDescription: string;
  appIcon: string;
  formAttributeArray: FormAttribute[];
  prompt: string;
}

export interface FormAttribute {
  tag: string;
  variableName: string;
  label: string;
  placeholder: string;
  defaultValue: string;
}

export type ApiModel = "ChatGPTAPI" | "ChatGPTUnofficialProxyAPI" | undefined;
