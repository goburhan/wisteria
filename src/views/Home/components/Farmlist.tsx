import React, { useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { BLOCKS_PER_YEAR } from 'config'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import Slider from 'react-slick'
import Divider from 'views/Farms/components/Divider'
import { FarmWithStakedValue } from '../../Farms/components/FarmCard/FarmCard'
import TopFarmCard from './TopFarmCard'
import FarmingCard from './FarmingCard'

export interface FarmsProps {
  tokenMode?: boolean
}

const Farmlist: React.FC<FarmsProps> = (farmsProps) => {
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { tokenMode } = farmsProps

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const activeFarms = farmsLP.filter(
    (farm) => farm.pid < 5,
    //  (farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !==   '0X'   ,
  )

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear)

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0)

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          totalValue = totalValue.times(bnbPrice)
        }

        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmingCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <>
      <div className="text-2xl text-purple-900 ml-2 mb-2 ">Trending Post</div>

      <div className="grid grid-cols-1 h-96  farmingcard ">
        <ul className="list-none ">
          <li>
            <a
              className="text-purple-900  font-bold text-lg"
              href="https://steemit.com/wisteria/@robinia/2-0-wisteriaswap-12-18"
            >
              일드파밍 디파이 2.0 WisteriaSwap(위스테리아스왑)
            </a>
            <li className="truncate text-white leading-8 text-sm ">
              WisteriaSwap은 12월 18일 UTC 11:00 오픈됩니다.
            </li>
          </li>

          <li>
            <a
              href="https://steemit.com/hive-101145/@robinia/yield-farming-defi-2-0-wisteriaswap-will-be-launched-on-december-18th"
              className="text-purple-900  font-bold text-lg"
            >
              Yield Farming DeFi 2.0 WisteriaSwap
            </a>
            <li className="truncate text-sm leading-8 text-white">
              WisteriaSwap will be launched on December 18th.
            </li>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=weXpFFEojuU"
              className="text-purple-900  font-bold text-lg"
            >
             Wisteria Swap Defi 1.0과 2.0의 적절한 결합
            </a>
            <li className="truncate text-sm leading-8 text-white">
            코린이 유치원(Corini Kindergarden) Youtube Video for Korean
            </li>
          </li>
          <br />

          {/* <li>
    <a className='text-purple-900  font-bold text-lg' href='/'>Post 3</a>
    <li className="truncate text-white">Now this is a story all about how, my life got flipped turned upside down Now this is a story all about how, my life got flipped turned upside down</li>
  </li>
  <br/>

  <li>
    <a className='text-purple-900  font-bold text-lg' href='/'>Post 4</a>
    <li className="truncate text-white">Now this is a story all about how, my life got flipped turned upside down</li>
  </li>
  <br/>

  <li>
    <a className='text-purple-900  font-bold text-lg' href='/'>Post 5</a>
    <li className="truncate text-white">Now this is a story all about how, my life got flipped turned upside down Now this is a story all about how, my life got flipped turned upside down</li>
  </li>
  <br/>
  <li>
    <a className='text-purple-900  font-bold text-lg' href='/'>Post 6</a>
    <li className="truncate text-white">Now this is a story all about how, my life got flipped turned upside down Now this is a story all about how, my life got flipped turned upside down</li>
  </li>
   */}
        </ul>
      </div>
    </>
  )
}

export default Farmlist
