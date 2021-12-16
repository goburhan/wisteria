export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
  currency: string
  currencyAddress: string
  tokenDecimals: number
  releaseBlockNumber: number
}

export enum DelegateNetwork {
  'STEEM' = 'STEEM'
}

export interface DelegateFarmConfig {
  pid? : number
  tokenSymbol? : string
  delegateToken? : DelegateNetwork
  isActive? : boolean
  lpSymbol? : string
  depositFee? : number
  delegateAddress? : string
  multiplier? : string
}

export enum QuoteToken {
  'BNB' = 'BNB',
  'CAKE' = 'CAKE',
  'SYRUP' = 'SYRUP',
  'BUSD' = 'BUSD',
  'TWT' = 'TWT',
  'UST' = 'UST',
  'BTCB' = 'BTCB',
  'ETH' = 'ETH',
  'USDT' = 'USDT',
  'RBS' = 'RBS',
  'DOT' = 'DOT',
  'RINI' = 'RINI',
  'BSCT' = 'BSCT',
  'KRWP' = 'KRWP',
  'ADA' = 'ADA',
  'BSTEEM' = 'BSTEEM',
  'BBLURT' = 'BBLURT',
  'MOON' = 'MOON',
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string
  56: string
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  tokenSymbol: string
  tokenAddresses: Address
  quoteTokenSymbol: QuoteToken
  quoteTokenAdresses: Address
  multiplier?: string
  isTokenOnly?: boolean
  delegate?: boolean
  delegateAddress?: string
  delegateToken?: string
  depositFee?:string
  isCommunity?: boolean
  risk: number
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}


export interface PoolConfig {
  sousId: number
  image?: string
  tokenName: string
  stakingTokenName: QuoteToken
  stakingLimit?: number
  stakingTokenAddress?: string
  contractAddress: Address
  poolCategory: PoolCategory
  projectLink: string
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  tokenDecimals: number
}

export type Nft = {
  name: string
  description: string
  originalImage: string
  previewImage: string
  blurImage: string
  sortOrder: number
  bunnyId: number
}
