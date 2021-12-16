import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Image, Heading } from '@macist-m/robinia-uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd ,usePriceBSTEEMBnb } from 'state/hooks'
import {useCustomTokenBalance} from 'hooks/useTokenBalance'
import { getBalanceNumber } from 'utils/formatBalance'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import Divider from './components/Divider'
import DelegateFarms from '../../config/constants/delegateFarms';


export interface FarmsProps {
  delegateMode?: boolean
}

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceCakeBusd()
  const bnbPrice = usePriceBnbBusd()
  const BSTEEMPrice = usePriceBSTEEMBnb()
  const steemBalance = getBalanceNumber(useCustomTokenBalance("0x9Dd2104184a9A8EDb91EfC617908E7AC0a04228d","0x2C875C19E093F446dE65E46473170703486eb0E6"))
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const { delegateMode } = farmsProps
  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  // const activeFarms = DelegateFarms.filter(x => x.isActive === true);
   const activeFarms = farmsLP.filter(
     (farm) => farm.delegate === true && farm.multiplier !== '0X',
   )

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  // const delegateFarmx = DelegateFarms[0]
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        console.log(farm)
        const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1)
          .times(new BigNumber(farm.poolWeight))
          .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear)

        // console.log(steemBalance)
        let totalValue = new BigNumber(steemBalance)


        if (farm.delegate) {
          totalValue = totalValue.times(BSTEEMPrice)
        }
        if (totalValue.comparedTo(0) > 0) {
          apy = apy.div(totalValue)
        }
        return {...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
          steemBalance={new BigNumber(steemBalance)}
          BSTEEMprice={BSTEEMPrice}
        />
      ))
    },
    [ account, cakePrice, ethereum,BSTEEMPrice,steemBalance],
  )

  return (
    <Page>
      <Heading
        as="h1"
        size="xl"
        color="#aeaeae"
        mb="50px"
        style={{ textAlign: 'center' }}
      >
        {delegateMode ? 'Stake Tokens to Earn with Robinia Pools' : 'Stake Tokens to Earn with Robinia Farms'}
      </Heading>
      {/* <Heading as="h2" color="secondary" mb="50px" style={{ textAlign: 'center' }}>
        {TranslateString(10000, 'Deposit Fee will be used to buyback EGG')}
      </Heading> */}
      {/* <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} /> */}
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
             {farmsList(activeFarms, false)}
          </Route>
          <div className="rbs-card md:w-4/6 mt-15 py-10">
        <div className="p-0 md:py-5 md:px-10 flex flex-col items-center">
          <div className="text-primary text-2xl font-bold mb-5">
          SP Delegate Farm Usage and Precautions
          </div>
          <div className="text-gray leading-7 text-lg text-gray-500">
          Documentation will be updated soon.
          </div>
          <div className="mx-5 my-5 py-4 rounded-full bg-secondary w-60 text-center text-white cursor-pointer shadow-lg">
            GO
          </div>
        </div>
      </div>
        </FlexLayout>
      </div>

      <div className="mb-10" />
      <div className="mb-16" />
    </Page>
  )
}

export default Farms
