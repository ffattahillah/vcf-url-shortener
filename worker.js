export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const host = url.hostname;
      const slug = url.pathname.slice(1);

      if (!slug) {
        return new Response("OK - Worker hidup");
      }

      if (!env || !env.URLS) {
        return new Response("ERROR: KV binding URLS tidak ditemukan");
      }

      let phone = await env.URLS.get(slug);
      if (!phone) {
        return new Response("Slug tidak ditemukan di KV");
      }

      phone = phone.trim();

      // Normalisasi nomor
      if (phone.startsWith("08")) {
        phone = "+62" + phone.slice(1);
      }
      if (!phone.startsWith("+")) {
        phone = "+" + phone;
      }

      // =========================
      // QR → VCARD CONTACT
      // =========================
      if (host === "qr.vcf.my.id") {
        const vcard = `
BEGIN:VCARD
VERSION:3.0
N:${slug}
FN:${slug}
TEL:${phone}
END:VCARD
`.trim();

        return new Response(vcard, {
          headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": `inline; filename="${slug}.vcf"`
          }
        });
      }

      // =========================
      // WhatsApp
      // =========================
      if (host === "wa.vcf.my.id") {
        return Response.redirect(
          `https://wa.me/${phone.replace("+", "")}`,
          302
        );
      }

      // =========================
      // Call
      // =========================
      if (host === "call.vcf.my.id") {
        return Response.redirect(`tel:${phone}`, 302);
      }

      return new Response("Domain tidak dikenali", { status: 400 });

    } catch (err) {
      return new Response("CRASH: " + err.message, { status: 500 });
    }
  }
};
