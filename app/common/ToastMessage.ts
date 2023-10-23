import { type ToastOptions } from "react-toastify"

export default interface ToastMessage {
    text: string,
    type?: 'info' | 'success' | 'warning' | 'error' | null
    options?: ToastOptions
}
