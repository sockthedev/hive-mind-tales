import day from "dayjs"
import utcPlugin from "dayjs/plugin/utc.js"

day.extend(utcPlugin)

export function dbNow() {
  return day().utc().format()
}
