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

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  console.log(account)
  const TranslateString = useI18n()
  const farmsWithBalance = useFarmsWithBalance()
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()))
  const eggPrice = usePriceCakeBusd().toNumber()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <div className="rbs-card h-full   grid sm:grid-cols-3 md:grid-cols-3  gap-4 ">
      
      <div className="text-md text-purple-900 col-span-2 font-bold mb-6">Farms & Staking</div>

      <div> </div>

      <div> 
        <div className="grid grid-cols-3 sm:gap-16 md:gap-0  mt-2">
          <img src="/images/w-token.svg" style={{ maxHeight: 60 , maxWidth:80 }} alt="rbs-ico"  />
          <div className="max-h-full " >
         <img src="/images/metamask+.svg" style={{ minHeight: 70 , maxWidth:80 }} alt="rbs-ico"  />
         </div>
        </div>
    
      <div className="mt-4">
        {account ? (
          <Button
            id="harvest-all"
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
            fullWidth
          >
            {pendingTx
              ? TranslateString(548, 'Collecting Robinia')
              : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
          </Button>
        ) : (
          <UnlockButton fullWidth />
        )}
      </div>
      </div>

      <div className=" text-white ml-6">
        <span>Wisteria to Harvest</span>
        <CakeHarvestBalance earningsSum={earningsSum} />
        <Label>~${(eggPrice * earningsSum).toFixed(2)}</Label>
      </div>


      <div className="mt-0 ml-6 text-white">
        <span>Wisteria in Wallet</span>
        <CakeWalletBalance cakeBalance={cakeBalance} />
        <Label>~${(eggPrice * cakeBalance).toFixed(2)}</Label>
      </div>


      

      

      
    </div>

    // <StyledFarmStakingCard>
    //   <CardBody>
    //     <Heading size="xl" mb="24px">
    //       {TranslateString(542, 'Farms & Staking')}
    //     </Heading>
    //     <CardImage src="/images/egg/2.png" alt="cake logo" width={64} height={64} />
    //     <Block>
    //       <Label>{TranslateString(544, 'EGG to Harvest')}</Label>
    //       <CakeHarvestBalance earningsSum={earningsSum}/>
    //       <Label>~${(eggPrice * earningsSum).toFixed(2)}</Label>
    //     </Block>
    //     <Block>
    //       <Label>{TranslateString(546, 'EGG in Wallet')}</Label>
    //       <CakeWalletBalance cakeBalance={cakeBalance} />
    //       <Label>~${(eggPrice * cakeBalance).toFixed(2)}</Label>
    //     </Block>
    //     <Actions>
    //       {account ? (
    //         <Button
    //           id="harvest-all"
    //           disabled={balancesWithValue.length <= 0 || pendingTx}
    //           onClick={harvestAllFarms}
    //           fullWidth
    //         >
    //           {pendingTx
    //             ? TranslateString(548, 'Collecting EGG')
    //             : TranslateString(999, `Harvest all (${balancesWithValue.length})`)}
    //         </Button>
    //       ) : (
    //         <UnlockButton fullWidth />
    //       )}
    //     </Actions>
    //   </CardBody>
    // </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
