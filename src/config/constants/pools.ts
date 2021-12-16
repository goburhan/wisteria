import { PoolConfig, QuoteToken, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 0,
  //   tokenName: 'CAKE',
  //   stakingTokenName: QuoteToken.CAKE,
  //   stakingTokenAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  //   contractAddress: {
  //     97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
  //     56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://pancakeswap.finance/',
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 1,
  //   tokenName: 'TWT',
  //   stakingTokenName: QuoteToken.SYRUP,
  //   stakingTokenAddress: '0x009cF7bC57584b7998236eff51b98A168DceA9B0',
  //   contractAddress: {
  //     97: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
  //     56: '0xAfd61Dc94f11A70Ae110dC0E0F2061Af5633061A',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: 'https://trustwallet.com/',
  //   harvest: true,
  //   tokenPerBlock: '20',
  //   sortOrder: 999,
  //   isFinished: true,
  //   tokenDecimals: 18,
  // },
  {
    sousId : 9999,
    tokenName : 'CAKE',
    stakingTokenName : QuoteToken.CAKE,
    stakingTokenAddress : '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    contractAddress : {
      97 : '',
      56 : '0x5Cd256a3D081d4AC128a76ec2d6E2DcAf4206053'
    },
    poolCategory : PoolCategory.CORE,
    projectLink : 'https://pancakeswap.finance',
    harvest : true,
    tokenPerBlock : '10',
    sortOrder : 1,
    isFinished : false,
    tokenDecimals : 18
  },
  //  {
  //    sousId : 99991,
  //    tokenName : 'usdt-busd',
  //    stakingTokenName : QuoteToken.USDT,
  //   stakingTokenAddress : '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00',
  //    contractAddress : {
  //      97 : '',
  //      56 : '0x8D7180af160E78Ef305c29adEC306421A1Bf3ff3'
  //    },
  //    poolCategory : PoolCategory.CORE,
  //    projectLink : 'https://pancakeswap.finance',
  //    harvest : true,
  //    tokenPerBlock : '10',
  //    sortOrder : 2,
  //    isFinished : false,
  //    tokenDecimals : 18
  //  }
]

export default pools
