import { type Lecture } from "~/common/Lecture"
import type User from "~/common/User"

export interface Post {
  id: number
  title: string
  content: string
  creationTime: number
  creationTimeFormatted: string
  registerer: User
  lecture?: Lecture
}