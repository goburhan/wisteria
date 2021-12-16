import React from 'react'
import CardValue from 'views/Home/components/CardValue'
import { getBalanceNumber } from 'utils/formatBalance'
import { Text } from '@macist-m/robinia-uikit'
import BigNumber from 'bignumber.js/bignumber'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { BLOCKS_PER_YEAR } from 'config'
import { getCakeAddress } from 'utils/addressHelpers'
import { QuoteToken } from 'config/constants/types'
import { Link } from 'react-router-dom'
import {
  useFarms,
  usePriceCakeBusd,
  useTotalValue,
  usePriceBnbBusd,
} from '../../state/hooks'
import Socials from './Socials'

declare global {
  interface Window {
    ethereum: any
  }
}
const addToMetamask = function () {
  window.ethereum
    .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0xAfAEEe58a58867c73245397C0F768FF041D32d70',
          symbol: 'RBS',
          decimals: 18,
          image: 'https://robiniaswap.com/images/favicons/apple-icon-72x72.png',
        },
      },
    })
    .then((success) => {
      if (success) {
        console.log('RBS successfully added to wallet!')
      } else {
        throw new Error('Something went wrong.')
      }
    })
    .catch(console.error)
}
const MainFooter = () => {
  const cakePriceUsd = usePriceCakeBusd()
  const totalValue = useTotalValue()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const farms = useFarms()
  const eggPrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const cakeSupply = getBalanceNumber(circSupply)
  const marketCap = eggPrice.times(circSupply)
  let eggPerBlock = 0
  if (farms && farms[0] && farms[0].eggPerBlock) {
    eggPerBlock = new BigNumber(farms[0].eggPerBlock)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }
  const x = []
  farms.map((farm) => {
    // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
    //   return farm
    // }
    const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1)
      .times(new BigNumber(farm.poolWeight))
      .div(new BigNumber(10).pow(18))
    const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

    let apy = eggPrice.times(cakeRewardPerYear)

    let totalValuex = new BigNumber(farm.lpTotalInQuoteToken || 0)

    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      totalValuex = totalValuex.times(bnbPrice)
    }

    if (totalValuex.comparedTo(0) > 0) {
      apy = apy.div(totalValuex)
    }

    x.push(apy)
    return null
  })
  const topAPY = x.reduce(function (accumulatedValue, currentValue) {
    return Math.max(accumulatedValue, currentValue)
  })

  return (
    <div className="stat-card h-full  text-white text-center   grid  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 justify-item-center ">
      {/* Sol taraf */}
      <div className="grid   sm:grid-cols-1  sm:gap-4 lg:gap-0 md:grid-cols-1  lg:grid-cols-2   footer-stats ">
        <div className=" grid  sm:ml-16    lg:gap-44 sm:grid-cols-2 md:grid-cols-1  lg:grid-cols-2  ">
          
          <div className=" grid  sm:grid-cols-2  md:grid-cols-2 lg:grid-cols-2  md:mr-48 lg:mr-40 place-items-center sm:gap-44 md:gap-48  lg:gap-12  "> {/* solun solu */}
          
          
          <div className='grid sm:grid-cols-2 md:grid-cols-2 sm:mr-16 md:mr-0 lg:mr-0 gap-16'>
            <div className="min-w-max  ">
              <img src="/images/w-token.svg" style={{ maxHeight: 60 , maxWidth:80 }} alt="rbs-ico" />
            </div>
            <div className=" text-md sm:mr-10 md:mr-32 sm:mt-4 md:mt-4 lg:mb-20  grid grid-cols-1">
              <div className='lg:mt-0'>
              WST
                </div>
              <div className="font-bold text-purple-900  text-sm">
                ${cakePriceUsd.toNumber().toFixed(3)}
              </div>
            </div>
            </div>

        <div className='grid grid-cols-2 sm:mr-20 lg:mt-24 lg:mr-32 gap-8'>
            <div className="min-w-max mb-2 ">
              <img src="/images/metamask-ico.svg" alt="rbs-ico" />
            </div>

            <Link
              className="bg-purple-900 ml-4 py-2 w-20 h-8 rounded-xl sm:mt-2  lg:mt-1 text-sm  text-white cursor-pointer hover:opacity-75 "
              to="/farms"
            >
              Buy WST
            </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2  gap-2 ">
          <div className="grid grid-cols-1 md:ml-20 lg:ml-0 text-left">
            <div>WST APY</div>
            <div>Total Supply</div>
            <div>Circulation Supply</div>
            <div>Total Burned</div>
            <div>Market Cap</div>
            <div>WST Per Block</div>
          </div>

          <div className="grid grid-cols-1 md:mr-20 lg:mr-0 text-center ">
            <div>
              <CardValue
                fontSize="14px"
                value={getBalanceNumber(marketCap)}
                decimals={0}
                prefix="$"
              />
            </div>
            <div>
              {' '}
              {cakeSupply && (
                <CardValue fontSize="14px" value={cakeSupply} decimals={0} />
              )}
            </div>
            <div>
              {cakeSupply && (
                <CardValue fontSize="14px" value={cakeSupply} decimals={0} />
              )}
            </div>
            <div>
              <CardValue
                fontSize="14px"
                value={getBalanceNumber(burnedBalance)}
                decimals={0}
              />
            </div>
            <div>
              {totalSupply && (
                <CardValue
                  fontSize="14px"
                  value={getBalanceNumber(totalSupply)}
                  decimals={0}
                />
              )}
            </div>
            <div>
              <Text bold fontSize="14px" color="primary">
                {eggPerBlock}
              </Text>
            </div>
          </div>
        </div>
      </div>
      {/* Sağ taraf */}
      <div className="grid grid-cols-4  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-left text-sm  footer-right">
        <div className="grid text-purple-900 grid-cols-1 ">
          <div className="text-white ">About</div>
          <a href="https://blokfield.gitbook.io/wisteria-swap/">Docs</a>
          <a href="https://steemit.com/@robinia/posts">News</a>
          <div>Partners</div>
          <div>Audit</div>
          <div> </div>
        </div>

        <div className="grid grid-cols-1 text-purple-900">
          <div className="text-white ">Products</div>
          <div>Stake(3,3)</div>
          <div>Call Options</div>
          <div>IFO </div>
          <div> </div>
          <div> </div>
          <div> </div>
        </div>
        <div className="grid  grid-cols-1  text-purple-900">
          <div className="text-white ">Service</div>
          <div>DAO</div>
          <a href="https://bridge.robiniaswap.com/">Bridge </a>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
        </div>
        <div className="grid grid-cols-1">
          Community
          <div className="mr-10">
            <Socials />
          </div>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
          <div> </div>
        </div>
      </div>
    </div>
  )
}

export default MainFooter
