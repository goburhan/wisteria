import React, { useEffect, useCallback, useState } from 'react'
import { Link, Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { Image, Heading, Button } from '@macist-m/robinia-uikit'
import Page from 'components/layout/Page'
import ethers from 'ethers'
import useRefresh from 'hooks/useRefresh'
import { Address, QuoteToken } from 'config/constants/types'
import ExpandableSectionButton from 'components/ExpandableSectionButton/ClaimButton'
import {
  getBusdAddress,
  getLockedSaleAddress,
  getRbsTokenAddress,
  getWbnbAddress,
} from 'utils/addressHelpers'
import { useBusd, useLockedSale, useRbs } from 'hooks/useContract'
import Web3 from 'web3'
import UnlockButton from 'components/UnlockButton'

export interface FarmsProps {
  tokenMode?: boolean
}

export interface ExpandableSectionProps {
  isTokenOnly?: boolean
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  quoteTokenAdresses?: Address
  quoteTokenSymbol?: string
  tokenAddresses: Address
}

const CallOption: React.FC<FarmsProps> = (farmsProps) => {
  const { path } = useRouteMatch()
  const addressx = getLockedSaleAddress()
  const busdAddress = getBusdAddress()
  const lockedSale = useLockedSale(addressx)
  const rbsContract = useRbs()
  const busdContract = useBusd()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [discountedPrice, setDiscountedPrice] = useState('') // fromweiden string dönüyor numbera çevirmedim bi matematik işlemi yapmayacağımız için
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const [veri, setVeri] = useState()
  const [claimsx, setClaimsx] = useState([])
  const [tokenamount, setAmount] = useState()
  const [contractbalance, setBalance] = useState()
  const [claimtime, setCtime] = useState()
  const [minpurchase, setMinp] = useState()
  const [contbalance, setContb] = useState()
  const [approve, setApprove] = useState()
  const [busdBalanc, setBusdBalance] = useState()
  const [buytokken, setBuy] = useState({})
  const [pickasset, setContract] = useState()
  const [allow, setAllowance] = useState(0)
  const [inputAmount, setInputAmount] = useState('');

  const [buyTokenWBNB, setBuyTokenWBNB] = useState(false); // true ise wbnb ile alacak default busd.

  useEffect(() => {
    const getClaimList = async () => {
      if (account) {
        // account değerini kendi cüzdanımla değiştim bunu account olarak güncellemeliyiz.
        const userClaims = await lockedSale.methods
          .getUsersClaims(account)
          .call()
        setClaimsx(userClaims)
        console.log(userClaims)
      } else {
        console.log('not logged in')
      }
    }

    const getAllowance = async () => {
      if (account) {
        const isAllowed = await busdContract.methods.allowance(account, addressx).call()
        console.log(`Allowance : ${isAllowed}`)
        setAllowance(isAllowed)
        console.log(isAllowed)
      } else {
        console.log('not Logged in')
      }
    }

    const getPrice = async () => {
      let price = await lockedSale.methods
        .getTokensOut(busdAddress, '1000000000000000000')
        .call()
      // ether görünümünü viewda yapalım daha sağlıklı olacaktır.
      price = Web3.utils.fromWei(price, 'ether')
      setDiscountedPrice(new BigNumber(price).toString())
    }

    const getRbsprice = async () => {
      let rbs = await lockedSale.methods
        .getAmountOut(busdAddress, '1000000000000000000')
        .call()
      rbs = Web3.utils.fromWei(rbs, 'ether')
      setAmount(rbs)
    }

    const getBalance = async () => {
      const cBalance = await lockedSale.methods.saleBP().call()
      setBalance(cBalance)
    }

    const getCtime = async () => {
      const time = await lockedSale.methods.claimTime().call()
      setCtime(time)
    }

    const getMpurch = async () => {
      const minP = await lockedSale.methods.minAmount().call()
      setMinp(minP)
    }

    const getContractBalance = async () => {
      const contractB = await lockedSale.methods.getContractBalance().call()
      setContb(contractB)
    }

    const getBusdBalance = async () => {
  
      const busdbalance = await busdContract.methods.balanceOf(account).call()
      setBusdBalance(busdbalance)
    }

    
    getBusdBalance()
    getAllowance()
    getContractBalance()
    getMpurch()
    getCtime()
    getBalance()
    getClaimList()
    getPrice()
    getRbsprice()
  }, [account, lockedSale, addressx, busdContract, busdAddress])

  const ClaimExpand = styled.div<{ expanded: boolean }>`
    overflow: hidden;
    height: ${(props) => (props.expanded ? '34%' : '0px')};
  `
  const claimTokens = async (index) => {
    console.log('get token')
    console.log(account)
    await lockedSale.methods.claimTokens(index).send({ from: account })
  }

  console.log(allow)
      
  const letAllowance = async () => {
    await busdContract.methods
      .approve(
        addressx,
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      )
      .send({ from: account })
  }

  const busdbnb = async (value) => {
    const busdBnbAddr = value
    return busdBnbAddr
  }

 
  const buyWithWBNB = async (amount) => {
    // amount wei cinsinden 18 haneli olmalı
    await lockedSale.methods.buyToken(amount,'0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c').send({from : account})
  }

  const buyWithBUSD = async (amount) => {
    await lockedSale.methods.buyToken(amount,'0xe9e7cea3dedca5984780bafc599bd69add087d56').send({from : account})
  }
  function handleChange(e) {
    setInputAmount(e.target.value);
    }

  return (
    <Page>
      <div className="grid grid-cols-12  mb-32">
        <div className="col-span-9 col-start-3  max-h-fit rbs-card">
          <div className="grid grid-cols-9 mb-2 ">
            <img
              src="/images/w-token.svg"
              className="col-start-4 "
              style={{ maxWidth: 50 }}
              alt="call"
            />
            <div className="text-purple-900 sm:ml-6 md:ml-0 mt-2 text-3xl">WST</div>
          </div>
          <div className="grid grid-cols-2 mb-6  text-center">
            <div className="grid grid-cols-1 text-gray-300">
              Call Option(mint) Price
              <div className="mt-2 text-white text-xl">{new BigNumber(discountedPrice).toFixed(4)  } </div>
            </div>
            <div className="grid grid-cols-1 text-gray-300 ">
              Market WST Price
              <div className="mt-2 text-white text-xl">{new BigNumber(tokenamount).toFixed(4)}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 mr-16 gap-6 text-white text-right  mb-2 text-center">
            Call Option
            <ExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
            />
          </div>

          <ClaimExpand expanded={showExpandableSection}>
            <div className="grid grid-cols-3 w-9/12  overflow-auto  gap-1  max-h-56 claim-card">
              <div className="mb-6 text-gray-200">Claim Block </div>
              <div className="mb-6 text-gray-200">Amount </div>
              <div className="mb-6 ml-8 text-gray-200"> Claim </div>
              {claimsx.map((element, index) => (
                <>
                  <div className="mb-6 text-white">{element.claimBlock}</div>
                  <div className="text-white">{Web3.utils.toWei(element.amount,'ether')}% </div>

                  {element.amount > 0 ? (
                      
                    <Button style={{ maxWidth: 75, maxHeight:25, marginLeft:15 }} onClick={async () => claimTokens(index)}>Claim</Button>
                  ) : (
                    <div className="text-white mb-6 text-center px-2      rounded-xl   ">
                      Claimed
                    </div>
                  )}
                  <div hidden> Claim yapıldımı : {element.claimed}</div>
                </>
              ))}
              <>
                {claimsx.length > 0 ? (
                  <div> </div>
                ) : (
                  <div className="col-start-1 col-span-3 text-purple-900 noclaim-card text-lg   text-center">
                    No Token for <br /> Claim{' '}
                  </div>
                )}
              </>
            </div>
          </ClaimExpand>

          <input
            type="text"
            className="rbs-card w-full mt-2 h-8"
            placeholder="Amount"
            name="amount"
            value={inputAmount}
            onChange={handleChange}

          />
          <div className="  mt-2 ">
            {allow > 0 ? (
                           <Button
                           style={{ maxWidth: 300, marginLeft: 90 }}
                           type="submit"
                           onClick={async () => buyWithBUSD(Web3.utils.toWei(inputAmount, 'ether'))}
                         >
                           Call option WST
                         </Button>

            ) : (
              <Button
              className='sm:ml-4 md:ml-24 lg:ml-36'
                style={{ minWidth: 240, maxWidth:260 }}
                onClick={async () => letAllowance()}
            
              >
                Approve
              </Button>
            )}
            
          </div>

          <div className="grid grid-cols-2 mt-2">
            <div className="grid grid-cols-1 text-gray-300 gap-2 ">
              <div>Your Balance</div>
              <div>Max You Can Buy</div>
              <div>Call Option Premium</div>
              <div>Vesting Term</div>
              <div>Minimum Purchase</div>
            </div>
            <div className="text-right grid grid-cols-1  text-white">
              <div>{busdBalanc} BUSD</div>
              <div>{contbalance ? Web3.utils.fromWei(contbalance) : 0} WST</div>
              <div>{new BigNumber(contractbalance).div(10).toNumber()} %</div>
              
              <div>{claimtime} Blocks</div>
              <div>{minpurchase ? Web3.utils.fromWei(minpurchase) : 0} WST</div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </Page>
  )
}

export default CallOption
