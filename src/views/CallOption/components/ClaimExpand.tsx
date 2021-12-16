import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link, LinkExternal } from '@macist-m/robinia-uikit'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { Address } from 'config/constants/types'

export interface ExpandableSectionProps {
 
  blockNumber: number
  amount : number 
}

const Wrapper = styled.div`
  margin-top: 10px;
`


const DetailsSection: React.FC<ExpandableSectionProps> = ({
    blockNumber,
    amount,

}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      
     
      
    </Wrapper>
  )
}

export default DetailsSection
