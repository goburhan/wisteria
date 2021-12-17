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
import { getBusdAddress, getLockedSaleAddress, getRbsTokenAddress, getWbnbAddress } from 'utils/addressHelpers'
import { useLockedSale, useRbs } from 'hooks/useContract'
import Web3 from 'web3'
import UnlockButton from 'components/UnlockButton'
import Divider from './components/Divider'

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
  const [approve ,setApprove] = useState()
  const [buytokken,setBuy] = useState({})
  const [pickasset ,setContract] = useState()
  const [allow ,setAllowance] = useState()
  
  
  useEffect(() => {
    const getClaimList = async () => {
      if (account) {
        // account değerini kendi cüzdanımla değiştim bunu account olarak güncellemeliyiz.
        const userClaims = await lockedSale.methods
          .getUsersClaims('0x37B4Ef9c27c50B53a47b84B05C4688BB7ADB7AC0')
          .call()
        setClaimsx(userClaims)
        console.log(userClaims)
      } else {
        console.log('not logged in')
      }
    }

    const getAllowance = async () =>  {
      if (account){
        const isAllowed = await rbsContract.methods.allowance(addressx,account).call()
        setAllowance(isAllowed)
        console.log(isAllowed)
      }
      else{
        console.log("not Logged in")
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

   
  
   
   
    getAllowance()
    getContractBalance()
    getMpurch()
    getCtime()
    getBalance()
    getClaimList()
    getPrice()
    getRbsprice()
  }, [account, lockedSale, addressx,rbsContract,busdAddress])



  const ClaimExpand = styled.div<{ expanded: boolean }>`
  overflow: hidden;
    height: ${(props) => (props.expanded ? '35%' : '0px')}
  `
  const claimTokens = async (index) => {
    console.log('get token')
    console.log(account)
    await lockedSale.methods.claimTokens(index).send({ from: account })
  }

  const letAllowance = async () => {
    
  await rbsContract.methods.approve(account,"115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from:account})
  }

  const  busdbnb = async (value) => {
    const busdBnbAddr = value;
    return busdBnbAddr
  }

  
  const buyTokens = async ( busdorbnb,amount) => {
    
    const busdOrWst = busdbnb(busdorbnb)
    await lockedSale.methods.buyToken(amount,busdOrWst).send({from:account})

  }



  return (
    <Page>
      <div className="grid grid-cols-12  mb-10">
        <div className="col-span-9 col-start-3 h-fit rbs-card">
          <div className="mb-6"> </div>
          <div className="grid grid-cols-9 mb-6 ">
            <img
              src="/images/w-token.svg"
              className="col-start-4"
              style={{ maxWidth: 50 }}
              alt="call"
            />
            <div className="text-purple-900 mt-2 text-3xl">WST</div>
          </div>
          <div className="grid grid-cols-2 mb-6  text-center">
            <div className="grid grid-cols-1 text-gray-300">
              Call Option(mint) Price
              <div className="mt-2 text-white text-xl">{discountedPrice}</div>
            </div>
            <div className="grid grid-cols-1 text-gray-300 ">
              Market WST Price
              <div className="mt-2 text-white text-xl">{tokenamount}</div>
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
           
            <div className="grid grid-cols-3 w-9/12  gap-2 h-auto claim-card">
              <div className="mb-6 text-gray-200">Claim Block </div>
              <div className="mb-6 text-gray-200">Amount </div>
              <div className="mb-6 ml-10 text-gray-200"> Claim </div>
              {claimsx.map((element, index) => (
                <>
                  <div className="mb-6 text-white">{element.claimBlock}</div>
                  <div className="mb-6 text-white">{element.amount}% </div>{' '}
                  {element.amount > 0 ? (
                    <Button onClick={async () => claimTokens(index)}>Claim</Button>
                  ) : (
                    <div  className=" bg-purple-900  min-w-max text-white text-center px-2  ml-6  py-2  rounded-xl texts  " >
                      Claimed
                    </div>
                  )}
                  
                  <div hidden> Claim yapıldımı : {element.claimed}</div>
                </>
              ))}
                <>
                {claimsx.length > 0 ? 
                 <div >  </div> : 
                <div className='col-start-2 text-purple-900 noclaim-card text-lg mb-4  text-center mr-6' >No Token for <br/> Claim  </div>}
                </>
            </div>
          </ClaimExpand>




          <input type="text" className="rbs-card w-full mt-2 h-8" placeholder="Amount"  name="amount"  />
          <div className="grid grid-cols-2 mt-2 mb-4">
          {allow === 1
           ? 
          <Button style={{   maxWidth: 300 , marginLeft: 100 }} onClick={async () => letAllowance()}>
            Approve
          </Button>
          : 
            <Button style={{   maxWidth: 300 , marginLeft: 100 }} type="submit" onClick={async () => '/'}>
              Call option WST
            </Button> 
             }           
  <div className="dropdown place-items-end ml-24 inline-block relative">
    <button type="submit" className=" font-semibold w-24  rounded inline-flex items-center">
    <span className="selectasset   flex justify-center items-center rounded-xl mr-2 hover:opacity-80 shadow-sm">
            Select Assets
    </span>
    </button>
 
    <div className="dropdown-content absolute hidden text-gray-700 pt-1">
      <Button  name="busd"  className="rounded-t bg-purple-300 hover:bg-purple-600 py-2 px-4 block whitespace-no-wrap" >
      <div className='grid grid-cols-2 place-items-center gap-6'>
      <img src="/images/w-token.svg"  alt="wtoken" style={{maxWidth:30}}/>
      BUSD
      </div>
        </Button>
      <Button value="tokenadress" className="bg-white hover:bg-purple-600 py-2 px-4 block whitespace-no-wrap" >
      <div className='grid grid-cols-2 place-items-center gap-6'>
      <img src="/images/w-token.svg" alt="wtoken" style={{maxWidth:30}}/>
      BNB
      </div>
      </Button>
          
      </div>
  </div>
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
              <div>2222</div>
              <div>{contbalance}</div>
              <div>{contractbalance}</div>
              <div>{claimtime}</div>
              <div>{minpurchase}</div>
            </div>
          </div>
          <br />
        </div>
      </div>
    </Page>
  )
}

export default CallOption
