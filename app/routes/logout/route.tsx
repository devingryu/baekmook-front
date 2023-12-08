import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "~/session.server";
import { STRING_GOODBYE_MESSAGE } from "~/resources/strings";

export async function loader() {
  return redirect("/home");
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  // const body = await request.formData()
  await destroySession(session);
  const newSession = await getSession();
  newSession.flash("message", { text: STRING_GOODBYE_MESSAGE, type: "success" });
  return redirect("/home", {
    headers: {
      "Set-Cookie": await commitSession(newSession),
    },
  });
}
