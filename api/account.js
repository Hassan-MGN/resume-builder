import { createClient } from "@supabase/supabase-js";

const clean = (value) => typeof value === "string" ? value.trim().replace(/^["']|["']$/g, "").trim() : "";

const getBearerToken = (req) => {
  const value = req.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
};

const getConfig = () => {
  const url = clean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const anonKey = clean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY);
  const serviceRoleKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !anonKey || !serviceRoleKey) throw new Error("Account deletion is not configured on the server.");
  return { url: url.replace(/\/$/, ""), anonKey, serviceRoleKey };
};

const json = (res, status, body) => res.status(status).setHeader("Content-Type", "application/json").end(JSON.stringify(body));

const listAllObjects = async (admin, prefix = "") => {
  const objects = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await admin.storage.from("resume-pdfs").list(prefix, { limit: 1000, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw error;
    const page = Array.isArray(data) ? data : [];
    for (const item of page) {
      if (item?.id && item?.name) objects.push(prefix ? `${prefix}/${item.name}` : item.name);
      else if (item?.name) objects.push(...await listAllObjects(admin, prefix ? `${prefix}/${item.name}` : item.name));
    }
    if (page.length < 1000) break;
  }
  return objects;
};

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return json(res, 405, { error: "Method not allowed." });
  }

  const token = getBearerToken(req);
  if (!token) return json(res, 401, { error: "You must be signed in." });

  let config;
  try { config = getConfig(); } catch { return json(res, 500, { error: "Account deletion is not configured on the server." }); }

  const authClient = createClient(config.url, config.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user } = {}, error: userError } = await authClient.auth.getUser(token);
  if (userError || !user) return json(res, 401, { error: "Your session is invalid or expired." });

  const admin = createClient(config.url, config.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

  try {
    const objects = await listAllObjects(admin, user.id);
    for (let i = 0; i < objects.length; i += 1000) {
      const batch = objects.slice(i, i + 1000);
      const { error: storageError } = await admin.storage.from("resume-pdfs").remove(batch);
      if (storageError) throw storageError;
    }

    const { error: dbError } = await admin.from("resume_documents").delete().eq("user_id", user.id);
    if (dbError) throw dbError;

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return json(res, 200, { success: true });
  } catch (error) {
    console.error("[Resummetry account] deletion failed", { userId: user.id, message: error?.message });
    return json(res, 500, { error: "We could not fully delete the account. No further deletion should be attempted automatically; please contact support." });
  }
}
