import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { QuoteToken } from 'config/constants/types'
import Slider from 'react-slick'
import { provider } from 'web3-core'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, useTotalValue } from 'state/hooks'
import CardValue from 'views/Home/components/CardValue'
import { Link } from 'react-router-dom'
import { Image } from '@macist-m/robinia-uikit'
import Divider from 'views/Farms/components/Divider'
import { getBalanceNumber } from 'utils/formatBalance'
import { useBurnedBalance, useTotalSupply } from 'hooks/useTokenBalance'
import { getCakeAddress } from 'utils/addressHelpers'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardProps {
  farm: FarmWithStakedValue
  
}


const TopSliderCard = () => {
  const totalValue = useTotalValue()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getCakeAddress())
  const eggPrice = usePriceCakeBusd()
  const circSupply = totalSupply ? totalSupply.minus(burnedBalance) : new BigNumber(0)
  const marketCap = eggPrice.times(circSupply)
  const cakePriceUsd = usePriceCakeBusd()
  const farms = useFarms()
  const bnbPrice = usePriceBnbBusd()
  const cakeSupply = getBalanceNumber(circSupply)
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 750,
    autoplaySpeed: 5000,
    arrows: false,
  }
 
  return (
    <div className="h-full mt-10  ">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="text-white text-4xl mb-8 leading-10">
            The First YieldFarm DeFi 2.0 (PVC) on BSC network.
          </div>
          <div className="text-gray-300 text-center text-xl text-lg leading-6">
            WisteriaSwap is a new DeFi 2.0 (PVC) model that combines two models: a system
            in which the protocol can secure its own liquidity, and a system in which
            inflation can be controlled by continuously burning tokens.
          </div>
        </div>

        <div className="rbs-card  grid sm:grid-cols-2 md:grid-cols-2 gap-6 ">
          <div>
            <div className='text-gray-300 text-sm'>Total Value Locked</div>

            {totalValue.toNumber() > 0 ? (
              <CardValue
                value={totalValue.toNumber()}
                prefix="$"
                decimals={2}
                fontSize="18px"
              />
            ) : (
              <CardValue value={0} prefix="$" decimals={2} fontSize="18px" />
            )}
          </div>
          <div className=' text-gray-300 text-smtext-gray-300 text-sm'>
          WST APY
          <CardValue
                fontSize="18px"
                value={getBalanceNumber(marketCap)}
                decimals={0}
                prefix="$"
              />

          </div>
        </div>
      </div>
    </div>
  )
}

export default TopSliderCard
