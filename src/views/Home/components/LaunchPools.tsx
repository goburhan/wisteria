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
import Launchpoolcard from './Launchpoolcard'

export interface FarmsProps {
  tokenMode?: boolean
}

const LaunchPools: React.FC<FarmsProps> = (farmsProps) => {
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
      
     (farm) => farm.isTokenOnly === tokenMode && farm.multiplier === '3X' ,
    
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
        <Launchpoolcard
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
      <div className="text-2xl text-purple-900  ml-4 mb-2 ">Launchpools</div>

    <div className="grid grid-cols-1 gap-7 ">
     {farmsList(activeFarms,false)}

      </div>
      
    </>
  )
}

export default LaunchPools