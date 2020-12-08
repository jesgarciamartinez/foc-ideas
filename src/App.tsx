import * as React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { ChakraProvider, theme as _theme, extendTheme } from '@chakra-ui/react'
import SideBar from './components/Sidebar'
import CardHStack from './components/CardHStack'
import SplitPane from 'react-split-pane'
import FlowCard from './components/FlowCard'
import { useAppReducer } from './state'
import FunctionCreationForm from './components/FunctionCreationForm'
import { matchSorter } from 'match-sorter'
import './styles.css'
import { HotKeys } from 'react-hotkeys'
// import { ColorModeSwitcher } from './ColorModeSwitcher'
// import ts from 'typescript'

const theme = extendTheme({
  styles: {
    global: {
      html: { minWidth: '860px' },
    },
  },
})
// const code = 'function add(n,m){ n + m }'
// const sc = ts.createSourceFile('x.ts', code, ts.ScriptTarget.Latest, true)
// console.info(sc)
// let indent = 0
// function print(node: ts.Node) {
//   console.log(new Array(indent + 1).join(' ') + ts.SyntaxKind[node.kind])
//   indent++
//   ts.forEachChild(node, print)
//   indent--
// }

// let result = ts.transpileModule(code, {
//   compilerOptions: { module: ts.ModuleKind.CommonJS },
// })

// print(sc)

export const App = () => {
  const [state, dispatch] = useAppReducer()
  const onDragEnd = React.useCallback(
    dropResult => {
      console.log({ dropResult })
      if (
        //SideBar to FlowCard
        dropResult.source.droppableId !== 'FlowCard' &&
        dropResult.destination?.droppableId === 'FlowCard'
      ) {
        dispatch({
          type: 'dropFnFromSideBarOnFlowCard',
          index: dropResult.destination.index,
          draggableId: dropResult.draggableId,
        })
      } else if (
        dropResult.source.droppableId === 'FlowCard' &&
        dropResult.destination?.droppableId === 'FlowCard'
      ) {
        dispatch({
          type: 'dropFnFromFlowCardToFlowCard',
          sourceIndex: dropResult.source.index,
          destinationIndex: dropResult.destination.index,
        })
      } else {
        dispatch({ type: 'dropOutside' })

        //Regain focus after dropping outside - TODO does not work if dragged and esc pressed
        const li: any = document.querySelector(
          `[id$='${dropResult.draggableId}']`,
        )
        if (li) {
          console.log({ li })
          li.focus()
        }
      }
    },
    [dispatch],
  )
  const sideBarRef = React.useRef()
  return (
    <ChakraProvider theme={theme}>
      <HotKeys
        keyMap={{ focusSidebar: ['ctrl+b', 'command+b'] }} //TODO parameterize
        handlers={{
          focusSidebar() {
            let a = sideBarRef as any
            a.current.focus()
          },
        }}
      >
        <DragDropContext
          onDragStart={() => {
            dispatch({ type: 'isDragging' })
          }}
          onDragEnd={onDragEnd}
        >
          <SplitPane
            style={{ overflow: 'auto', height: '100vh' }}
            defaultSize='20%'
            minSize={100}
            maxSize={-300}
            resizerStyle={{
              border: '3px solid rgba(1, 22, 39, 0.21)',
              // boxShadow: ,
              zIndex: 20,
              cursor: 'col-resize',
            }}
            split='vertical'
          >
            <SideBar
              ref={sideBarRef}
              searchValue={state.searchValue}
              dispatch={dispatch}
              isAnyItemDragging={state.isSideBarItemDragging}
              items={[
                {
                  nodeId: 'functions',
                  label: 'Functions',
                  items: matchSorter(state.functions, state.searchValue, {
                    keys: ['name'],
                  }),
                },
                {
                  nodeId: 'types',
                  label: 'Data Types',
                  items: matchSorter(state.dataTypes, state.searchValue, {
                    keys: ['name'],
                  }),
                },
                {
                  nodeId: 'effects',
                  label: 'Effects',
                  items: matchSorter(state.effects, state.searchValue, {
                    keys: ['name'],
                  }),
                },
              ]}
            ></SideBar>
            <CardHStack>
              <FlowCard
                items={state.flowCardFunctions}
                dispatch={dispatch}
                name=''
              ></FlowCard>
              <FunctionCreationForm />
              {/* <Card>
              <form>
                <InputGroup size='sm'>
                  <InputLeftAddon>
                    <Code>function</Code>
                  </InputLeftAddon>
                  <Input></Input>
                  <InputRightAddon>
                    <Code>(</Code>
                  </InputRightAddon>
                </InputGroup>
                <Menu isOpen={true}>
                  <MenuButton as={Button}>Type</MenuButton>
                  <MenuList>
                    <MenuItem>+ New Type</MenuItem>
                    <MenuItem>String</MenuItem>
                    <MenuItem>Number</MenuItem>
                  </MenuList>
                </Menu>
              </form>
            </Card>
            <Card>
              <Editor></Editor>
            </Card> */}
            </CardHStack>
          </SplitPane>
        </DragDropContext>
      </HotKeys>
    </ChakraProvider>
  )
}
//"calc(100vh - 3rem)"
