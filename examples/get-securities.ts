import got from 'got'

import { Nepse } from '../src/nepse'

const nepse = new Nepse(got)

;(async () => {
  console.log(JSON.stringify(await nepse.getSecurities(true), null, 2))
})()
