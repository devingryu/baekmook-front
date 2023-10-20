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
import toastifyCss from 'react-toastify/dist/ReactToastify.css'
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { createTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { commitSession, getSession } from "app/session";
import { useEffect } from "react";

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
  { rel: "stylesheet", href: toastifyCss}
];

export async function loader({
  request
}: LoaderFunctionArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  )

  const message = session.get("message") || null

  return json({ message }, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  })
}

export default function App() {
  const { message } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (message != null) {
      const duration = message.duration ?? 2000
      switch (message.type) {
        case 'info':
          toast.info(message.text, {autoClose: duration})
          break
        case 'error':
          toast.error(message.text, {autoClose: duration})
          break
        case 'success':
          toast.success(message.text, {autoClose: duration})
          break
        case 'warning':
          toast.warning(message.text, {autoClose: duration})
          break
      }
    }
  }, [message])
  
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
        <ToastContainer />
      </body>
    </html>
  );
}
