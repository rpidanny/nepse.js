import got from 'got'

import { Nepse } from '../src/nepse'

const nepse = new Nepse(got)

;(async () => {
  const floorSheet = await nepse.getFloorSheet()

  console.log(JSON.stringify(floorSheet, null, 2))
})()
