import got from 'got'

import { Nepse, NepseExtended } from '../src/nepse'

const nepse = new Nepse(got)
const nepseExtended = new NepseExtended(nepse)

;(async () => {
  const floorSheet = await nepseExtended.getFloorSheet()

  console.log(JSON.stringify(floorSheet.floorSheets.length, null, 2))
})()
