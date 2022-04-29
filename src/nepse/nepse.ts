import { Got } from 'got'
import FormData from 'form-data'
// import fetch from 'node-fetch'
import axios from 'axios'
import fs from 'fs/promises'
// import { CsvError } from 'csv-parse'
import csvParse from 'csv-parse/lib/sync'
// import csvToJson from 'convert-csv-to-json'
import { INepse } from './interfaces'

export class Nepse implements INepse {
  private readonly nepseEndpoint =
    'https://newweb.nepalstock.com/api/nots/market/export/todays-price/'
  private readonly nepseAlphaEndpoint = 'https://nepsealpha.com/nepse-data/'
  private readonly nepseAlphaToken = 'mAgIFlB4mntYfJd7IFkGpK8XQxs5Mt0agS5HpkVm'

  private parsingOptions = { quote: '"', ltrim: true, rtrim: true, delimiter: ',' }

  constructor(private got: Got) {}

  async getRawCsv(date: string): Promise<string> {
    console.log(`Fetching csv from date : ${date}`)
    const { statusCode, body } = await this.got.get(`${this.nepseEndpoint}${date}`, {
      rejectUnauthorized: false,
    })

    if (statusCode === 200) {
      console.log(body)
      return body
    }

    console.log(`StatusCode: ${statusCode}, Body: ${body}`)
    throw new Error('Unable to fetch data')
  }

  async downloadCsv(date: string, path: string): Promise<void> {
    const rawCsv = await this.getRawCsv(date)

    await fs.writeFile(`${path}/${date}.csv`, rawCsv)
  }

  async getDailyPrice(date: string): Promise<string[]> {
    const rawCsv = await this.getRawCsv(date)

    const parsedData = csvParse(rawCsv, this.parsingOptions)

    console.log('Parsed Data:')

    console.log(JSON.stringify(parsedData, null, 2))
    return parsedData
  }

  async getDataFromNepseAlpha(
    symbol: string,
    startDate: string,
    endDate: string,
  ): Promise<Array<Record<string, string>>> {
    const form = new FormData()
    form.append('start_date', startDate)
    form.append('end_date', endDate)
    form.append('symbol', symbol)
    form.append('specific_date', endDate)
    form.append('filter_type', 'date-range')
    form.append('_token', this.nepseAlphaToken)

    console.log('FormData-->')
    console.log(JSON.stringify(form, null, 2))

    // return [{}]

    try {
      const response = await axios({
        method: 'post',
        url: this.nepseAlphaEndpoint,
        data: form,
        headers: { 'Content-Type': 'multipart/form-data', ...form.getHeaders() },
      })

      console.log('Request complete')
      console.log(response)

      return [{}]
    } catch (err) {
      console.log('Failed....')
      console.log(err)
      throw err
    }

    // const response = await this.got.post<Record<string, string>[]>(this.nepseAlphaEndpoint, {
    //   body: 'symbol=NABIL&specific_date=2022-04-29&start_date=2022-04-01&end_date=2022-04-29&filter_type=date-range&_token=mAgIFlB4mntYfJd7IFkGpK8XQxs5Mt0agS5HpkVm',
    //   headers: { ...form.getHeaders() },
    //   throwHttpErrors: false,
    // })

    // const { statusCode, body } = response

    // if (statusCode === 200) {
    //   console.log(body)
    //   return body
    // }

    // console.log(`StatusCode: ${statusCode}, Body: ${body}`)
    // throw new Error('Unable to fetch data')
  }
}
