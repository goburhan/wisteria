import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@macist-m/robinia-uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'
import { usePriceCakeBusd } from '../../../state/hooks'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getCakeAddress } from '../../../utils/addressHelpers'
import useAllEarnings from '../../../hooks/useAllEarnings'
import { getBalanceNumber } from '../../../utils/formatBalance'

const StyledFarmStakingCard = styled(Card)`
  background-image: url('/images/egg/2a.png');
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const Sitestat = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()))
  const eggPrice = usePriceCakeBusd().toNumber()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  
  return (
    <div className="stat-card h-full place-items-center text-white text-center grid grid-cols-4 gap-4 justify-item-center ">

      <div className="justify-item-center">
      <img src="/images/stat1.svg"  alt="rbs-ico"  />
      </div>
      <div>
      <img src="/images/stat2.svg"  alt="rbs-ico"  />
      </div>
      <div>
      <img src="/images/stat3.svg"  alt="rbs-ico"  />
      </div>
      <div>
      <img src="/images/stat4.svg"  alt="rbs-ico"  />
      </div>
      <div className="text-gray-300">Total Volume</div>
      <div className="text-gray-300">Daily Volume</div>
      <div className="text-gray-300">Active Users</div>
      <div className="text-gray-300">Trading Fee Saved</div>
      <div className="text-2xl font-bold text-purple-900">$19.79B</div>
      <div className="text-2xl font-bold text-purple-900">$166.54M</div>
      <div className="text-2xl font-bold text-purple-900">141.61K</div>
      <div className="text-2xl font-bold text-purple-900">$47.49M</div>
      
    </div>
  )
}

export default Sitestat
