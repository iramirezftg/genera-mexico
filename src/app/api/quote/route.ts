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

    // Safety check for credentials before executing operations against an unconfigured DB
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('recibos_cfe')
        .getPublicUrl(filePath);
        
      bill_file_url = publicUrlData.publicUrl;
    }

    // 2. Insert Lead into Postgres Table
    const { data: insertData, error: insertError } = await supabase
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
      throw new Error(`Error al guardar en base de datos: ${insertError.message}`);
    }

    return NextResponse.json({ success: true, data: insertData });

  } catch (error: any) {
    console.error('Error in API Quote route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
