import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Box } from '@chakra-ui/react'
import type { IfunctionView } from './interfaces'
import { HStack, Code, Badge, Text } from '@chakra-ui/react'
import './cloneStyles.css'

import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
})

export default function FileSystemNavigator() {
  const classes = useStyles()

  return (
    <TreeView
      aria-label='Functions and types'
      className={classes.root}
      defaultCollapseIcon={<ChevronDownIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId='1' label='Functions'>
        <StyledTreeItem
          nodeId='2'
          name='length'
          parameterTypes={['String', 'String', 'String', 'String']}
          returnType='Number'
        ></StyledTreeItem>
      </TreeItem>
      <TreeItem nodeId='5' label='Types'>
        <TreeItem nodeId='10' label='OSS' />
        <TreeItem nodeId='6' label='Material-UI'>
          <TreeItem nodeId='7' label='src'>
            <TreeItem nodeId='8' label='index.js' />
            <TreeItem nodeId='9' label='tree-view.js' />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </TreeView>
  )
}
const getRenderItem = (props: IfunctionView) => (
  provided: any,
  snapshot: any,
  rubric: any,
) => {
  return (
    <ul
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
    >
      <Text wrap='nowrap'>
        <Code /*backgroundColor='white'*/>{props.name}</Code>
        <Text as='span'>:</Text>
        <Text as={'span'} flexWrap='nowrap'>
          {props.parameterTypes.map((p, i) => (
            <Text as='span' key={i}>
              <Badge>{p}</Badge> <Text as='span'> →</Text>
            </Text>
          ))}
        </Text>
        <Text as='span'>
          <Badge>{props.returnType}</Badge>
        </Text>
      </Text>
    </ul>
  )
}

const StyledTreeItem = (props: IfunctionView & { nodeId: string }) => {
  return (
    <TreeItem
      nodeId={props.nodeId}
      label={
        <Droppable
          droppableId={props.nodeId}
          renderClone={getRenderItem(props)}
          isDropDisabled={true}
        >
          {(provided, snapshot) => {
            const shouldRenderClone =
              props.nodeId === snapshot.draggingFromThisWith
            return (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderClone ? (
                  <li className='react-beautiful-dnd-copy'>
                    <Text wrap='nowrap'>
                      <Code /*backgroundColor='white'*/>{props.name}</Code>
                      <Text as='span'>:</Text>
                      <Text as={'span'} flexWrap='nowrap'>
                        {props.parameterTypes.map((p, i) => (
                          <Text as='span' key={i}>
                            <Badge>{p}</Badge> <Text as='span'> →</Text>
                          </Text>
                        ))}
                      </Text>
                      <Text as='span'>
                        <Badge>{props.returnType}</Badge>
                      </Text>
                    </Text>
                  </li>
                ) : (
                  <Draggable draggableId={props.nodeId} index={0}>
                    {(provided, snapshot) => {
                      return (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Text wrap='nowrap'>
                            <Code /*backgroundColor='white'*/>
                              {props.name}
                            </Code>
                            <Text as='span'>:</Text>
                            <Text as={'span'} flexWrap='nowrap'>
                              {props.parameterTypes.map((p, i) => (
                                <Text as='span' key={i}>
                                  <Badge>{p}</Badge> <Text as='span'> →</Text>
                                </Text>
                              ))}
                            </Text>
                            <Text as='span'>
                              <Badge>{props.returnType}</Badge>
                            </Text>
                          </Text>
                        </li>
                      )
                    }}
                  </Draggable>
                )}
              </ul>
            )
          }}
        </Droppable>
      }
    ></TreeItem>
  )
}

// export default SideBar

// return (
//   <React.Fragment key={i}>
//     {shouldRenderClone ? (
//       <li className='react-beautiful-dnd-copy'>
//         <HStack
//           padding={1}
//           borderWidth='1px'
//           backgroundColor={'gray.400'}>
//           <Code backgroundColor='white'>{props.name}</Code>
//           <Text as='span'>:</Text>
//           <Text as={'span'}>
//             {props.parameterTypes.map((p, i) => (
//               <Text as='span' key={i}>
//                 <Badge>{p}</Badge> <Text as='span'> →</Text>
//               </Text>
//             ))}
//           </Text>
//           <Text as='span'>
//             <Badge>{props.returnType}</Badge>
//           </Text>
//         </HStack>
//       </li>
//     ) : (
//       <Draggable draggableId={props.name} index={i}>
//         {(provided, snapshot) => (
//           <li
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}>
//             <HStack
//               padding={1}
//               borderWidth='1px'
//               backgroundColor={'white'}>
//               <Code backgroundColor='white'>{props.name}</Code>
//               <Text as='span'>:</Text>
//               <Text as={'span'}>
//                 {props.parameterTypes.map((p, i) => (
//                   <Text as='span' key={i}>
//                     <Badge>{p}</Badge> <Text as='span'> →</Text>
//                   </Text>
//                 ))}
//               </Text>
//               <Text as='span'>
//                 <Badge>{props.returnType}</Badge>
//               </Text>
//             </HStack>
//           </li>
//         )}
//       </Draggable>
//     )}
//   </React.Fragment>
