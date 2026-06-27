import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const SUPABASE_DATE_FIELDS = ["createdAt", "updatedAt"];

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)
  ?.replace(/\/$/, "")
  .trim();

const USE_API_PROXY = import.meta.env.VITE_USE_API_PROXY === "true";

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

function tableToDbName(table: string) {
  if (table === "contact-messages") {
    return "contact_messages";
  }
  return table;
}

function normalizeRecord(record: any) {
  if (!record) return record;

  if (record?.images && typeof record.images === "string") {
    try {
      record.images = JSON.parse(record.images);
    } catch {
      record.images = [];
    }
  }

  if (record.full_name !== undefined) {
    record.fullName = record.full_name;
  }
  if (record.linkedin_url !== undefined) {
    record.linkedinUrl = record.linkedin_url;
  }
  if (record.github_url !== undefined) {
    record.githubUrl = record.github_url;
  }
  if (record.twitter_url !== undefined) {
    record.twitterUrl = record.twitter_url;
  }
  if (record.instagram_url !== undefined) {
    record.instagramUrl = record.instagram_url;
  }
  if (record.youtube_url !== undefined) {
    record.youtubeUrl = record.youtube_url;
  }
  if (record.created_at !== undefined) {
    record.createdAt = record.created_at;
  }
  if (record.updated_at !== undefined) {
    record.updatedAt = record.updated_at;
  }
  if (record.start_date !== undefined) {
    record.startDate = record.start_date;
  }
  if (record.end_date !== undefined) {
    record.endDate = record.end_date;
  }
  if (record.read_time !== undefined) {
    record.readTime = record.read_time;
  }
  if (record.image_url !== undefined) {
    record.imageUrl = record.image_url;
  }

  return record;
}

function normalizeRecords(records: any[]) {
  return records.map(normalizeRecord);
}

