import { Application, Router } from "@oak/oak";
import bookRouter from "./book.routes.ts";
import { swaggerSpec } from "./swagger.ts";

const app = new Application();
const router = new Router();

router.get("/api-docs", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${JSON.stringify(swaggerSpec)},
      dom_id: '#swagger-ui',
    });
  </script>
</body>
</html>`;
  ctx.response.type = "text/html";
});

router.get("/api-docs.json", (ctx) => {
  ctx.response.body = swaggerSpec;
  ctx.response.type = "application/json";
});

app.use(router.routes());
app.use(bookRouter.routes());
app.use(bookRouter.allowedMethods());

console.log("Server is running on http://localhost:8000");
console.log("API Documentation: http://localhost:8000/api-docs");

app.listen({ port: 8000 });