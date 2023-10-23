import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "app/session";

export async function loader() {
  return redirect("/home");
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  // const body = await request.formData()
  await destroySession(session);
  const newSession = await getSession();
  newSession.flash("message", { text: "다음에 다시 만나요!", type: "success" });
  return redirect("/home", {
    headers: {
      "Set-Cookie": await commitSession(newSession),
    },
  });
}
