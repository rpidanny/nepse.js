import {
  TAuthenticateResponse,
  TGetFloorSheetResponse,
  TGetSecuritiesResponse,
  TGetSecurityHistoryResponse,
  TSecurity,
} from '../../src/nepse'

export const getMockAccessToken = (): string => {
  return 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ5Y28iLCJzdWIiOiIxMiIsImlhdCI6MTY1MTg5NTg0NiwiZXhwIjoxNjUxODk1OTA2fQ.F-4SJ3TReWEVh5bj9V8wfUwerYqMCyHPBZM-DGwJ4-0'
}

export const getMockAuthenticateResponse = (
  overrides: Partial<TAuthenticateResponse> = {},
): TAuthenticateResponse => {
  return {
    serverTime: 1651895846000,
    salt: 'owT}`XTC"Ybh)D|,"6z3',
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOi6J5Y28iLCJzdWIi5OiIxMiIsImlhdCI6MTY1MTg5NTg0NiwiZXhwIjoxNjUxODk1OTA2fQ.F-4SJ3TReWEVh5bj9V8wfUwerYqMCyHPBZM-DGwJ4-0',
    tokenType: '',
    refreshToken:
      'eyJhbGciOiJIUzI1NiJ9.ey0Jpc3MiOiJ5Y128iLCJzdWIiOiIxIiwiaWF0IjoxNjUxODk1ODQ2LCJleHAiOjE2NTE4OTk0NDZ9.tGL-LZLJctPYd8X_OqBaFhk7dp4mGIIPZHysmRkqR1w',
    salt1: 48398,
    salt2: 95966,
    salt3: 26539,
    salt4: 19997,
    salt5: 43610,
    ...overrides,
  }
}

export const getMockTodaysPricesExportResponse = (): string => {
  return `S.N,BUSINESS_DATE,SECURITY_ID,SYMBOL,SECURITY_NAME,OPEN_PRICE,HIGH_PRICE,LOW_PRICE,CLOSE_PRICE,TOTAL_TRADED_QUANTITY,TOTAL_TRADED_VALUE,PREVIOUS_DAY_CLOSE_PRICE,FIFTY_TWO_WEEKS_HIGH,FIFTY_TWO_WEEKS_LOW,LAST_UPDATED_TIME,LAST_UPDATED_PRICE,TOTAL_TRADES,AVERAGE_TRADED_PRICE,MARKET_CAPITALIZATION
  1,2021-04-29,133,SCB,Standard Chartered Bank Limited,582.0000,582.0000,575.0000,580.0000,23264,13487901.0000,582.0000,754.0000,505.0000,2021-04-29T14:59:52.077966,580.0000,237,579.77,49718.94
  2,2021-04-29,142,KBL,Kumari Bank Limited,317.0000,319.0000,314.0000,314.0000,86121,27128974.0000,314.0000,345.0000,153.0000,2021-04-29T14:59:43.755454,314.0000,411,315.00,43578.41`
}

export const getMockFloorSheetResponse = (
  overrides: Record<string, any> = {},
): TGetFloorSheetResponse => {
  return {
    totalAmount: 1654561472.54,
    totalQty: 4674940.0,
    floorsheets: {
      content: [
        {
          id: null,
          contractId: 2022050504009912,
          contractType: null,
          stockSymbol: 'NICL',
          buyerMemberId: '1',
          sellerMemberId: '53',
          contractQuantity: 30,
          contractRate: 660.0,
          contractAmount: 19800.0,
          businessDate: '2022-05-05',
          tradeBookId: 63686114,
          stockId: 176,
          buyerBrokerName: 'Kumari Securities Private Limited',
          sellerBrokerName: 'Investment Management Nepal Pvt. Ltd.',
          tradeTime: '2022-05-05T14:59:59.962911',
          securityName: 'Nepal Insurance Co. Ltd.',
        },
      ],
      pageable: {
        sort: { sorted: true, unsorted: false, empty: false },
        pageSize: 10,
        pageNumber: 0,
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalPages: 1,
      totalElements: 1,
      last: false,
      number: 0,
      size: 10,
      numberOfElements: 10,
      sort: { sorted: true, unsorted: false, empty: false },
      first: true,
      empty: false,
      ...overrides,
    },
    totalTrades: 34260,
  }
}

export const getMockSecuritiesResponse = (
  overrides: Partial<TSecurity> = {},
): TGetSecuritiesResponse => {
  return [
    {
      id: 2790,
      symbol: 'ACLBSL',
      securityName: 'Aarambha Chautari Laghubitta Bittiya Sanstha Limited',
      name: '(ACLBSL) Aarambha Chautari Laghubitta Bittiya Sanstha Limited',
      activeStatus: 'A',
      ...overrides,
    },
  ]
}

export const getMockSecurityHistoryResponse = (
  overrides: Partial<TGetSecurityHistoryResponse> = {},
): TGetSecurityHistoryResponse => {
  return {
    content: [
      {
        businessDate: '2022-05-09',
        totalTrades: 858,
        totalTradedQuantity: 40948,
        totalTradedValue: 36905688.6,
        highPrice: 907.0,
        lowPrice: 889.0,
        closePrice: 896.5,
      },
      {
        businessDate: '2022-05-08',
        totalTrades: 1078,
        totalTradedQuantity: 46835,
        totalTradedValue: 41548903.6,
        highPrice: 910.0,
        lowPrice: 880.0,
        closePrice: 889.0,
      },
    ],
    pageable: {
      sort: { sorted: false, unsorted: true, empty: true },
      pageSize: 500,
      pageNumber: 0,
      offset: 0,
      paged: true,
      unpaged: false,
    },
    totalPages: 1,
    totalElements: 2,
    last: true,
    number: 0,
    size: 500,
    numberOfElements: 2,
    sort: { sorted: false, unsorted: true, empty: true },
    first: true,
    empty: false,
    ...overrides,
  }
}
