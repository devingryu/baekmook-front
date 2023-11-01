export default interface User {
  id: number,
  email: string,
  name: string,
  studentId: string,
  role?: "master" | "lecturer" | "student",
  createdDate?: number,
}
