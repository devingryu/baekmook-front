import type User from "~/common/User";

export interface Lecture {
    id: number,
    name: string,
    description?: string,
    lecturers: User[],
    students?: User[],
    involved: boolean,
    lecturer: boolean,
}

export default interface LecturesResponse {
    totalPages: number,
    lectures: Lecture[],
}