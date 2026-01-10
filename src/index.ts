export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const key = url.pathname.slice(1);

    if (!key) {
      return new Response("Not found", { status: 404 });
    }

    const raw = await env.KV.get(key);
    if (!raw) {
      return new Response("Key not found", { status: 404 });
    }

    // Normalisasi nomor
    let phone = raw.trim();
    if (phone.startsWith("08")) {
      phone = "+62" + phone.slice(1);
    }
    if (!phone.startsWith("+")) {
      phone = "+" + phone;
    }

    // =========================
    // QR → VCARD (CONTACT)
    // =========================
    if (hostname.startsWith("qr.")) {
      const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${key}
FN:${key}
TEL:${phone}
END:VCARD
`.trim();

      return new Response(vcard, {
        headers: {
          "Content-Type": "text/vcard; charset=utf-8",
          "Content-Disposition": `inline; filename="${key}.vcf"`
        }
      });
    }

    // =========================
    // WhatsApp
    // =========================
    if (hostname.startsWith("wa.")) {
      return Response.redirect(
        "https://wa.me/" + phone.replace("+", ""),
        302
      );
    }

    // =========================
    // Call (tel:)
    // =========================
    if (hostname.startsWith("call.")) {
      return Response.redirect("tel:" + phone, 302);
    }

    return new Response("Invalid route", { status: 400 });
  }
};
