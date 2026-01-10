export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const path = url.pathname.slice(1);

    const raw = await env.KV.get(path);
    if (!raw) {
      return new Response("Not found", { status: 404 });
    }

    const phone = raw.startsWith("+") ? raw : "+" + raw;

    if (path.startsWith("wa")) {
      return Response.redirect(
        "https://wa.me/" + phone.replace("+", ""),
        302
      );
    }

    return Response.redirect("tel:" + phone, 302);
  }
};