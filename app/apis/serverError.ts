export default interface BaseResponse {
  message: string
  messageTranslated: string
  errClazz: string
}

export function isBaseResponse(obj: any | null): obj is BaseResponse {
  return obj && obj.message && obj.messageTranslated && obj.errClazz
}