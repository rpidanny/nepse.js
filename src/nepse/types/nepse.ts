export type TAuthenticateResponse = {
  accessToken: string
  refreshToken: string
  salt: string
  salt1: number
  salt2: number
  salt3: number
  salt4: number
  salt5: number
  serverTime: number
  tokenType: string
}

export type TSecurity = {
  id: number
  symbol: string
  securityName: string
  name: string
  activeStatus: string
}

export type TGetSecuritiesResponse = TSecurity[]

export type TFloorSheet = {
  businessDate: string
  buyerBrokerName: string
  buyerMemberId: string
  contractAmount: number
  contractId: number
  contractQuantity: number
  contractRate: number
  contractType: string | null
  id: string | null
  securityName: string
  sellerBrokerName: string
  sellerMemberId: string
  stockId: number
  stockSymbol: string
  tradeBookId: number
  tradeTime: string
}

export type TGetFloorSheetResponse = {
  totalAmount: number
  totalQty: number
  totalTrades: number
  floorsheets: {
    content: TFloorSheet[]
    empty: boolean
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    pageable: {
      offset: number
      pageNumber: number
      pageSize: number
      paged: boolean
      unpaged: boolean
      sort: { sorted: boolean; unsorted: boolean; empty: boolean }
    }
    size: number
    sort: { sorted: boolean; unsorted: boolean; empty: boolean }
    totalElements: number
    totalPages: number
  }
}

export type TSecurityHistoryItem = {
  businessDate: string
  closePrice: number
  highPrice: number
  lowPrice: number
  totalTradedQuantity: number
  totalTradedValue: number
  totalTrades: number
}

export type TGetSecurityHistoryResponse = {
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
  pageable: {
    sort: { sorted: boolean; unsorted: boolean; empty: boolean }
    pageSize: number
    pageNumber: number
    offset: number
    unpaged: boolean
    paged: boolean
  }
  sort: { sorted: boolean; unsorted: boolean; empty: boolean }
  content: TSecurityHistoryItem[]
}
