import * as React from 'react'
import { Box, Button, Center, Flex, HStack, ScaleFade } from '@chakra-ui/react'
import { StateContext } from '../state'
import FlowCard from './FlowCard'
import DocsCard from './DocsCard/DocsCard'
import { AddIcon } from '@chakra-ui/icons'
const { useContext } = React

const CardHStack = () => {
  // const scrollContainer = React.useRef<HTMLDivElement>(null)
  // React.useEffect(() => {
  //   scrollContainer.current?.addEventListener('scroll', (e: any) =>
  //     console.log('c', e.target?.scrollLeft),
  //   )
  // }, [])
  const { state, dispatch } = useContext(StateContext)
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
        width={(state.docCards.length + 1) /*(flowCard)*/ * 39 + 'vw'}
        display='flex'
        flex-grow={1}
        position='relative'
        transition='width 100ms cubic-bezier(0.19, 1, 0.22, 1)'
      >
        <FlowCard
          items={state.flowCardFunctions}
          dispatch={dispatch}
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
                />
              )
            })
          )
        ) : (
          <Box width={'100%'}>
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
