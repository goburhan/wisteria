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

const Partners = () => {
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
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0,
  )

  return (
    <div className=" h-full place-items-center text-white grid lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-2 gap-4  ">
      <div className="lg:col-span-5  md:col-span-2 sm:col-span-2 text-white text-3xl  ml-6 py-2  rounded-xl  pbg mb-0">Partners</div>
      <a href='https://coinmarketcap.com/'>
        <img src="/images/coinmarketcap.svg" alt="rbs-ico" />
      </a>
      <a href='https://www.coingecko.com/'>
        <img src="/images/coingecko.svg" alt="rbs-ico" />
      </a>
      <a href='https://honeyfarm.finance/'>
        <img src="/images/honeybee.png" style={{maxWidth:180}} alt="rbs-ico" />
      </a>
      <a href='https://yanabu.com/'>
        <img src="/images/yanabu.png" style={{maxWidth:120}} alt="rbs-ico" />
      </a>
      <a href='https://robiniaswap.com/'>
        <img src="/images/robpart.png" style={{maxWidth:160}} alt="rbs-ico" />
      </a>
      
    </div>
  )
}

export default Partners
