export async function onRequestPost(context) {
  try {
    // 1. Lê os dados enviados pelo formulário do site
    const requestData = await context.request.text();

    // 2. URL de destino do seu n8n via Ngrok
    const n8nWebhookUrl = "https://marlin-antirust-flagship.ngrok-free.dev/webhook/datalab-preview";

    // 3. O servidor da Cloudflare envia para o n8n e aguarda o relatório pronto
    const response = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: requestData
    });

    const responseText = await response.text();

    // 4. Se o Ngrok/n8n estiver offline ou retornar erro, devolve JSON de erro limpo
    if (!response.ok) {
      return new Response(
        JSON.stringify({ status: "error", upstreamStatus: response.status, message: "Upstream error" }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // 5. Repassa o JSON real gerado pelo n8n diretamente para o navegador
    return new Response(responseText, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
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
