export default interface ToastMessage {
    text: string,
    type?: 'info' | 'success' | 'warning' | 'error' | null
    duration?: number
}
