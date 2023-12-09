export default interface User {
  id: number,
  email: string,
  name: string,
  studentId: string,
  role?: "master" | "lecturer" | "student",
  roleTranslated?: string,
  createdDate?: number,
}

export interface AuthInfo {
  email: string,
  password: string,
}