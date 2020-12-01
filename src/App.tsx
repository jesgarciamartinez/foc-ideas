import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'
// import MonacoEditor from 'react-monaco-editor'
import MonacoEditor from '@monaco-editor/react'
import ts from 'typescript'
import {
  ChakraProvider,
  Box,
  Center,
  Button,
  theme,
  HStack,
  VStack,
  Code,
  Spacer,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react'
import SideBar from './components/Sidebar'
import CardHStack from './components/CardHStack'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { IfunctionView } from './components/interfaces'
import SplitPane from 'react-split-pane'
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import TypeBadge from './components/TypeBadge'

const { useState } = React
const code = 'function add(n,m){ n + m }'
const sc = ts.createSourceFile('x.ts', code, ts.ScriptTarget.Latest, true)
console.info(sc)
let indent = 0
function print(node: ts.Node) {
  console.log(new Array(indent + 1).join(' ') + ts.SyntaxKind[node.kind])
  indent++
  ts.forEachChild(node, print)
  indent--
}

let result = ts.transpileModule(code, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
})

print(sc)

const Card = ({ children }: { children?: any }) => {
  return (
    // <Droppable droppableId='Card'>
    //   {(provided, snapshot) => {
    //     return (
    <Box
      // ref={provided.innerRef}
      // {...provided.droppableProps}
      padding='4'
      boxShadow={'base'}
      minWidth={'50%'}
      minHeight='100%'
      backgroundColor='white'
    >
      {children}
      {/* {provided.placeholder} */}
    </Box>
    //     )
    //   }}
    // </Droppable>
  )
}

const FlowCard = ({ items }: { items: Array<IfunctionView> }) => {
  return (
    <Droppable droppableId='FlowCard'>
      {(provided, snapshot) => {
        return (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            boxShadow={'base'}
            padding={1}
            minWidth={'50%'}
            minHeight='100%'
            position='relative'
            backgroundColor='white'
          >
            {items.map((item, i) => {
              return (
                <Draggable key={item.name} draggableId={item.name} index={i}>
                  {(provided, snapshot) => {
                    const hasZeroParams = item.parameterTypes.length === 0
                    const hasOneParam = item.parameterTypes.length === 1
                    return (
                      <Flex
                        // templateColumns='repeat(8,1fr)'
                        // gap={4}
                        // width='100%'
                        flex={1}
                        marginY={1}
                        backgroundColor={i % 2 === 0 ? 'teal.50' : 'gray.100'}
                        wrap='nowrap'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        {/* <HStack
                          backgroundColor='royalblue'
                          justifyContent='center'
                          colStart={8 - item.parameterTypes.length - 1} // name + parameters + returnType + example
                        > */}
                        <Center>
                          <Code>{item.name}</Code>
                        </Center>
                        <Spacer></Spacer>
                        {/* </HStack> */}

                        {hasZeroParams || hasOneParam
                          ? null
                          : item.parameterTypes
                              .slice(0, item.parameterTypes.length - 1)
                              .map((param, i) => {
                                return (
                                  <HStack>
                                    <TypeBadge>{param}</TypeBadge>{' '}
                                    <ArrowForwardIcon />
                                  </HStack>
                                )
                              })}
                        <VStack>
                          {hasZeroParams ? (
                            <Code>()</Code>
                          ) : (
                            <TypeBadge>
                              {
                                item.parameterTypes[
                                  item.parameterTypes.length - 1
                                ]
                              }
                            </TypeBadge>
                          )}
                          <ArrowDownIcon></ArrowDownIcon>
                          <TypeBadge>{item.returnType}</TypeBadge>
                        </VStack>
                        <Box>{'some example value and more stuff'}</Box>
                      </Flex>
                    )
                  }}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </Box>
        )
      }}
    </Droppable>
  )
}

function Editor() {
  // function onChange(newValue: any, e: any) {
  //   console.log('onChange', newValue, e)
  // }

  // const code = this.state.code;
  const options = {
    selectOnLineNumbers: true,
  }
  return (
    <MonacoEditor
      width='100%'
      height='600px'
      language='typescript'
      theme='vs-dark'
      value={code}
      options={options}
      // onChange={onChange}
      editorDidMount={(editor, monaco) =>
        console.log('editorDidMount', { editor })
      }
    />
  )
}
const fnsInitial: Array<IfunctionView> = [
  { name: 'length', parameterTypes: ['string'], returnType: 'number' },
  {
    name: 'exclaimmmmmmmmmmmmmmmmmmmmmmmmmmmm',
    parameterTypes: ['string', 'string', 'string', 'string', 'string'],
    returnType: 'string',
  },
  { name: 'upperCase', parameterTypes: [], returnType: 'string' },
  { name: 'sth', parameterTypes: ['string'], returnType: 'string' },
]

export const App = () => {
  const [fns, setFns] = useState(fnsInitial)
  let flowBricks = fns
  //TODO change pane orientation, onDragEnd pane, change theme, dark/light, export code, export JSON
  return (
    <ChakraProvider theme={theme}>
      <DragDropContext onDragEnd={() => {}}>
        <SplitPane
          style={{ overflow: 'auto', height: '100vh' }}
          defaultSize='20%'
          minSize={100}
          maxSize={-300}
          resizerStyle={{
            border: '3px solid rgba(1, 22, 39, 0.21)',
            zIndex: 20,
            cursor: 'col-resize',
          }}
          split='vertical'
        >
          <SideBar
            items={[
              {
                nodeId: 'functions',
                label: 'Functions',
                items: fns,
              },
            ]}
          ></SideBar>
          <CardHStack>
            <FlowCard items={flowBricks}></FlowCard>
            <Card></Card>
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
    </ChakraProvider>
  )
}
//"calc(100vh - 3rem)"
