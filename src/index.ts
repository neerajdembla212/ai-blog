import http from "http";
import app from "./app";

const PORT = normalizePort(process.env.PORT || "3000");
app.set("port", PORT);

const server = http.createServer(app);

server.listen(PORT);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | number | false {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;

  if (port >= 0) return port;

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") throw error;

  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Handle server "listening" event.
 */
function onListening(): void {
  const address = server.address();
  const bind =
    typeof address === "string"
      ? `pipe ${address}`
      : `port ${address?.port ?? ""}`;
  console.log(`Listening on ${bind}`);
}
