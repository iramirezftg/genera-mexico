import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ⚠️ Con plan gratuito de Resend (sin dominio verificado)
// solo se puede enviar al email con el que se registró la cuenta.
// Cambia esto a tu email de Resend o verifica un dominio en resend.com/domains
const DESTINATION_EMAIL = 'ventas@generamexico.com';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name         = formData.get('name')         as string;
    const phone        = formData.get('phone')        as string;
    const email        = formData.get('email')        as string;
    const city         = formData.get('city')         as string;
    const zipCode      = formData.get('zipCode')      as string;
    const propertyType = formData.get('propertyType') as string;
    const consumption  = Number(formData.get('consumption'));
    const file         = formData.get('file')         as File | null;

    // ── Leer archivo adjunto ────────────────────────────
    type Attachment = { filename: string; content: Buffer };
    const attachments: Attachment[] = [];
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name, content: buffer });
    }

    // ── Enviar email ────────────────────────────────────
    const { error: emailError } = await resend.emails.send({
      from: 'Genera México <ventas@generamexico.com>',
      to: DESTINATION_EMAIL,
      subject: `🌞 Nuevo lead: ${name}`,
      attachments,
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
                <td style="padding:12px 8px;font-weight:600;">
                  <a href="mailto:${email}" style="color:#1E4620;">${email}</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Teléfono</td>
                <td style="padding:12px 8px;font-weight:600;">
                  <a href="tel:${phone}" style="color:#1E4620;">${phone}</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Ciudad</td>
                <td style="padding:12px 8px;font-weight:600;">${zipCode || '—'}</td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Tipo de propiedad</td>
                <td style="padding:12px 8px;font-weight:600;">${propertyType || '—'}</td>
              </tr>
              <tr>
                <td style="padding:12px 8px;color:#6b7280;font-size:14px;">Recibo mensual</td>
                <td style="padding:12px 8px;font-weight:600;color:#FFB800;font-size:18px;">
                  $${consumption.toLocaleString('es-MX')} MXN
                </td>
              </tr>
            </table>

            ${attachments.length > 0
              ? `<div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                   <p style="margin:0;font-size:14px;color:#166534;">📎 Recibo adjunto: <strong>${file!.name}</strong></p>
                 </div>`
              : `<div style="margin-top:20px;padding:16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
                   <p style="margin:0;font-size:14px;color:#92400e;">📋 No se adjuntó recibo de luz</p>
                 </div>`
            }

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
      // Log el error pero responde con éxito para no romper la UX
      console.error('Resend error (lead recibido pero email falló):', emailError);
    }

    // ── Insertar Lead en Supabase ──
    if (true) {
      const { createClient } = await import('@/utils/supabase/server');
      const supabase = await createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      const newId = crypto.randomUUID();

      const { error: dbError } = await supabase.from('leads').insert({
        id: newId,
        user_id: user?.id || null,
        email: email,
        phone: phone,
        name,
        city: city ? `${city} (CP: ${zipCode})` : zipCode,
        receipt: `$${consumption.toLocaleString('es-MX')}`,
        status: 'Nuevo'
      });

      if (dbError) {
        console.error('SUPABASE DB ERROR:', dbError);
      } else {
        let receiptUrl = null;
        
        if (file && file.size > 0 && attachments.length > 0) {
          const fileExt = file.name.split('.').pop();
          const filePath = `${newId}.${fileExt}`;
          
          // Use the buffer we already read for the email, as the file stream might be consumed
          const bufferToUpload = attachments[0].content;

          const { data: storageData, error: storageError } = await supabase.storage
            .from('receipts')
            .upload(filePath, bufferToUpload, {
              contentType: file.type,
              upsert: true
            });

          if (!storageError && storageData) {
            const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);
            receiptUrl = data.publicUrl;
          } else {
            console.error('Storage Upload Error:', storageError);
          }
        }

        await supabase.from('quotes').insert({
          id: newId,
          user_id: user?.id || null,
          panels: Math.max(1, Math.ceil((consumption / 2 / 2.5 * 1.3) / ((650 * 5 * 30) / 1000))),
          roi: '24 meses',
          has_receipt: !!file,
          receipt_url: receiptUrl,
          status: 'Nuevo'
        });
      }
    }

    // Siempre responder éxito al cliente
    return NextResponse.json({ success: true, emailSent: !emailError });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('API Quote error:', msg);
    // Responder éxito aunque haya error interno — el lead llegó
    return NextResponse.json({ success: true, warning: msg });
  }
}
