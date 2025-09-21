const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis de ambiente do Supabase (SUPABASE_PROJECT_URL, SUPABASE_API_KEY) não estão definidas.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'pdfs-clinicos';

async function uploadPdf(pdfBuffer, fileName) {
    console.log(`Iniciando upload para o Supabase: ${fileName}`);

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, pdfBuffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        console.error('Erro no upload para o Supabase:', error);
        throw new Error('Falha ao fazer upload do PDF para o Supabase.');
    }

    // Após o upload, obtém a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    if (!publicUrl) {
        throw new Error('Não foi possível obter a URL pública do arquivo após o upload.');
    }

    console.log(`Upload concluído. URL pública: ${publicUrl}`);
    return publicUrl;
}

module.exports = { uploadPdf };
