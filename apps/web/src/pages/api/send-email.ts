export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

const MAX_LENGTHS = {
  empresa: 200,
  email: 254,
  presupuesto: 100,
  plazo: 50,
} as const;

function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 200);
}

function sanitizeArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string")
    .map((s) => s.replace(/[<>]/g, "").trim().slice(0, 100))
    .slice(0, 20);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_LENGTHS.email;
}

function getCsrfToken(request: Request): string | null {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return null;
    } catch {
      return null;
    }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) return null;
    } catch {
      return null;
    }
  } else {
    return null;
  }

  return "ok";
}

export const POST: APIRoute = async ({ request }) => {
  const csrf = getCsrfToken(request);
  if (!csrf) {
    return new Response(
      JSON.stringify({ error: "Solicitud no autorizada" }),
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
    const empresa = sanitize(body.empresa);
    const soluciones = sanitizeArray(body.soluciones);
    const presupuesto = sanitize(body.presupuesto).slice(0, MAX_LENGTHS.presupuesto);
    const plazo = sanitize(body.plazo).slice(0, MAX_LENGTHS.plazo);
    const email = sanitize(body.email);

    if (!empresa || !email) {
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

    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /></head>
        <body style="margin:0;padding:0;background-color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 20px;font-family:monospace;">
            <tr>
              <td>
                <h1 style="color:#00DA9D;font-size:20px;margin:0 0 24px 0;font-family:monospace;">// Nuevo proyecto de contacto</h1>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="color:#00DA9D;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;padding-bottom:4px;">Empresa / Proyecto</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a1a;font-size:14px;font-family:monospace;padding-top:4px;">${empresa}</td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="color:#00DA9D;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;padding-bottom:4px;">Soluciones requeridas</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a1a;font-size:14px;font-family:monospace;padding-top:4px;">${soluciones.length ? soluciones.join(", ") : "No especificado"}</td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="color:#00DA9D;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;padding-bottom:4px;">Presupuesto estimado</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a1a;font-size:14px;font-family:monospace;padding-top:4px;">${presupuesto || "No especificado"}</td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="color:#00DA9D;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;padding-bottom:4px;">Plazo estimado</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a1a;font-size:14px;font-family:monospace;padding-top:4px;">${plazo || "No especificado"}</td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />

                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="color:#00DA9D;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-family:monospace;padding-bottom:4px;">Email de contacto</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a1a;font-size:14px;font-family:monospace;padding-top:4px;">${email}</td>
                  </tr>
                </table>

                <p style="color:#999999;font-size:11px;font-family:monospace;margin-top:32px;">
                  Enviado desde stratto.dev/contacto · ${new Date().toLocaleDateString("es-CL")}
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: "Stratto Contacto <hello@stratto.dev>",
      to: "hello@stratto.dev",
      subject: `Nuevo contacto: ${empresa}`,
      html,
      replyTo: email,
    });

    if (error) {
      console.error("[api/send-email] Resend error:", error);
      return new Response(
        JSON.stringify({ error: "Error al enviar el email" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[api/send-email] Caught error:", err);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
