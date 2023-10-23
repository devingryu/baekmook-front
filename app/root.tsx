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
import toastifyCss from "react-toastify/dist/ReactToastify.css";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { ThemeProvider } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { commitSession, getSession } from "app/session";
import { useEffect } from "react";
import { lightTheme } from "app/utils/themeAugmentation";



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleCss },
  { rel: "stylesheet", href: toastifyCss },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const message = session.get("message") || null;
  const userInfo = session.get("userInfo") || null
  const token = session.get("token") || null

  return json(
    { message, userInfo, token },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  const { message } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (message != null) {
      switch (message.type) {
        case "info":
          toast.info(message.text, message.options);
          break;
        case "error":
          toast.error(message.text, message.options);
          break;
        case "success":
          toast.success(message.text, message.options);
          break;
        case "warning":
          toast.warning(message.text, message.options);
          break;
      }
    }
  }, [message]);

  return (
    <html
      lang="en"
      style={{ background: lightTheme.palette.background.default }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider theme={lightTheme}>
          <Outlet />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer position="bottom-left" autoClose={2000} />
      </body>
    </html>
  );
}
