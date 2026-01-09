export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;

    // call.vcf.my.id
    if (host === "call.vcf.my.id") {
      return Response.redirect("tel:+628123456789", 302);
    }

    // wa.vcf.my.id
    if (host === "wa.vcf.my.id") {
      return Response.redirect(
        "https://wa.me/628123456789",
        302
      );
    }

    // qr.vcf.my.id
    if (host === "qr.vcf.my.id") {
      return new Response(`
        <html>
          <body style="text-align:center;font-family:sans-serif">
            <h2>Scan QR</h2>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/628123456789">
          </body>
        </html>
      `, {
        headers: { "content-type": "text/html" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};