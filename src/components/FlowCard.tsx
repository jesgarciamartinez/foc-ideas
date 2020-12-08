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
  Button,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Text,
} from '@chakra-ui/react'
import {
  ArrowDownIcon,
  ArrowForwardIcon,
  DeleteIcon,
  PlusSquareIcon,
  QuestionIcon,
} from '@chakra-ui/icons'
import TypeBadge from './TypeBadge'
import { Action } from '../state'
import { Itype } from './interfaces'
import PopoverExplanation from './PopoverExplanation'
import EditableText from './EditableText'

const TypeAndValue = ({
  type,
  value,
  onChange,
  direction,
}: {
  type: Itype['type']
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  direction: 'row' | 'column'
}) => {
  return (
    <Flex direction={direction}>
      <TypeBadge typeAsString={type} />
      {(() => {
        switch (type) {
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
              <Checkbox /*isChecked={type.value}*/>
                {value ? 'true' : 'false'}
              </Checkbox>
            )
          default:
            return null
            break
        }
      })()}
    </Flex>
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
                  const css =
                    i === item.parameterTypes.length - 2
                      ? { transform: 'rotate(-45deg)' }
                      : null
                  return (
                    <HStack flex={1}>
                      <TypeAndValue
                        type={param}
                        onChange={() => {}}
                        value=''
                        direction='column'
                      />{' '}
                      <ArrowForwardIcon css={css} />
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
              <TypeAndValue
                onChange={() => {}}
                value=''
                direction='row'
                type={item.parameterTypes[item.parameterTypes.length - 1]}
              />
            )}
            <ArrowDownIcon></ArrowDownIcon>
            <TypeAndValue
              type={item.returnType}
              onChange={() => {}}
              value=''
              direction='row'
            />
          </VStack>
          {/* <Box>{'some example value and more stuff'}</Box> */}
        </Flex>
      </Flex>
    )
  },
)
const defaultName = 'name'
const FlowCard = ({
  items,
  name,
  dispatch,
}: {
  items: Array<IsmallFunctionView & { id: string }>
  name: string
  dispatch: React.Dispatch<Action>
}) => {
  const nameFontStyle = [defaultName, ''].includes(name) ? 'italic' : 'normal'
  const nameColor = [defaultName, ''].includes(name) ? 'gray.400' : 'normal'

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
        {/* <EditableText
          value={name}
          onChange={() => {}}
          placeholder={defaultName}
          fontSize='3xl'
          textColor={nameColor}
          fontStyle={nameFontStyle}
          width='50%'
        /> */}
        <Text fontSize='xl'>Flow Card</Text>
        <Button
          leftIcon={<DeleteIcon />}
          onClick={() => dispatch({ type: 'clearFlowCard' })}
        >
          Clear
        </Button>
        <Button
          leftIcon={<PlusSquareIcon />}
          onClick={() => dispatch({ type: 'clearFlowCard' })}
        >
          Create function
        </Button>
        <PopoverExplanation label='Flow card explanation' title='Flow card'>
          Flow is a special view for the flow/pipe function (left-to-right
          variadic compose). This is meant as a "functional Scratch" to visually
          explore function composition. Last argument and return type line up
          vertically to reinforce the pipeline metaphor. JS is executed and
          shown on the right if functions don't have side-effects, otherwise a
          'Play' button will appear. `console.log` is the only effect so far.
          Note that functions need to be curried manually.
        </PopoverExplanation>
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
