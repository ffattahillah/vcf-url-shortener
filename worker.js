export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    const slug = url.pathname.slice(1);

    if (!slug) {
      return new Response("URL Shortener OK");
    }

    const phone = await env.URLS.get(slug);
    if (!phone) {
      return new Response("Not Found", { status: 404 });
    }

    // WhatsApp
    if (host === "wa.vcf.my.id") {
      return Response.redirect(
        `https://wa.me/${phone}`,
        302
      );
    }

    // Call
    if (host === "call.vcf.my.id") {
      return Response.redirect(
        `tel:${phone}`,
        302
      );
    }

    // QR
    if (host === "qr.vcf.my.id") {
      const target = `https://wa.vcf.my.id/${slug}`;
      return Response.redirect(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(target)}`,
        302
      );
    }

    return new Response("Invalid domain", { status: 400 });
  }
};
