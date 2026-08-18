export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.replace(/[<>]/g, "").trim().slice(0, 200);
}

function sanitizeArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.replace(/[<>]/g, "").trim().slice(0, 100))
    .slice(0, 20);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

const ALLOWED_HOSTS = ["stratto.dev", "contact.stratto.dev"];

function validateCsrf(request: Request, cookies: { get: (name: string) => { value: string } | undefined }): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host || !ALLOWED_HOSTS.includes(host)) return false;

  let originValid = false;
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      originValid = ALLOWED_HOSTS.includes(originHost);
    } catch { return false; }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      originValid = ALLOWED_HOSTS.includes(refererHost);
    } catch { return false; }
  }

  if (!originValid) return false;

  const cookieToken = cookies.get("csrf_token");
  return !!cookieToken;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!validateCsrf(request, cookies)) {
    return new Response(
      JSON.stringify({ error: "CSRF token inválido" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY no configurada" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const body = await request.json();
    const projectName = sanitize(body.empresa);
    const solutions = sanitizeArray(body.soluciones);
    const budget = sanitize(body.presupuesto).slice(0, 100);
    const timeline = sanitize(body.plazo).slice(0, 50);
    const email = sanitize(body.email);

    if (!projectName || !email) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Email no válido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const solutionsFormatted = solutions.length ? solutions.join(", ") : "No especificado";

    // 1. Notificación interna para el equipo
    await resend.emails.send({
      from: "Stratto <hello@stratto.dev>",
      to: ["hello@stratto.dev"],
      replyTo: email,
      subject: `🚀 [Nuevo Lead] // ${projectName}`,
      template: {
        id: "stratto-lead-notification",
        variables: {
          project_name: projectName,
          solutions: solutionsFormatted,
          budget: budget || "No especificado",
          timeline: timeline || "No especificado",
          contact_email: email,
        },
      },
    });

    // 2. Confirmación para el cliente
    await resend.emails.send({
      from: "Stratto <hello@stratto.dev>",
      to: [email],
      subject: "Confirmación de contacto // Stratto",
      template: {
        id: "stratto-contact-confirmation",
        variables: {
          name: projectName,
          message: `Soluciones: ${solutionsFormatted} | Inversión: ${budget || "No especificado"} | Plazo: ${timeline || "No especificado"}`,
        },
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[api/send-email]", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
