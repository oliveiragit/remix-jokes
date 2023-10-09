import { Links, LiveReload, Outlet } from "@remix-run/react";

function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Remix Jokes</title>
        <Links />
      </head>
      <body>
        <div>
          <h1>J🤪KES</h1>
          <main>
            <Outlet />
            <LiveReload />
          </main>
        </div>
      </body>
    </html>
  );
}

export default App;
