import * as React from 'react'
import { HStack } from '@chakra-ui/react'

const CardHStack = ({ children }: { children?: any }) => {
  return (
    <HStack
      // overflowY='scroll'
      overflowX='scroll'
      // height='100%'
      // flex='1'
      // padding={1}
      width={'100%'}
      backgroundColor='purple.50'
    >
      {children}
    </HStack>
  )
}
export default CardHStack
