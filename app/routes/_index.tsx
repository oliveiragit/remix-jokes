import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

function IndexRoute() {
  return <span>Index Route</span>;
}

export default IndexRoute;
