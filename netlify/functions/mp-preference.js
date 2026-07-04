const ACCESS_TOKEN = "APP_USR-5814431525655814-070416-5a3f022d7a2b114065cbf9521f1160fa-3515683173";
const BASE_URL = "https://3ideas.ar";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método no permitido" }) };
  }

  try {
    const { items, payer, orderId } = JSON.parse(event.body);

    const preference = {
      items: items.map(item => ({
        title: item.name,
        quantity: Number(item.qty),
        unit_price: Number(item.price),
        currency_id: "ARS"
      })),
      payer: {
        name: payer.name || "",
        phone: { area_code: "54", number: payer.phone || "" }
      },
      back_urls: {
        success: `${BASE_URL}?pago=aprobado&orden=${orderId}`,
        failure:
