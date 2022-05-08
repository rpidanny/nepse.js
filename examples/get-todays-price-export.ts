import got from 'got'

import { Nepse } from '../src/nepse'

const nepse = new Nepse(got)

;(async () => {
  console.log(await nepse.getTodaysPricesExport('2022-02-28'))
})()
