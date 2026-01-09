export default {
  fetch(request) {
    const url = new URL(request.url)

    switch (url.pathname) {
      case "/wa":
        return Response.redirect("https://wa.me/628123456789", 302)

      case "/call":
        return Response.redirect("tel:+628123456789", 302)

      case "/qr":
        return Response.redirect("https://example.com/qr", 302)

      default:
        return new Response("URL Shortener OK", { status: 200 })
    }
  }
}
