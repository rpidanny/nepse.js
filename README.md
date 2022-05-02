# nepse.js

Fetch stock data from Nepal Stock Exchange.

## Usage

```ts
import got from 'got'
import { Nepse } from '../src/nepse'

;(async () => {
  const nepse = new Nepse(got)

  console.log(await nepse.getDetails('2019-10-21'))
})()
```

## Examples

- [Get Stock Details](./examples/get-stock-details.ts)
- [Download CSVs](./examples/download-csv.ts)

You can run the example scripts using the following command:

```bash
$(npm bin)/ts-node examples/download-csv.ts
```
