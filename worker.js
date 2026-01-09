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

      const phone = await env.URLS.get(slug);

      if (!phone) {
        return new Response("Slug tidak ditemukan di KV");
      }

      if (host === "wa.vcf.my.id") {
        return Response.redirect(`https://wa.me/${phone}`, 302);
      }

      if (host === "call.vcf.my.id") {
        return Response.redirect(`tel:${phone}`, 302);
      }

      if (host === "qr.vcf.my.id") {
        const target = `https://wa.vcf.my.id/${slug}`;
        return Response.redirect(
          `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(target)}`,
          302
        );
      }

      return new Response("Domain tidak dikenali");
    } catch (err) {
      return new Response("CRASH: " + err.message, { status: 500 });
    }
  }
};
