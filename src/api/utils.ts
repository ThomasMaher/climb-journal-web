import type { UserData, UserStats } from '../models/user_models';
import type { Session, SessionClimbBoulder, SessionApiResponse } from '../models/climbing_models';

export const API_URL = "http://localhost:3000";

export type ApiResponse<T> =
  | { ok: true; status: number; data: T | null }
  | { ok: false; status: number; error: string; errors: (ApiFormError | undefined) };

export type ApiFormError = {
  fieldErrors: { [field: string]: string[] } 
};

export type GenericActionResponse = { success: boolean; }

type ApiResponses =
    { path: "/boulders"; value: SessionClimbBoulder[] }
  | { path: "/home_stats"; value: UserStats }
  | { path: "/users"; value: UserData }
  | { path: "/sessions"; value: Session[] }
  | { path: "/user_status"; value: UserData }
  | { path: "/login"; value: UserData }
  | { path: "/logout"; value: unknown }
  | { path: `/sessions/${string}`; value: SessionApiResponse | GenericActionResponse }

type Paths = ApiResponses["path"];
type ResponseValue<Path extends Paths> =
  Path extends "/boulders" ? SessionClimbBoulder[] :
  Path extends "/home_stats" ? UserStats :
  Path extends "/users" ? UserData :
  Path extends "/sessions" ? Session[] :
  Path extends "/user_status" ? UserData :
  Path extends "/login" ? UserData :
  Path extends "/logout" ? unknown :
  Path extends `/sessions/${string}` ? SessionApiResponse | GenericActionResponse :
  never;

export async function fetchApi<const Path extends Paths>(
  path: Path,
  init?: RequestInit,
): Promise<ApiResponse<ResponseValue<Path>>> {
  try {
    const url = `${API_URL}${path}`;
    const response = await fetch(url, { ...init, credentials: "include" });
    const text = await response.text();
    let data: ResponseValue<Path> | null = null;

    if (text) {
      try {
        data = JSON.parse(text) as ResponseValue<Path>;
      } catch {
        data = text as unknown as ResponseValue<Path>;
      }
    }

    const error: string | undefined = response.ok
      ? undefined
      : typeof data === "object" && data !== null
        ? (("error" in data && typeof data.error === "string" && data.error) ||
          ("message" in data && typeof data.message === "string" && data.message) ||
          `Request failed with status ${response.status}`)
        : `Request failed with status ${response.status}`;

    const errors: ApiFormError | undefined = response.ok
      ? undefined
      : typeof data === "object" && data !== null && "errors" in data
        ? (data.errors as ApiFormError | undefined)
        : undefined;

    return response.ok
      ? { ok: true, status: response.status, data }
      : { ok: false, status: response.status, error: error ?? `Request failed with status ${response.status}`, errors };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: "Network error",
      errors: undefined
    };
  }
}
