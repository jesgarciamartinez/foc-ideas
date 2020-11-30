import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuid } from 'uuid'
// import MonacoEditor from 'react-monaco-editor'
import MonacoEditor from '@monaco-editor/react'
import ts from 'typescript'
import {
  ChakraProvider,
  Box,
  Button,
  theme,
  HStack,
  Code,
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
} from '@chakra-ui/react'
import SideBar from './components/Sidebar'
import BrickFunctionView from './components/BrickFunctionView'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import { IfunctionView } from './components/interfaces'
import './styles.css'
import { FaBoxOpen } from 'react-icons/fa'

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

// const Card = ({ children }: { children?: any }) => {
//   return (
//     <Droppable droppableId='Card'>
//       {(provided, snapshot) => {
//         return (
//           <Box
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             padding='4'
//             boxShadow={'base'}
//             minWidth={'50%'}
//             minHeight='100%'
//             backgroundColor='white'>
//             {children}
//             {provided.placeholder}
//           </Box>
//         )
//       }}
//     </Droppable>
//   )
// }

const BrickFlowCard = ({ items }: { items: Array<IfunctionView> }) => {
  return (
    <Droppable droppableId='BrickFlowCard'>
      {(provided, snapshot) => {
        return (
          <Box
            as='ul'
            ref={provided.innerRef}
            // {...provided.droppableProps}
            padding='4'
            boxShadow={'base'}
            minWidth={'50%'}
            minHeight='100%'
            backgroundColor='white'>
            {items.map((item, i) => {
              return (
                <Draggable key={item.name} draggableId={item.name} index={i}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}>
                      <BrickFunctionView {...item} />
                    </li>
                  )}
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

const CardHStack = ({ children }: { children?: any }) => {
  return (
    <HStack overflow='auto' flex='1' padding={5} backgroundColor='purple.50'>
      {children}
    </HStack>
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
  { name: 'length', parameterTypes: ['String'], returnType: 'Number' },
  { name: 'exclaim', parameterTypes: ['String'], returnType: 'String' },
  { name: 'upperCase', parameterTypes: ['String'], returnType: 'String' },
  { name: 'sth', parameterTypes: ['String'], returnType: 'String' },
]
const reorder = (list: any, startIndex: any, endIndex: any) => {
  const [removed] = list.splice(startIndex, 1)
  list.splice(endIndex, 0, removed)
  return list
}
let id = 0
const copy = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any,
) => {
  const item = source[droppableSource.index]
  destination.splice(droppableDestination.index, 0, { ...item, id: id++ })
  return destination
}

export const App = () => {
  const [fns, setFns] = useState(fnsInitial)
  const [flowBricks, setFlowBricks] = React.useState([])
  const onDragEnd = React.useCallback(
    result => {
      const { source, destination } = result
      console.log({ source, destination })
      if (!destination) {
        return
      }
      switch (source.droppableId) {
        case destination.droppableId:
          setFlowBricks(state =>
            reorder(state, source.index, destination.index),
          )
          break
        case 'SideBar':
          setFlowBricks(state => copy(fns, state, source, destination))
          break
        default:
          break
      }
    },
    [setFlowBricks],
  )
  return (
    <ChakraProvider theme={theme}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex height='100vh'>
          <SideBar items={fns} />
          <CardHStack>
            <BrickFlowCard items={flowBricks}></BrickFlowCard>
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
        </Flex>
      </DragDropContext>
    </ChakraProvider>
  )
}
//"calc(100vh - 3rem)"
