import * as React from 'react'
import { Box, Button, Center, Flex, HStack, ScaleFade } from '@chakra-ui/react'
import { StateContext } from '../state'
import FlowCard from './FlowCard'
import DocsCard from './DocsCard/DocsCard'
import { AddIcon } from '@chakra-ui/icons'
const { useContext } = React

const CardHStack = () => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const flowCardRef = React.useRef<HTMLElement>(null)
  const [boxShadows, setBoxShadows] = React.useState(0)

  React.useLayoutEffect(() => {
    const width = flowCardRef.current?.offsetWidth
    // console.log({ width })
    const listener = (e: any) => {
      if (!width) return
      // console.log(e.target.scrollLeft)
      const scrollAmount = e.target.scrollLeft
      const newBoxShadows =
        scrollAmount < 10 ? -1 : Math.ceil(scrollAmount / (width - 40)) //discount left:40px
      // console.log({ newBoxShadows })
      if (newBoxShadows !== boxShadows) {
        setBoxShadows(newBoxShadows)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) scrollContainer.addEventListener('scroll', listener)
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', listener)
      }
    }
  }, [boxShadows])
  const { state, dispatch } = useContext(StateContext)
  return (
    <Flex
      overflowX='auto'
      overflowY='hidden'
      flexGrow={1}
      height='100%'
      backgroundColor='purple.50'
      ref={scrollContainerRef}
    >
      <HStack
        spacing={0}
        height='100%'
        //AndyM
        width={(state.docCards.length + 1) /*(flowCard)*/ * 39 + 'vw'}
        display='flex'
        flex-grow={1}
        position='relative'
        transition='width 100ms cubic-bezier(0.19, 1, 0.22, 1)'
      >
        <FlowCard
          transition='box-shadow 100ms linear,opacity 75ms linear,transform 200ms cubic-bezier(0.19, 1, 0.22, 1);'
          ref={flowCardRef}
          items={state.flowCardFunctions}
          dispatch={dispatch}
          //AndyM
          // transition='box-shadow 100ms linear,opacity 75ms linear,transform 200ms cubic-bezier(0.19, 1, 0.22, 1);'
          flexShrink={0}
          width='39vw'
          // maxWidth='625px'
          top='0px'
          position='sticky'
          flexGrow={1}
          overflowY='auto'
          borderLeft='1px solid rgba(0,0,0,0.05)'
          left={'0px'}
        ></FlowCard>
        {state.docCards.length > 0 ? (
          state.docCardsNavigationType === 'history' ? (
            <DocsCard
              index={state.docCardsSelectedIndex}
              func={(() => {
                const doc = state.docCards[state.docCardsSelectedIndex]
                console.log(state.docCards, state.docCardsSelectedIndex)
                return doc.type === 'editing'
                  ? state.functions.find(f => f.name === doc.fnName)
                  : undefined
              })()}
              dispatch={dispatch}
              functions={state.functions}
              navigationType={'history'}
              //AndyM
              transition='box-shadow 100ms linear,opacity 75ms linear,transform 200ms cubic-bezier(0.19, 1, 0.22, 1);'
              flexShrink={0}
              width='39vw'
              // maxWidth='625px'
              top='0px'
              position='sticky'
              flexGrow={1}
              overflowY='auto'
              borderLeft='1px solid rgba(0,0,0,0.05)'
              left={40 + 'px'}
            />
          ) : (
            state.docCards.map((doc, i) => {
              const func =
                doc.type === 'editing'
                  ? state.functions.find(f => f.name === doc.fnName)
                  : undefined
              return (
                <DocsCard
                  key={i}
                  index={i}
                  func={func}
                  dispatch={dispatch}
                  functions={state.functions}
                  navigationType={
                    i === 0 ? state.docCardsNavigationType : undefined
                  }
                  //AndyM
                  transition='box-shadow 100ms linear,opacity 75ms linear,transform 200ms cubic-bezier(0.19, 1, 0.22, 1);'
                  flexShrink={0}
                  width='39vw'
                  // maxWidth='625px'
                  top='0px'
                  position='sticky'
                  flexGrow={1}
                  overflowY='auto'
                  borderLeft='1px solid rgba(0,0,0,0.05)'
                  left={(i + 1) * 40 + 'px'}
                  boxShadow={
                    i < boxShadows
                      ? '0px 0px 15px 3px rgba(0,0,0,0.1)'
                      : '0px 0px 15px 3px rgba(0,0,0,0)'
                  }
                />
              )
            })
          )
        ) : (
          <Box width='39vw' flexGrow={1} flexShrink={0}>
            <Center>
              <ScaleFade in={true}>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='teal'
                  variant='ghost'
                  fontSize='xl'
                  onClick={() => dispatch({ type: 'newDocsCard' })}
                >
                  New function
                </Button>
              </ScaleFade>
            </Center>
          </Box>
        )}
      </HStack>
    </Flex>
  )
}
export default CardHStack
