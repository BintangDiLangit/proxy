const httpProxy = require("http-proxy");
const http = require("http");

const proxy = httpProxy.createServer();

const urls = {
  // api/auth
  auth_api: {
    url: "http://localhost:1000",
    proxy: new httpProxy.createProxyServer({
      target: {
        host: "localhost",
        port: "1000",
      },
    }),
  },

  // api/book
  book_api: {
    url: "http://localhost:2000",
    proxy: new httpProxy.createProxyServer({
      target: {
        host: "localhost",
        port: "000",
      },
    }),
  },

  // api/transaction
  transaction_api: {
    url: "http://localhost:3000",
    proxy: new httpProxy.createProxyServer({
      target: {
        host: "localhost",
        port: "3000",
      },
    }),
  },
};

const proxyServer = http.createServer(function (req, res) {
  let target = "";

  if (req.url.startsWith("/api/auth")) {
    target = urls.auth_api.url;
  }

  if (req.url.startsWith("/api/book")) {
    target = urls.book_api.url;
  }

  if (req.url.startsWith("/api/transaction")) {
    target = urls.transaction_api.url;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, PATCH, DELETE, GET"
    );

    return res.end(JSON.stringify({}));
  }

  if (!target) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: 404,
        error: "Route Not Found",
      })
    );
  }

  proxy.web(req, res, { target });
});

const port = 3000;

proxyServer.listen(port);

console.log(`Proxy running : ${port}`);
