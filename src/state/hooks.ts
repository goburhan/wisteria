import BigNumber from 'bignumber.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useRefresh from 'hooks/useRefresh'
import { useLockedSale } from 'hooks/useContract'
import { getBusdAddress, getLockedSaleAddress } from 'utils/addressHelpers'
import Web3 from 'web3'
import { fetchFarmsPublicDataAsync, fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync } from './actions'
import { State, Farm, Pool } from './types'
import { QuoteToken } from '../config/constants/types'

const ZERO = new BigNumber(0)

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
  }, [dispatch, slowRefresh])
}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)

  return farms
}

export const usePoolss = (): Pool[] => {
  const pools = useSelector((state: State) => state.pools.data)

  return pools;
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}

export const usePoolUser = (pid) => {
  useSelector((state: State) => console.log(state))
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 3 // BUSD-BNB LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}
export const usePriceEthBnb = () : BigNumber => {
  const BnbPrice = usePriceBnbBusd()
  const pid = 9
  const farm = useFarmFromPid(pid)
  const EthPrice = new BigNumber(farm.tokenPriceVsQuote).multipliedBy(BnbPrice)
  return EthPrice
}
export const usePriceBSTEEMBnb = () : BigNumber => {
  const BnbPrice = usePriceBnbBusd()
  const pid = 18
  const farm = useFarmFromPid(pid)
  const BSTEEMPrice = new BigNumber(farm.tokenPriceVsQuote).multipliedBy(BnbPrice)
  return BSTEEMPrice
}
export const usePriceCakeBusd = (): BigNumber => {
  // const pid = 1 // CAKE-BNB LP
  // const bnbPriceUSD = usePriceBnbBusd()
  // const farm = useFarmFromPid(pid)
  // return farm.tokenPriceVsQuote ? bnbPriceUSD.times(farm.tokenPriceVsQuote) : ZERO
  const pid = 1 // EGG-BUSD LP
  const farm = useFarmFromPid(pid)
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}

export const useRealCakeBusd = (): BigNumber => {
  const pid = 5;
  const farm = useFarmFromPid(pid);
  return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : ZERO
}




export const usePoolsTotalValue = (): BigNumber => {
    const pools = usePoolss();
    const bnbPrice = usePriceBnbBusd();
    const cakePrice = useRealCakeBusd();
    const ethPrice = usePriceEthBnb()
    // console.log(cakePrice.toNumber())
    let value = new BigNumber(0);
    for(let i = 0; i<pools.length;i++) {
      const pool = pools[i];
      if(pool.stakingTokenName) {
        let val;
        if(pool.stakingTokenName === QuoteToken.CAKE) {
          val = cakePrice.times(pool.totalStaked).div(new BigNumber(10).pow(pool.tokenDecimals));
        } else if (pool.stakingTokenName === QuoteToken.BNB) {
          val = bnbPrice.times(pool.totalStaked).div(new BigNumber(10).pow(pool.tokenDecimals));
        } else if (pool.stakingTokenName === QuoteToken.ETH) {
          val = ethPrice.times(pool.totalStaked).div(new BigNumber(10).pow(pool.tokenDecimals));
        } else {
          val = pool.totalStaked;
        }

        value = value.plus(val)
      }
    }
    // console.log(`Pool tvl : ${value}`)
    return new BigNumber(value);
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const poolTVL = usePoolsTotalValue();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  const ethPrice = usePriceEthBnb()
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i]
    if (farm.lpTotalInQuoteToken || farm.isTokenOnly) {
      let val;

      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      }else if(farm.quoteTokenSymbol === QuoteToken.ETH){
        val = ethPrice.times(farm.lpTotalInQuoteToken)
      }
      // else if(farm.isTokenOnly){
      //   console.log(farm)
      //   val = cakePrice.times(farm.tokenAmount);
      // }
      else{
        val = (farm.lpTotalInQuoteToken);
      }

      value = value.plus(val);
    }
  }

  value = value.plus(poolTVL);
  return value;
}
