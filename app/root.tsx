import { ThemeProvider } from "@emotion/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import styleCss from "app/app.css";
import { json, type LinksFunction } from "@remix-run/node";
import { createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";

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

export const loader = async () => {
  return json({
    ENV: {
      API_URL: process.env.API_URL
    }
  })
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(
              data.ENV
            )}`,
          }}
        />
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer />
      </body>
    </html>
  );
}
