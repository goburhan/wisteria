import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import { Image } from '@macist-m/robinia-uikit'
import { QuoteToken } from 'config/constants/types'
import Divider from 'views/Farms/components/Divider'
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

const Launchpoolcard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
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
    <div className="grid grid-cols-3 farmingcard gap-20 ">
       <div className = "grid grid-cols-2">
       <Image
        src={`/images/farms/${farmImage}.png`}
        alt={farmImage}
        width={55}
        height={55}
        marginTop="5px"
        marginBottom="15px"
      />
       <div className="text-white mb-4">{farm.lpSymbol}</div>

       </div>
    

        <div className="grid-cols-1">
        APR
            <div className="text-primary font-bold text-lg">{farmAPY}% </div>
        </div>
      <Link className="bg-white  px-3 py-3 w-28 h-10 rounded-xl text-center text-purple-900 cursor-pointer hover:opacity-75 " to="/farms">
       Stake WST
      </Link>
          
        </div>
    
    
    
  )
}

export default Launchpoolcard
