import dayjs from 'dayjs'

export function examHasStart(dateExamStart) {
  return dayjs().isAfter(dayjs(dateExamStart))
}

export function overExamTime(timeStart, duration) {
  const start = new Date(timeStart)
  const end = new Date(start.getTime() + duration * 60000)
  return dayjs().isAfter(dayjs(end))
}
