import type User from "~/common/User"

export interface PostLoginRequest {
  email: string,
  password: string
}

export interface PostLoginResponse {
  token: string,
  me: User
}

export interface PostRegisterRequest {
  studentId: string,
  email: string,
  password: string,
  name: string,
  isLecturer: boolean
}