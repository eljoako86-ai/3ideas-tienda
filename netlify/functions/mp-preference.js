exports.handler = async (event) => {
  const ACCESS_TOKEN = "APP_USR-4893270369313324-070416-1bd800898ad39aaf03c4a4d74ecbdcfa-63664519";
  const BASE_URL = "https://3ideas.ar";
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Metodo no permitido" }) };
  }
  try {
    const body = JSON.parse(event.body);
    const items = body.items || [];
    const payer = body.payer || {};
    const orderId = body.orderId || "ORD-" + Date.now();
    const preference = {
      items: items.map(function(item) {
        return {
          title: String(item.name),
          quantity: Number(item.qty) || 1,
          unit_price: Number(item.price) || 1,
          currency_id: "ARS"
        };
      }),
      back_urls: {
        success: BASE_URL + "?pago=aprobado&orden=" + orderId,
        failure: BASE_URL + "?pago=fallido&orden=" + orderId,
        pending: BASE_URL + "?pago=pendiente&orden=" + orderId
      },
      auto_return: "approved",
      external_reference: orderId
    };
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });
    const data = await response.json();
    if (!response.ok) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Error MP", detail: data }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify({ init_point: data.init_point }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
