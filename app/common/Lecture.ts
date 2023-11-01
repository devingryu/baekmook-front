import type User from "~/common/User";

export interface Lecture {
    id: number,
    name: string,
    description?: string,
    lecturers: User[],
    isInvolved: boolean,
    isLecturer: boolean,
}

export default interface LecturesResponse {
    totalPages: number,
    lectures: Lecture[],
}