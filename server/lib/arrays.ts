import { getRandomInt } from "./numbers"

export function getRandomItemFromArray<T>(array: Array<T>): T {
  return array[getRandomInt(0, array.length - 1)]
}
