import day from "dayjs"
import utcPlugin from "dayjs/plugin/utc.js"

day.extend(utcPlugin)

export abstract class Dates {
  public static now() {
    return day().utc()
  }

  public static expiresInSeconds(date: day.Dayjs | string): number {
    if (typeof date === "string") {
      date = day(date).utc()
    }
    return date.diff(this.now(), "second")
  }

  public static isExpired(date: day.Dayjs | string) {
    if (typeof date === "string") {
      date = day(date).utc()
    }
    return date.isBefore(this.now())
  }

  public static nowISO8601() {
    return this.now().format()
  }
}
