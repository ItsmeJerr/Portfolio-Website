import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const SUPABASE_DATE_FIELDS = ["createdAt", "updatedAt"];

function buildResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function buildErrorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function parseUrl(url: string) {
  const parsed = new URL(url, "http://localhost");
  const pathname = parsed.pathname.replace(/^\/api\//, "");
  return { pathname, searchParams: parsed.searchParams };
}

function normalizeRecord(record: any) {
  if (record?.images && typeof record.images === "string") {
    try {
      record.images = JSON.parse(record.images);
    } catch {
      record.images = [];
    }
  }
  return record;
}

function normalizeRecords(records: any[]) {
  return records.map(normalizeRecord);
}

function preparePayload(path: string, payload: any) {
  const table = path.split("/")[0];
  if (table === "experiences" && payload?.images) {
    if (Array.isArray(payload.images)) {
      payload.images = JSON.stringify(payload.images);
    }
  }
  return payload;
}

async function handleGet(path: string, searchParams: URLSearchParams) {
  const table = path.split("/")[0];
  switch (table) {
    case "profile": {
      const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || null);
    }
    case "skills": {
      const { data, error } = await supabase.from("skills").select("*").order("proficiency");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    case "experiences": {
      const { data, error } = await supabase.from("experiences").select("*").order("start_date");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(normalizeRecords(data || []));
    }
    case "education": {
      const { data, error } = await supabase.from("education").select("*").order("year");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    case "certifications": {
      const { data, error } = await supabase.from("certifications").select("*").order("year");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    case "activities": {
      const { data, error } = await supabase.from("activities").select("*");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    case "articles": {
      let query = supabase.from("articles").select("*");
      if (searchParams.get("published") === "true") {
        query = query.eq("published", true);
      }
      if (searchParams.get("featured") === "true") {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    case "contact-messages": {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data || []);
    }
    default:
      return buildErrorResponse(`Unknown GET path ${path}`, 404);
  }
}

async function handlePost(path: string, body: any) {
  const table = path.split("/")[0];
  switch (table) {
    case "profile": {
      const profileData = preparePayload(path, body);
      const { data: existing, error: readError } = await supabase
        .from("profile")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (readError) return buildErrorResponse(readError.message, 500);
      if (existing?.id) {
        const { data, error } = await supabase
          .from("profile")
          .update(profileData)
          .eq("id", existing.id)
          .select("*");
        if (error) return buildErrorResponse(error.message, 500);
        return buildResponse(data?.[0] ?? null);
      }
      const { data, error } = await supabase.from("profile").insert(profileData).select("*");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data?.[0] ?? null, 201);
    }
    case "contact-messages": {
      const { data, error } = await supabase.from("contact_messages").insert(body).select("*");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data?.[0] ?? null, 201);
    }
    case "skills":
    case "experiences":
    case "education":
    case "certifications":
    case "activities":
    case "articles": {
      const payload = preparePayload(path, body);
      const { data, error } = await supabase.from(table).insert(payload).select("*");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data?.[0] ?? null, 201);
    }
    default:
      return buildErrorResponse(`Unknown POST path ${path}`, 404);
  }
}

async function handlePut(path: string, body: any) {
  const table = path.split("/")[0];
  const readMarkerMatch = path.match(/^(contact-messages)\/(\d+)\/read$/);

  if (readMarkerMatch) {
    const id = Number(readMarkerMatch[2]);
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id)
      .select("*");
    if (error) return buildErrorResponse(error.message, 500);
    return buildResponse(data?.[0] ?? null);
  }

  const idMatch = path.match(/\/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : undefined;

  if (table === "profile") {
    const payload = preparePayload(path, body);
    const { data: existing, error: readError } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (readError) return buildErrorResponse(readError.message, 500);
    if (existing?.id) {
      const { data, error } = await supabase
        .from("profile")
        .update(payload)
        .eq("id", existing.id)
        .select("*");
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data?.[0] ?? null);
    }
    const { data, error } = await supabase.from("profile").insert(payload).select("*");
    if (error) return buildErrorResponse(error.message, 500);
    return buildResponse(data?.[0] ?? null, 201);
  }

  if (!id) {
    return buildErrorResponse("Missing id for update", 400);
  }

  const payload = preparePayload(path, body);
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*");
  if (error) return buildErrorResponse(error.message, 500);
  return buildResponse(data?.[0] ?? null);
}

async function handleDelete(path: string) {
  const table = path.split("/")[0];
  const idMatch = path.match(/\/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : undefined;
  if (!id) {
    return buildErrorResponse("Missing id for delete", 400);
  }
  const { data, error } = await supabase.from(table).delete().eq("id", id).select("*");
  if (error) return buildErrorResponse(error.message, 500);
  return buildResponse(data?.[0] ?? null);
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const { pathname } = parseUrl(url);
    switch (method.toUpperCase()) {
      case "GET":
        return await handleGet(pathname, new URL(url, "http://localhost").searchParams);
      case "POST":
        return await handlePost(pathname, data);
      case "PUT":
        return await handlePut(pathname, data);
      case "DELETE":
        return await handleDelete(pathname);
      default:
        return buildErrorResponse(`Unsupported method ${method}`, 405);
    }
  } catch (err: any) {
    return buildErrorResponse(err?.message || "Unknown error", 500);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const { pathname, searchParams } = parseUrl(url);
    const res = await handleGet(pathname, searchParams);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
