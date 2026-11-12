export async function onRequestPost(context) {
  try {
    // 1. Lê os dados enviados pelo formulário do site
    const requestData = await context.request.text();

    // 2. URL de destino do seu n8n via Ngrok
    const n8nWebhookUrl = "https://marlin-antirust-flagship.ngrok-free.dev/webhook/datalab-preview";

    // 3. O servidor da Cloudflare envia direto para o seu n8n
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: requestData
    });

    // 4. Retorna sucesso imediato para o navegador
    return new Response(JSON.stringify({ status: "success", message: "Enviado com sucesso" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", message: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

// Responde requisições de teste OPTIONS (CORS) caso ocorram
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
