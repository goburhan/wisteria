import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb, stakeDelegateFarm } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useDelegateFarmContract } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  console.log(account)
  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount,account, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

// parametre olarak farmContract addresi gelmeli.
export const usePoolStake = (sousId, farmContract) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const delegateFarmContract = useDelegateFarmContract(farmContract)

  const handleStake = useCallback(
    async (amount: string) => {
      await stakeDelegateFarm(delegateFarmContract, amount, account)
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId,account))
    },
    [account, dispatch, sousId, delegateFarmContract],
  )

  return { onStake: handleStake }
}

export default useStake
