import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { IsmallFunctionView } from './interfaces'
import {
  Box,
  Flex,
  Center,
  Spacer,
  Code,
  HStack,
  VStack,
  forwardRef,
  Divider,
  IconButton,
  Button,
} from '@chakra-ui/react'
import { ArrowDownIcon, ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons'
import TypeBadge from './TypeBadge'
import { Action } from '../state'

export const FlowFunctionView = forwardRef(
  (
    {
      item,
      style,
      ...rest
    }: { item: IsmallFunctionView; style?: React.CSSProperties },
    ref,
  ) => {
    const hasZeroParams = item.parameterTypes.length === 0
    const hasOneParam = item.parameterTypes.length === 1
    return (
      <Flex
        {...rest}
        ref={ref}
        style={style}
        flexBasis={0}
        minWidth={0}
        marginY={3}
        wrap='nowrap'
      >
        <Flex flex={1} minWidth={0}>
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
                      <TypeBadge>{param}</TypeBadge> <ArrowForwardIcon />
                    </HStack>
                  )
                })}
        </Flex>

        <Flex paddingY={1}>
          {/* Last param, Return type, example */}
          <VStack>
            {hasZeroParams ? (
              <Code>()</Code>
            ) : (
              <TypeBadge>
                {item.parameterTypes[item.parameterTypes.length - 1]}
              </TypeBadge>
            )}
            <ArrowDownIcon></ArrowDownIcon>
            <TypeBadge>{item.returnType}</TypeBadge>
          </VStack>
          <Box>{'some example value and more stuff'}</Box>
        </Flex>
      </Flex>
    )
  },
)

const FlowCard = ({
  items,
  dispatch,
}: {
  items: Array<IsmallFunctionView & { id: string }>
  dispatch: React.Dispatch<Action>
}) => {
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
            <HStack>
              <Code fontSize='xl'>Flow</Code>
              <Button
                leftIcon={<DeleteIcon />}
                onClick={() => dispatch({ type: 'clearFlowCard' })}
              >
                Clear
              </Button>
            </HStack>
            <Divider marginTop={2}></Divider>
            {items.map((item, i) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={i}>
                  {(provided, snapshot) => {
                    return (
                      <FlowFunctionView
                        item={item}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      />
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
