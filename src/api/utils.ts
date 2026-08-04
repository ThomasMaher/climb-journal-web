export const API_URL = "http://localhost:3000";

export type ApiResponse<T> =
  | { ok: true; status: number; data: T | null }
  | { ok: false; status: number; errors: (ApiError | ApiFormError)[] };

export type ApiError = { isRetryable: boolean; message: string; };
export type ApiFormError = ApiError & {
  fieldErrors: { [field: string]: string[] } 
};

// const _x: unknown = true;
// if(typeof _x === "number") {
//   const _y = _x + 1;
// }

// const _x2: any = true;
// const _y2 = _x2 + 1;

type ApiResponses =
  | { path: "/boulders"; value: unknown }
  | { path: "/sessions"; value: unknown }
  | { path: "/user_status.json"; value: unknown }
  | { path: "/login.json"; value: unknown }
  | { path: "/logout"; value: unknown }
  | { path: `/sessions/${string}`; value: unknown }
  | {
      path: "/home_stats.json";
      value: {
        total_sessions: number;
        highest_grade: number;
        avg_grade_sent: number;
        most_frequented_gym: string;
        sends_by_grade: {
          vgrade: number;
          sends: number;
        }[];
      };
    };

type Paths = ApiResponses["path"];

export async function fetchApi<const Path extends Paths>(
  path: Path,
  init?: RequestInit,
): Promise<ApiResponse<Extract<ApiResponses, { path: Path }>["value"]>> {
  try {
    const url = `${API_URL}${path}`;
    const response = await fetch(url, { ...init, credentials: "include" });
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    const error = response.ok
      ? undefined
      : typeof data === "object" && data
        ? ("error" in data && data?.error) ||
          ("message" in data && data?.message)
        : `Request failed with status ${response.status}`;

    return response.ok
      ? { ok: true, status: response.status, data: data as any }
      : { ok: false, status: response.status, errors: error };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      errors: { message: err?.message || "Network error" },
    };
  }
}
