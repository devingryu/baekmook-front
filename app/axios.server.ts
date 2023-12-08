import { type Session, redirect } from "@remix-run/node";
import axios, { type AxiosRequestConfig } from "axios";
import { type PostLoginResponse } from "~/apis/auth";
import type BaseResponse from "~/apis/serverError";
import { isBaseResponse } from "~/apis/serverError";
import { type AuthInfo } from "~/common/User";
import { STRING_LOGIN_REQUIRED } from "~/resources/strings";
import type { SessionData, SessionFlashData } from "~/session.server";
import { commitSession, destroySession, getSession } from "~/session.server";

export const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const postLogin = async (authInfo: AuthInfo) => {
  return await api.post<PostLoginResponse>("/api/login", authInfo);
};

export async function processResponse<T>(
  config: AxiosRequestConfig<any>,
  session?: Session<SessionData, SessionFlashData>
): Promise<{
  data?: T;
  error?: BaseResponse;
  newSession?: Session<SessionData, SessionFlashData>;
}> {
  try {
    const resp = await api.request({
      ...config,
      ...(session ? { headers: { Authorization: session.get("token") } } : {}),
    });
    return { data: resp.data };
  } catch (err: any) {
    const data = err.response?.data;
    if (isBaseResponse(data)) {
      const authInfo = session?.data?.authInfo;
      if (data.errClazz === "access_token_invalid_exception" && authInfo) {
        // try to retrieve new token from server
        try {
          const loginResp = await postLogin(authInfo);
          session.set("userInfo", loginResp.data.me);
          session.set("token", loginResp.data.token);

          // retry original request
          try {
            const resp = await api.request({
              ...config,
              headers: { Authorization: loginResp.data.token },
            });
            return { data: resp.data, newSession: session };
          } catch (err: any) {
            const error = err.response?.data;
            if (isBaseResponse(error)) {
              return { error: error, newSession: session };
            } else {
              return { newSession: session };
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
        return { error: data };
      }
    } else {
      return {};
    }
  }
}

export default processResponse;
