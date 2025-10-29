// Global handler for 403 logout
let globalLogoutHandler: (() => void) | null = null;

export function setGlobalLogoutHandler(fn: () => void) {
  globalLogoutHandler = fn;
}
export interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  interceptRequest?: (
    input: RequestInfo,
    init?: RequestInit
  ) =>
    | Promise<{ input: RequestInfo; init?: RequestInit }>
    | { input: RequestInfo; init?: RequestInit };
  interceptResponse?: (response: Response) => Promise<Response> | Response;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private interceptRequest?: ApiClientOptions["interceptRequest"];
  private interceptResponse?: ApiClientOptions["interceptResponse"];
  private token: string | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || "http://localhost:4000";
    this.headers = options.headers || {};
    this.interceptRequest = options.interceptRequest;
    // Add default interceptResponse for 403 handling
    this.interceptResponse = async (response: Response) => {
      if (response.status === 403 && globalLogoutHandler) {
        globalLogoutHandler();
      }
      return response;
    };
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    let input: RequestInfo = this.baseUrl + path;
    let reqInit: RequestInit = {
      ...init,
      headers: { ...this.headers, ...(init.headers || {}) },
    };
    if (this.token) {
      (reqInit.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${this.token}`;
    }
    if (this.interceptRequest) {
      const intercepted = await this.interceptRequest(input, reqInit);
      input = intercepted.input;
      reqInit = intercepted.init || reqInit;
    }
    const response = await fetch(input, reqInit);
    if (this.interceptResponse) {
      const interceptedResponse = this.interceptResponse(response);
      if (interceptedResponse instanceof Promise) {
        const res = await interceptedResponse;
        return res.json();
      } else {
        return interceptedResponse.json();
      }
    }
    return response.json();
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  async post<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
