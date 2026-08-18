export const prerender = false;

import type { APIRoute } from "astro";
import { randomBytes } from "node:crypto";

export const GET: APIRoute = async ({ cookies }) => {
  const token = randomBytes(32).toString("hex");

  cookies.set("csrf_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 3600,
  });

  return new Response(JSON.stringify({ csrfToken: token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
