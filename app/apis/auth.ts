export interface PostLoginRequest {
  email: string,
  password: string
}

export interface PostRegisterRequest {
  studentId: string,
  email: string,
  password: string,
  name: string,
  isLecturer: boolean
}