import { createCookieSessionStorage } from "@remix-run/node";
import type User from "app/common/User";
import type ToastMessage from "app/common/ToastMessage";
import { type AuthInfo } from "app/common/User";

export type SessionData = {
  userInfo: User;
  authInfo: AuthInfo;
  token: string;
};

export type SessionFlashData = {
  message: ToastMessage;
};

// https://remix.run/docs/en/main/utils/sessions
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__BAEKMOOKSESS",
      httpOnly: true,
      maxAge: 1209600,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET || ""],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
