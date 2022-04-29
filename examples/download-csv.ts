import got from 'got'
import { Nepse } from '../src/nepse'
import moment from 'moment'

const getDates = (startDate: Date | string, endDate: Date | string): Array<Date> => {
  const end = new Date(endDate)
  const daysOfYear = []
  for (let d = new Date(startDate); d <= end; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(new Date(d))
  }
  return daysOfYear
}

;(async () => {
  const nepse = new Nepse(got)

  const dates = getDates('2021-04-29', '2022-04-28').map((d) => moment(d).format('YYYY-MM-DD'))

  dates.forEach(async (date) => {
    await nepse.downloadCsv(date, './dumps')
  })
})()
