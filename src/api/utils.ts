// Temporary fix - need to find out why env variable set up is not working in railway.
const VITE_API_URL = "https://climbjournal-production-12d7.up.railway.app";
// const VITE_API_URL = import.meta.env.VITE_API_URL;

export type ApiResponse<T> =
  | { ok: true; status: number; data: T | undefined }
  | { ok: false; status: number; error: string; errors: (ApiFormErrors | undefined) };

export type ApiFormErrors = {
  [field: string]: string[]
};

export type GenericActionResponse = { success: boolean; }

export async function fetchApi<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const url = `${VITE_API_URL}${path}`;
    const response = await fetch(url, { ...init, credentials: "include" });
    const text = await response.text();
    let data = undefined;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    const error: string | undefined = response.ok
      ? undefined
      : typeof data === "object" && data !== null
        ? (("error" in data && typeof data.error === "string" && data.error) ||
          ("message" in data && typeof data.message === "string" && data.message) ||
          `Request failed with status ${response.status}`)
        : `Request failed with status ${response.status}`;

    const errors: ApiFormErrors | undefined = response.ok
      ? undefined
      : typeof data === "object" && data !== null && "errors" in data
        ? (data.errors as ApiFormErrors | undefined)
        : undefined;

    return response.ok
      ? { ok: true, status: response.status, data: data as T | undefined }
      : { ok: false, status: response.status, error: error ?? `Request failed with status ${response.status}`, errors };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err.message || "Network error",
      errors: undefined
    };
  }
}
