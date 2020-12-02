import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IsmallFunctionView } from './interfaces'
import {
  Box,
  Flex,
  Center,
  Spacer,
  Code,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import TypeBadge from './TypeBadge'

const FlowCard = ({
  items,
}: {
  items: Array<IsmallFunctionView & { id: string }>
}) => {
  console.log({ items })
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
            display='flex'
            flexDirection='column'
          >
            {items.map((item, i) => {
              const isIndexEven = i % 2 === 0
              return (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(provided, snapshot) => {
                    const hasZeroParams = item.parameterTypes.length === 0
                    const hasOneParam = item.parameterTypes.length === 1
                    return (
                      <Flex
                        flexBasis={0}
                        minWidth={0}
                        marginY={1}
                        // backgroundColor={isIndexEven ? 'teal.50' : 'gray.100'}
                        wrap='nowrap'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >
                        <Flex flex={1} minWidth={0}>
                          {' '}
                          {/*name and params*/}
                          <Center
                            flex={1}
                            whiteSpace='nowrap'
                            overflow='hidden'
                            textOverflow='ellipsis'
                          >
                            <Code>{item.name}</Code>
                          </Center>
                          <Spacer></Spacer>
                          {hasZeroParams || hasOneParam
                            ? null
                            : item.parameterTypes
                                .slice(0, item.parameterTypes.length - 1)
                                .map((param, i) => {
                                  return (
                                    <HStack flex={1}>
                                      <TypeBadge>{param}</TypeBadge>{' '}
                                      <ArrowForwardIcon />
                                    </HStack>
                                  )
                                })}
                        </Flex>

                        <Flex paddingY={1}>
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

export default FlowCard
