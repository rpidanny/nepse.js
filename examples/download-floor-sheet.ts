import got from 'got'

import { Nepse, NepseExtended } from '../src/nepse'

const nepse = new Nepse(got)
const nepseExtended = new NepseExtended(nepse)

;(async () => {
  await nepseExtended.downloadFloorSheetsToCsv('./dumps/floorsheets')
})()
