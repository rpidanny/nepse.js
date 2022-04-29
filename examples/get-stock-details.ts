import got from 'got'
import { Nepse } from '../src/nepse'
;(async () => {
  const nepse = new Nepse(got)

  console.log(await nepse.getDetails('2022-02-28'))
})()
