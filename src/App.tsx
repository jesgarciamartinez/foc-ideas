import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'
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
  Editable,
  EditablePreview,
  EditableInput,
  Flex,
  Text,
  Textarea,
} from '@chakra-ui/react'
import SideBar from './components/Sidebar'
import CardHStack from './components/CardHStack'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { IfunctionView } from './components/interfaces'
import SplitPane from 'react-split-pane'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Card from './components/Card'
import FlowCard from './components/FlowCard'

const { useState } = React
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
  //TODO change pane orientation, onDragEnd pane, change theme, dark/light, export code, export JSON, badge: icons/names/both
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
            <Card>
              <HStack>
                <Editable defaultValue={'type'}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Text> : </Text>
                <Input maxWidth='50%'></Input>
                <ArrowForwardIcon></ArrowForwardIcon>
                <Input maxWidth='50%'></Input>
              </HStack>
              <HStack>
                <Editable defaultValue={'function name'}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
                <Text> : </Text>
                <Input maxWidth='50%'></Input>
                <ArrowForwardIcon></ArrowForwardIcon>
                <Input maxWidth='50%'></Input>
              </HStack>
              <Textarea></Textarea>
            </Card>
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
