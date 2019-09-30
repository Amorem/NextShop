import cookie from "js-cookie";
import Router from "next/router";
import { destroyCookie } from "nookies";

export function handleLogin(token) {
  cookie.set("token", token);
  Router.push("/account");
}

export function redirectUser(ctx, location) {
  // Redirect if we are on the server
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.req.end();
  }
  // Redirect if we are on the client
  else {
    Router.push(location);
  }
}

export function handleLogout() {
  cookie.remove("token");
  Router.push("/login");
}
