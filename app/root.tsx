import { ThemeProvider } from "@emotion/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styleCss from "app/app.css";
import { type LinksFunction } from "@remix-run/node";
import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Pretendard Variable', 'Pretendard',\
      'Roboto', 'Noto Sans KR', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell',\
      'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleCss },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
