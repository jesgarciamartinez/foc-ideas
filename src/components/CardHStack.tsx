import * as React from 'react'
import { HStack } from '@chakra-ui/react'

const CardHStack = ({ children }: { children?: any }) => {
  return (
    <HStack
      // overflow='auto'
      height='100%'
      // flex='1'
      // padding={1}
      backgroundColor='purple.50'
    >
      {children}
    </HStack>
  )
}
export default CardHStack
