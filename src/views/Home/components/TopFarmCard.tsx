import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import { Image } from '@macist-m/robinia-uikit'
import { QuoteToken } from 'config/constants/types'
import CardValue from './CardValue'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const TopFarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const farmImage = farm.isTokenOnly
    ? farm.tokenSymbol.toLowerCase()
    : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const farmAPY =
    farm.apy &&
    farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  return (
    <div className="grid  grid-cols-4">
       <Image
        src={`/images/farms/${farmImage}.png`}
        alt={farmImage}
        width={55}
        height={55}
        marginTop="5px"
        marginBottom="15px"
      />
       <div className="text-white mb-4">{farm.tokenSymbol}
       <CardValue
            fontSize="18px"
            value={100}
            decimals={0}
            prefix="$"
          />
        </div>
       
          
        </div>
    
    
    
  )
}

export default TopFarmCard
