import * as React from 'react'
import { Flex, HStack } from '@chakra-ui/react'

const CardHStack = ({ children }: { children?: any }) => {
  return (
    <Flex overflowX='auto' overflowY='hidden' flexGrow={1}>
      <HStack
        // overflowX='scroll'
        width={React.Children.count(children) * 39 + 'vw'}
        backgroundColor='purple.50'
        //AndyM
        display='flex'
        flex-grow={1}
        position='relative'
        transition='width 100ms cubic-bezier(0.19, 1, 0.22, 1)'
      >
        {children}
      </HStack>
    </Flex>
  )
}
export default CardHStack
