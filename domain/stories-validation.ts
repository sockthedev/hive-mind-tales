import { stripHtml } from "string-strip-html"

export const MIN_CONTENT_TEXT_LENGTH = 10
export const MAX_CONTENT_TEXT_LENGTH = 3000

export abstract class StoriesValidation {
  static isValidContentLength(content: string): boolean {
    const length = stripHtml(content).result.length
    return (
      length >= MIN_CONTENT_TEXT_LENGTH && length <= MAX_CONTENT_TEXT_LENGTH
    )
  }
}
