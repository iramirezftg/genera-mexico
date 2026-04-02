import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Parse fields
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const zipCode = formData.get('zipCode') as string;
    const propertyType = formData.get('propertyType') as string;
    const consumption = Number(formData.get('consumption'));
    const file = formData.get('file') as File | null;

    let bill_file_url = null;

    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    // Safety check for credentials before executing operations against an unconfigured DB
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !supabaseKey) {
      console.warn("Faltan las credenciales de Supabase en .env.local, devolviendo éxito simulado.");
      return NextResponse.json({ success: true, simulated: true });
    }

    // 1. Upload File (if provided)
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('recibos_cfe')
        .upload(filePath, file);

      if (uploadError) {
        console.warn(`Error al subir archivo a Supabase, omitiendo adjunto: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('recibos_cfe')
        .getPublicUrl(filePath);
        
      bill_file_url = publicUrlData.publicUrl;
    }

    // 2. Insert Lead into Postgres Table
    let insertData = null;
    const { data: qData, error: insertError } = await supabase
      .from('leads')
      .insert([
        { 
          name, 
          email, 
          phone, 
          zip_code: zipCode, 
          property_type: propertyType, 
          monthly_consumption: consumption,
          bill_file_url
        }
      ]);

    if (insertError) {
      console.warn(`Error al guardar en base de datos, omitiendo por ahora: ${insertError.message}`);
    } else {
      insertData = qData;
    }

    // 3. Enviar correo de notificación usando FormSubmit (AJAX)
    try {
      await fetch("https://formsubmit.co/ajax/israplenitud@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://genera-mexico.vercel.app',
          'Referer': 'https://genera-mexico.vercel.app/'
        },
        body: JSON.stringify({
          Nombre: name,
          Email: email,
          Teléfono: phone,
          "Código Postal / Ciudad": zipCode,
          "Tipo de Propiedad": propertyType,
          "Consumo Mensual": `$${consumption} MXN`,
          "Recibo de luz (URL)": bill_file_url || "No se adjuntó",
          _subject: `Nuevo Prospecto (Lead): ${name}`,
          _template: "table"
        })
      });
    } catch (emailError) {
      console.error("Error enviando la notificación por correo:", emailError);
      // No rompemos el bloque para que el usuario igual vea el popup de "éxito"
    }

    return NextResponse.json({ success: true, data: insertData });

  } catch (error: any) {
    console.error('Error in API Quote route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
