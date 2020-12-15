import * as React from 'react'
import { Box, Flex, HStack } from '@chakra-ui/react'

const CardHStack = ({ children }: { children?: any }) => {
  return (
    // <Flex flexGrow={1} overflowX='auto' overflowY='hidden'>
    <Box
      // flexDirection='row'
      // wrap='nowrap'
      // justifyContent='space-around'
      overflow='auto'
      whiteSpace={'nowrap'}
      height='100%'
      flexGrow={1}
      width={React.Children.count(children) * 625}
      transition={'width 100ms cubic-bezier(0.19, 1, 0.22, 1)'}
      // flex='1'
      // padding={1}
      backgroundColor='purple.50'
    >
      {children}
    </Box>
    // </Flex>
  )
}
export default CardHStack
