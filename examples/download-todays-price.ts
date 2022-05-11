/* eslint-disable arrow-parens */
import got from 'got'
import moment from 'moment'

import { Nepse, NepseExtended } from '../src/nepse'

const getDates = (startDate: Date | string, endDate: Date | string): Array<Date> => {
  const end = new Date(endDate)
  const daysOfYear = []
  for (let d = new Date(startDate); d <= end; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(new Date(d))
  }
  return daysOfYear
}

const nepse = new Nepse(got)
const nepseExtended = new NepseExtended(nepse)

;(async () => {
  const dates = getDates('2021-04-29', '2022-04-28').map((d) => moment(d).format('YYYY-MM-DD'))

  dates.forEach(async (date) => {
    await nepseExtended.downloadTodaysPriceExportToCsv(date, './dumps/todays-price')
  })
})()
