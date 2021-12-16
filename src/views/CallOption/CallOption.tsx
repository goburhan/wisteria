import React, { useEffect, useCallback, useState } from 'react'
import { Link, Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { Image, Heading } from '@macist-m/robinia-uikit'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import Page from 'components/layout/Page'
import { useFarms, usePriceBnbBusd, usePriceCakeBusd, usePriceEthBnb } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { Address, QuoteToken } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton/ClaimButton'
import { getBusdAddress, getLockedSaleAddress } from 'utils/addressHelpers'
import { useLockedSale } from 'hooks/useContract'
import Web3 from 'web3'
import DetailsSection from './components/FarmCard/DetailsSection'
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
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const [discountedPrice, setDiscountedPrice] = useState('') // fromweiden string dönüyor numbera çevirmedim bi matematik işlemi yapmayacağımız için
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const [veri, setVeri] = useState()
  const [claimsx, setClaimsx] = useState([])
  const [tokenamount, setAmount] = useState()
  const [contractbalance, setBalance] = useState()
  const [claimtime, setCtime] = useState()
  const [minpurchase, setMinp] = useState()


  

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

    const getPrice = async () => {
      let price = await lockedSale.methods
        .getTokensOut(busdAddress, '1000000000000000000')
        .call()
      // ether görünümünü viewda yapalım daha sağlıklı olacaktır.
      price = Web3.utils.fromWei(price, 'ether')
      setDiscountedPrice(new BigNumber(price).toString())
    }

    const getRbsprice = async () => {
      let rbs = await lockedSale.methods.getAmountOut(busdAddress,'1000000000000000000').call()
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

    getMpurch()
    getCtime()
    getBalance()
    getClaimList()
    getPrice()
    getRbsprice()
  }, [account, lockedSale, busdAddress])

  const ClaimExpand = styled.div<{ expanded: boolean }>`
    height: ${(props) => (props.expanded ? '36%' : '0px')};
    overflow: hidden;
  `

 
  return (
    <Page>
      <div className="grid grid-cols-12  mb-10">
        <div className="col-span-9 col-start-3  rbs-card">
          <div className="mb-6">ayarlar eklenecek</div>
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
              <div className="mt-2 text-white text-xl">{discountedPrice }</div>
            </div>
            <div className="grid grid-cols-1 text-gray-300 ">
              Market WST Price
              <div className="mt-2 text-white text-xl">$1231231</div>
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
                  <div className="mb-6 text-white">{element.amount}% </div>
                    {' '}
                    {element.amount > 0 ? (
                      <Link
                        className="bg-purple-900 h-8 w-24  text-center  ml-10 py-1 px-6  rounded-xl  text-sm  text-white cursor-pointer hover:opacity-75 "
                        to="/farms"
                      >
                        Claim
                      </Link>
                    ) : (
                      <div className=" bg-purple-900  text-white text-center px-2  ml-6  py-2  rounded-xl  ">
                        NotClaimable
                      </div>
                    )}
                    

                  <div hidden> Claim yapıldımı : {element.claimed}</div>
                </>
              ))}
            </div>
          </ClaimExpand>
          <input type="text" className="rbs-card w-full  h-8" placeholder="Amount" />

          <div className="grid grid-cols-2 mt-2">
            <div className="grid grid-cols-1 text-gray-300 gap-2 ">
              <div>Your Balance</div>
              <div>Max You Can Buy</div>
              <div>Call Option Premium</div>
              <div>Vesting Term</div>
              <div>Minimum Purchase</div>
            </div>
            <div className="text-right grid grid-cols-1  text-white">
              <div>{tokenamount}</div>
              <div>Price 3</div>
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
