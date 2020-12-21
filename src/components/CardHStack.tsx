import * as React from 'react'
import { Flex, HStack } from '@chakra-ui/react'

const CardHStack = ({ children }: { children?: any }) => {
  // const scrollContainer = React.useRef<HTMLDivElement>(null)
  // React.useEffect(() => {
  //   scrollContainer.current?.addEventListener('scroll', (e: any) =>
  //     console.log('c', e.target?.scrollLeft),
  //   )
  // }, [])
  return (
    <Flex
      overflowX='auto'
      overflowY='hidden'
      flexGrow={1}
      height='100%'
      backgroundColor='purple.50'
      // ref={scrollContainer}
    >
      <HStack
        height='100%'
        //AndyM
        width={React.Children.count(children) * 39 + 'vw'}
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
