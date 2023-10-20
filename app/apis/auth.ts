import api from "app/axios";
export interface PostLoginRequest {
  email: string,
  password: string
}
export const postLogin = async (req: PostLoginRequest) => {
  return api.post("/login", req);
};