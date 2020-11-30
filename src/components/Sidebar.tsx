import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Box } from '@chakra-ui/react'
import type { IfunctionView } from './interfaces'
import { HStack, Code, Badge, Text } from '@chakra-ui/react'
import './cloneStyles.css'

const getRenderItem = (items: Array<IfunctionView>) => (
  provided: any,
  snapshot: any,
  rubric: any,
) => {
  const { name, returnType, parameterTypes } = items[rubric.source.index]
  return (
    <React.Fragment>
      <li
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        style={provided.draggableProps.style}>
        <HStack padding={1} borderWidth='1px' backgroundColor={'gray.400'}>
          <Code backgroundColor='white'>{name}</Code>
          <Text as='span'>:</Text>
          <Text as={'span'}>
            {parameterTypes.map((p, i) => (
              <Text as='span' key={i}>
                <Badge>{p}</Badge> <Text as='span'> →</Text>
              </Text>
            ))}
          </Text>
          <Text as='span'>
            <Badge>{returnType}</Badge>
          </Text>
        </HStack>
      </li>
    </React.Fragment>
  )
}

const SideBar = ({ items }: { items: Array<IfunctionView> }) => {
  return (
    <Droppable
      droppableId='SideBar'
      renderClone={getRenderItem(items)}
      isDropDisabled={true}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          as='ul'
          height={'100%'}
          boxShadow='xl'
          // zIndex={20000} //@TODO
          padding={5}
          backgroundColor={'purple.900'}
          margin={0}
          overflowY='hidden'
          // maxWidth={'15rem'}
          // resize='horizontal'
          // overflowY='auto'
          // maxH={height}
          // overflowX='visible'
          // flex='0 0 14rem'
          // width='35rem'
        >
          {items.map((props, i) => {
            // console.log('snapshot', snapshot)
            const shouldRenderClone =
              props.name === snapshot.draggingFromThisWith
            return (
              <React.Fragment key={i}>
                {shouldRenderClone ? (
                  <li className='react-beautiful-dnd-copy'>
                    <HStack
                      padding={1}
                      borderWidth='1px'
                      backgroundColor={'gray.400'}>
                      <Code backgroundColor='white'>{props.name}</Code>
                      <Text as='span'>:</Text>
                      <Text as={'span'}>
                        {props.parameterTypes.map((p, i) => (
                          <Text as='span' key={i}>
                            <Badge>{p}</Badge> <Text as='span'> →</Text>
                          </Text>
                        ))}
                      </Text>
                      <Text as='span'>
                        <Badge>{props.returnType}</Badge>
                      </Text>
                    </HStack>
                  </li>
                ) : (
                  <Draggable draggableId={props.name} index={i}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <HStack
                          padding={1}
                          borderWidth='1px'
                          backgroundColor={'white'}>
                          <Code backgroundColor='white'>{props.name}</Code>
                          <Text as='span'>:</Text>
                          <Text as={'span'}>
                            {props.parameterTypes.map((p, i) => (
                              <Text as='span' key={i}>
                                <Badge>{p}</Badge> <Text as='span'> →</Text>
                              </Text>
                            ))}
                          </Text>
                          <Text as='span'>
                            <Badge>{props.returnType}</Badge>
                          </Text>
                        </HStack>
                      </li>
                    )}
                  </Draggable>
                )}
              </React.Fragment>
            )
          })}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  )
}

export default SideBar
