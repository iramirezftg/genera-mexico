import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabaseClient';

const resend = new Resend(process.env.RESEND_API_KEY);
const DESTINATION_EMAIL = 'israplenitud@gmail.com';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name        = formData.get('name')         as string;
    const phone       = formData.get('phone')        as string;
    const email       = formData.get('email')        as string;
    const zipCode     = formData.get('zipCode')      as string; // ciudad
    const propertyType = formData.get('propertyType') as string;
    const consumption = Number(formData.get('consumption'));
    const file        = formData.get('file')         as File | null;

    let bill_file_url = null;

    // ── 1. Subir archivo a Supabase (si viene) ─────────
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
                     ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseKey && file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('recibos_cfe')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('recibos_cfe')
          .getPublicUrl(fileName);
        bill_file_url = urlData.publicUrl;
      }
    }

    // ── 2. Guardar lead en Supabase ────────────────────
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && supabaseKey) {
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          name, email, phone,
          zip_code: zipCode,
          property_type: propertyType,
          monthly_consumption: consumption,
          bill_file_url,
        }]);

      if (insertError) {
        console.warn('Supabase insert error:', insertError.message);
      }
    }

    // ── 3. Enviar email de notificación con Resend ─────
    const { error: emailError } = await resend.emails.send({
      from: 'Genera México <onboarding@resend.dev>',
      to: DESTINATION_EMAIL,
      subject: `🌞 Nuevo lead: ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9fafb;border-radius:12px;">
          <div style="background:#1E4620;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#FFB800;margin:0;font-size:24px;">⚡ Nuevo Lead — Genera México</h1>
          </div>
          <div style="background:white;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;">
            <table style="width:100%;border-collapse:collapse;">
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;width:140px;">Nombre</td>
                <td style="padding:12px 8px;font-weight:600;color:#111827;">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Email</td>
                <td style="padding:12px 8px;font-weight:600;color:#111827;">
                  <a href="mailto:${email}" style="color:#1E4620;">${email}</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Teléfono</td>
                <td style="padding:12px 8px;font-weight:600;color:#111827;">
                  <a href="tel:${phone}" style="color:#1E4620;">${phone}</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Ciudad</td>
                <td style="padding:12px 8px;font-weight:600;color:#111827;">${zipCode || '—'}</td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Tipo de propiedad</td>
                <td style="padding:12px 8px;font-weight:600;color:#111827;">${propertyType || '—'}</td>
              </tr>
              <tr>
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Recibo mensual</td>
                <td style="padding:12px 8px;font-weight:600;color:#FFB800;font-size:18px;">$${consumption.toLocaleString('es-MX')} MXN</td>
              </tr>
            </table>
            ${bill_file_url ? `
            <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
              <p style="margin:0;font-size:14px;color:#166534;">📎 Recibo adjunto: 
                <a href="${bill_file_url}" style="color:#1E4620;font-weight:600;">Ver archivo</a>
              </p>
            </div>` : ''}
            <div style="margin-top:24px;padding:16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;text-align:center;">
              <p style="margin:0;font-size:13px;color:#92400e;">⏰ Contactar en menos de 24 horas para máxima conversión</p>
            </div>
          </div>
          <p style="text-align:center;margin-top:16px;font-size:12px;color:#9ca3af;">
            Genera México · Sistema de leads automático
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      // Aun así devolvemos éxito si el lead se guardó
    }

    return NextResponse.json({ success: true, emailSent: !emailError });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('API Quote error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
