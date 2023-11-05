import { type Session, redirect, json } from "@remix-run/node";
import axios, { type AxiosResponse } from "axios";
import { type PostLoginResponse } from "~/apis/auth";
import type BaseResponse from "~/apis/serverError";
import { isBaseResponse } from "~/apis/serverError";
import { type AuthInfo } from "~/common/User";
import { STRING_LOGIN_REQUIRED } from "~/resources/strings";
import type { SessionData, SessionFlashData } from "~/session";
import { commitSession, destroySession, getSession } from "~/session";

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const postLogin = async (authInfo: AuthInfo) => {
  return await api.post<PostLoginResponse>("/api/login", authInfo);
};

export async function processResponse<T>(
  requestFunc: () => Promise<AxiosResponse<T, any>>,
  session?: Session<SessionData, SessionFlashData>
): Promise<{ data?: T; error?: BaseResponse }> {
  try {
    const resp = await requestFunc();
    return { data: resp.data };
  } catch (err: any) {
    const data = err.response?.data;
    if (isBaseResponse(data)) {
      const authInfo = session?.data?.authInfo;
      if (data.errClazz === "access_token_invalid_exception" && authInfo) {
        // try to retrieve new token from server
        try {
          const resp = await postLogin(authInfo);
          session.set("userInfo", resp.data.me);
          session.set("token", resp.data.token);

          // retry original request
          try {
            const resp = await requestFunc();
            throw json({data: resp.data}, {
              headers: {
                "Set-Cookie": await commitSession(session),
              },
            });
          } catch (err: any) {
            const data = err.response?.data;
            if (isBaseResponse(data)) {
              throw json({data: data}, {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              });
            } else {
              throw json({}, {
                headers: {
                  "Set-Cookie": await commitSession(session),
                },
              });
            }
          }
        } catch (err: any) {
          await destroySession(session);
          const newSession = await getSession();
          newSession.flash("message", { text: STRING_LOGIN_REQUIRED });
          throw redirect("/login", {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          });
        }
      } else {
        return {error: data};
      }
    } else {
      return {};
    }
  }
}

export default api;
