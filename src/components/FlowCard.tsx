import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { IsmallFunctionView, ItypeView } from './interfaces'
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
} from '@chakra-ui/react'
import {
  ArrowDownIcon,
  ArrowForwardIcon,
  DeleteIcon,
  QuestionIcon,
} from '@chakra-ui/icons'
import TypeBadge from './TypeBadge'
import { Action } from '../state'
import { Itype } from './interfaces'

const TypeAndValue = ({
  type,
  value,
  onChange,
}: {
  type: Itype
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <>
      <TypeBadge typeAsString={type.type} />
      {(() => {
        switch (type.type) {
          case 'string':
            return <Input size='sm' onChange={onChange}></Input>
          case 'number':
            return (
              <NumberInput size='sm'>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            )
          case 'boolean':
            return (
              <Checkbox isChecked={type.value}>
                {value ? 'true' : 'false'}
              </Checkbox>
            )
          default:
            return null
            break
        }
      })()}
    </>
  )
}

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
                      <TypeBadge typeAsString={param} /> <ArrowForwardIcon />
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
              <TypeBadge
                typeAsString={
                  item.parameterTypes[item.parameterTypes.length - 1]
                }
              />
            )}
            <ArrowDownIcon></ArrowDownIcon>
            <TypeBadge typeAsString={item.returnType} />
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
    <Box
      boxShadow={'base'}
      padding={1}
      minWidth={'50%'}
      minHeight='100vh'
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
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label='Explain flow card'
              icon={<QuestionIcon />}
            />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            {/* <PopoverHeader>Confirmation!</PopoverHeader> */}
            <PopoverBody>
              Flow is a special view for the flow/pipe function (left-to-right
              variadic compose). This is meant as a "functional Scratch" to
              visually explore funcion composition. Last argument and return
              type line up vertically to reinforce the pipeline metaphor. JS is
              executed and shown on the right if functions don't have
              side-effects, otherwise a 'Play' button will appear. `console.log`
              is the only effect so far.
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </HStack>
      <Divider marginTop={2}></Divider>
      <Droppable droppableId='FlowCard'>
        {(provided, snapshot) => {
          return (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              minWidth={'50%'}
              flex={1}
              minHeight='100%'
            >
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
    </Box>
  )
}

export default FlowCard