function preparePayload(path: string, payload: any) {
  const table = path.split("/")[0];
  const mappedPayload = { ...(payload ?? {}) };

  const mapFields = (mapping: Record<string, string>) => {
    for (const [camelCaseKey, snakeCaseKey] of Object.entries(mapping)) {
      if (mappedPayload[camelCaseKey] !== undefined && mappedPayload[snakeCaseKey] === undefined) {
        mappedPayload[snakeCaseKey] = mappedPayload[camelCaseKey];
      }
      delete mappedPayload[camelCaseKey];
    }
  };

  if (table === "profile") {
    mapFields({
      fullName: "full_name",
      linkedinUrl: "linkedin_url",
      githubUrl: "github_url",
      twitterUrl: "twitter_url",
      instagramUrl: "instagram_url",
      youtubeUrl: "youtube_url",
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }

  if (table === "experiences") {
    mapFields({
      startDate: "start_date",
      endDate: "end_date",
      createdAt: "created_at",
    });
  }

  if (table === "certifications") {
    mapFields({
      credentialUrl: "credential_url",
      createdAt: "created_at",
    });
  }

  if (table === "education") {
    mapFields({ createdAt: "created_at" });
  }

  if (table === "activities") {
    mapFields({ createdAt: "created_at" });
  }

  if (table === "articles") {
    mapFields({
      readTime: "read_time",
      imageUrl: "image_url",
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }

  if (table === "contact-messages") {
    mapFields({ isRead: "is_read", createdAt: "created_at" });
  }

  if (table === "experiences" && mappedPayload?.images) {
    if (Array.isArray(mappedPayload.images)) {
      mappedPayload.images = JSON.stringify(mappedPayload.images);
    }
  }

  return mappedPayload;
}

async function handleGet(path: string, searchParams: URLSearchParams) {
  const table = path.split("/")[0];
  switch (table) {
    case "profile": {
      const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(data ? normalizeRecord(data) : null);
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
      // Check if fetching single article by slug
      const slugMatch = path.match(/^articles\/([^/]+)$/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .limit(1)
          .maybeSingle();
        if (error) return buildErrorResponse(error.message, 500);
        return buildResponse(data ? normalizeRecord(data) : null);
      }

      // Fetch multiple articles with optional filters
      let query = supabase.from("articles").select("*");
      if (searchParams.get("published") === "true") {
        query = query.eq("published", true);
      }
      if (searchParams.get("featured") === "true") {
        query = query.eq("featured", true);
      }
      const { data, error } = await query;
      if (error) return buildErrorResponse(error.message, 500);
      return buildResponse(normalizeRecords(data || []));
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

async function handleAdminResourcePost(path: string, body: any) {
  const payload = preparePayload(path, body);
  const table = path.split("/")[0];

  switch (table) {
    case "experiences":
      return await handleSupabaseInsert("experiences", payload);
    case "skills":
      return await handleSupabaseInsert("skills", payload);
    case "education":
      return await handleSupabaseInsert("education", payload);
    case "certifications":
      return await handleSupabaseInsert("certifications", payload);
    case "activities":
      return await handleSupabaseInsert("activities", payload);
    case "articles":
      return await handleSupabaseInsert("articles", payload);
    default:
      return buildErrorResponse(`Unknown POST path ${path}`, 404);
  }
}

async function handleAdminResourcePut(path: string, body: any) {
  const payload = preparePayload(path, body);
  const table = path.split("/")[0];
  const idMatch = path.match(/\/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : undefined;

  if (!id) {
    return buildErrorResponse("Missing id for update", 400);
  }

  switch (table) {
    case "experiences":
      return await handleSupabaseUpdate("experiences", id, payload);
    case "skills":
      return await handleSupabaseUpdate("skills", id, payload);
    case "education":
      return await handleSupabaseUpdate("education", id, payload);
    case "certifications":
      return await handleSupabaseUpdate("certifications", id, payload);
    case "activities":
      return await handleSupabaseUpdate("activities", id, payload);
    case "articles":
      return await handleSupabaseUpdate("articles", id, payload);
    default:
      return buildErrorResponse(`Unknown PUT path ${path}`, 404);
  }
}

async function handleAdminResourceDelete(path: string) {
  const table = path.split("/")[0];
  const idMatch = path.match(/\/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : undefined;

  if (!id) {
    return buildErrorResponse("Missing id for delete", 400);
  }

  switch (table) {
    case "experiences":
      return await handleSupabaseDelete("experiences", id);
    case "skills":
      return await handleSupabaseDelete("skills", id);
    case "education":
      return await handleSupabaseDelete("education", id);
    case "certifications":
      return await handleSupabaseDelete("certifications", id);
    case "activities":
      return await handleSupabaseDelete("activities", id);
    case "articles":
      return await handleSupabaseDelete("articles", id);
    default:
      return buildErrorResponse(`Unknown DELETE path ${path}`, 404);
  }
}

async function handleSupabaseInsert(table: string, payload: any) {
  const { data, error } = await supabase.from(table).insert(payload).select("*");
  if (error) return buildErrorResponse(error.message, 500);
  return buildResponse(data?.[0] ?? null, 201);
}

async function handleSupabaseUpdate(table: string, id: number, payload: any) {
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*");
  if (error) return buildErrorResponse(error.message, 500);
  return buildResponse(data?.[0] ?? null);
}

async function handleSupabaseDelete(table: string, id: number) {
  const { data, error } = await supabase.from(table).delete().eq("id", id).select("*");
  if (error) return buildErrorResponse(error.message, 500);
  return buildResponse(data?.[0] ?? null);
}

async function handlePost(path: string, body: any) {
  const table = path.split("/")[0];

  if (["experiences", "skills", "education", "certifications", "articles", "activities"].includes(table)) {
    if (USE_API_PROXY && API_BASE) {
      try {
        const response = await fetch(`${API_BASE}/api/${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          return buildErrorResponse(data?.message || "Creation failed", response.status);
        }
        return buildResponse(data, 201);
      } catch (err: any) {
        return buildErrorResponse(`${err?.message || "POST request failed"} (${API_BASE}/api/${path})`, 500);
      }
    }
    return handleAdminResourcePost(path, body);
  }

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

  // Route through Express API for experiences, skills, and other admin data
  if (["experiences", "skills", "education", "certifications", "articles", "activities"].includes(table)) {
    if (USE_API_PROXY && API_BASE) {
      try {
        const response = await fetch(`${API_BASE}/api/${path}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
          return buildErrorResponse(data?.message || "Update failed", response.status);
        }
        return buildResponse(data);
      } catch (err: any) {
        return buildErrorResponse(`${err?.message || "Update request failed"} (${API_BASE}/api/${path})`, 500);
      }
    }
    return handleAdminResourcePut(path, body);
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
  console.log(`[UPDATE ${table}/${id}] payload:`, payload);
  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select("*");
  if (error) {
    console.error(`[UPDATE ERROR ${table}/${id}]:`, error);
    return buildErrorResponse(error.message || "Update failed", 500);
  }
  if (!data || data.length === 0) {
    console.warn(`[UPDATE ${table}/${id}] No data returned after update`);
  }
  console.log(`[UPDATE ${table}/${id}] success, data:`, data?.[0]);
  return buildResponse(data?.[0] ?? null);
}

async function handleDelete(path: string) {
  const table = path.split("/")[0];
  const idMatch = path.match(/\/(\d+)$/);
  const id = idMatch ? Number(idMatch[1]) : undefined;
  if (!id) {
    return buildErrorResponse("Missing id for delete", 400);
  }
  
  if (["experiences", "skills", "education", "certifications", "articles", "activities"].includes(table)) {
    if (USE_API_PROXY && API_BASE) {
      try {
        const response = await fetch(`${API_BASE}/api/${path}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
          return buildErrorResponse(data?.message || "Delete failed", response.status);
        }
        return buildResponse(data);
      } catch (err: any) {
        return buildErrorResponse(`${err?.message || "DELETE request failed"} (${API_BASE}/api/${path})`, 500);
      }
    }
    return handleAdminResourceDelete(path);
  }
  
  const dbTable = tableToDbName(table);
  const { data, error } = await supabase.from(dbTable).delete().eq("id", id).select("*");
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
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
