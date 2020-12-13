import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Ifunction, Iparameter, Itype } from './interfaces'
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
  Heading,
} from '@chakra-ui/react'
import {
  ArrowDownIcon,
  ArrowForwardIcon,
  DeleteIcon,
  PlusSquareIcon,
} from '@chakra-ui/icons'
import TypeBadge from './TypeBadge'
import { Action } from '../state'
import PopoverExplanation from './PopoverExplanation'
import './flowCardStyles.css'
// import produce from 'immer'
// import EditableText from './EditableText'

const TypeAndValue = React.memo(
  ({
    type,
    value,
    onChange,
    direction,
  }: {
    type: Itype['type']
    value: any
    onChange?: (v: string | number | boolean) => void
    direction: 'row' | 'column'
  }) => {
    return (
      <Flex direction={direction}>
        <TypeBadge typeAsString={type} />
        {(() => {
          if (!onChange) {
            return (
              <Code>
                {type === 'boolean' ? (value ? 'true' : 'false') : value}
              </Code>
            )
          }
          switch (type) {
            case 'string':
              return (
                <Input
                  size='sm'
                  value={value}
                  onChange={e => {
                    onChange(e.target.value)
                  }}
                ></Input>
              )
            case 'number':
              return (
                <NumberInput
                  size='sm'
                  value={value}
                  onChange={(s, n) => {
                    if (isNaN(Number(n))) {
                      return
                    }
                    onChange(n)
                  }}
                  allowMouseWheel
                >
                  <NumberInputField />
                  {/* <NumberInputStepper> */}
                  {/* <NumberIncrementStepper /> */}
                  {/* <NumberDecrementStepper /> */}
                  {/* </NumberInputStepper> */}
                </NumberInput>
              )
            case 'boolean':
              console.log({ type, value })
              return (
                <Checkbox
                  isChecked={value}
                  onChange={e => {
                    onChange(e.target.checked)
                  }}
                >
                  {value ? 'true' : 'false'}
                </Checkbox>
              )
            default:
              return null
          }
        })()}
      </Flex>
    )
  },
)

const getParamValues = (
  items: IfunctionWithId[],
  v: string | number | boolean,
  paramIndex: number | 'last',
) => {
  let previousReturn = null
  let newItems: IfunctionWithId[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const parameters = [...item.parameters]
    if (i === 0) {
      //donde se ha producido el cambio
      const param =
        paramIndex === 'last'
          ? parameters[parameters.length - 1]
          : parameters[paramIndex]
      param.value = v
    }
    const previouslastParam: Iparameter | undefined =
      parameters[parameters.length - 1]

    if (previouslastParam) {
      parameters[parameters.length - 1] = {
        ...previouslastParam,
        value:
          previousReturn === null ? previouslastParam?.value : previousReturn,
      }
    }

    //TODO typecheck

    console.log({ parameters })
    const returnValue = item.fn(...parameters.map(p => p.value))

    newItems.push({
      ...item,
      parameters,
      returns: { ...item.returns, value: returnValue },
    })

    previousReturn = returnValue
  }

  return newItems
}

function sliceInTwo<A>(i: number, as: A[]) {
  return [as.slice(0, i), as.slice(i)]
}

const C_TypeAndValue = React.memo(
  ({
    fnId,
    direction,
    paramIndex,
    noInput = false,
  }: {
    fnId: string
    direction: 'row' | 'column'
    paramIndex: number | 'last' | 'return'
    noInput?: boolean
  }) => {
    const { fns, setFns } = React.useContext(ParameterContext)
    const { parameters, returns, id } = fns.find(({ id }) => id === fnId)!
    const param =
      paramIndex === 'return'
        ? returns
        : paramIndex === 'last'
        ? parameters[parameters.length - 1]
        : parameters[paramIndex]

    const onChange =
      noInput || paramIndex === 'return'
        ? undefined
        : (v: string | number | boolean) => {
            const [previousFns, affectedFns] = sliceInTwo(
              fns.findIndex(({ id }) => id === fnId),
              fns,
            )
            const newValues = getParamValues(affectedFns, v, paramIndex)
            console.log({ previousFns, affectedFns, newValues })
            setFns(previousFns.concat(newValues))
          }

    return (
      <TypeAndValue
        type={param.type}
        value={param.value}
        onChange={onChange}
        direction={direction}
      />
    )
  },
)

export const FlowFunctionView = React.memo(
  forwardRef(
    (
      {
        item,
        // style,
        // onChangeParam,
        isFirstFunctionInFlow,
        ...rest
      }: {
        item: Ifunction & { id: string }
        // style?: React.CSSProperties
        isFirstFunctionInFlow: boolean
        // onChangeParam: (_: {
        //   paramValue: string | number | boolean
        //   paramIndex: number
        // }) => void
      },
      ref,
    ) => {
      const hasZeroParams = item.parameters.length === 0
      const hasOneParam = item.parameters.length === 1
      return (
        <Flex
          {...rest}
          ref={ref}
          // style={style}
          // flexBasis={0}
          // minWidth={0}
          // marginY={3}
          // wrap='nowrap'
          // justifyContent='space-between'
          border='2px solid red'
          rounded='base'
          marginBottom={1}
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
              : item.parameters
                  .slice(0, item.parameters.length - 1)
                  .map((param, i) => {
                    const css =
                      i === item.parameters.length - 2
                        ? { transform: 'rotate(-45deg)' }
                        : null
                    return (
                      <HStack flex={1} key={i}>
                        <C_TypeAndValue
                          // type={param.type}
                          // onChange={paramValue => {
                          //   onChangeParam({ paramValue, paramIndex: i })
                          // }}
                          // value={param.value}
                          fnId={item.id}
                          paramIndex={i}
                          direction='column'
                        />{' '}
                        <ArrowForwardIcon css={css} />
                      </HStack>
                    )
                  })}
          </Flex>

          <Flex paddingY={1}>
            {/* Last param, return type */}
            <VStack>
              {hasZeroParams ? (
                <Code>()</Code>
              ) : (
                <C_TypeAndValue
                  // onChange={paramValue => {
                  //   onChangeParam({
                  //     paramValue,
                  //     paramIndex: item.parameters.length - 1,
                  //   })
                  // }}
                  // value={item.parameters[item.parameters.length - 1].value}
                  fnId={item.id}
                  paramIndex='last'
                  direction='row'
                  noInput={!isFirstFunctionInFlow}
                  // type={item.parameters[item.parameters.length - 1].type}
                />
              )}
              <ArrowDownIcon></ArrowDownIcon>
              <C_TypeAndValue
                fnId={item.id}
                // type={item.returns.type}
                // onChange={() => {}} //TODO disable
                noInput
                paramIndex='return'
                // value={item.returns.value}
                direction='row'
              />
            </VStack>
            {/* <Box>{'some example value and more stuff'}</Box> */}
          </Flex>
        </Flex>
      )
    },
  ),
)

const getFnsValuesFromItems = (
  items: Array<IfunctionWithId>,
  previousItems: Array<IfunctionWithId> = [],
) => {
  let previousReturn = null
  let newItems: IfunctionWithId[] = []

  for (let i = 0; i < items.length; i++) {
    const item = previousItems.find(pi => pi.id === items[i].id) ?? items[i]
    const parameters = [...item.parameters]
    const previouslastParam: Iparameter | undefined =
      parameters[parameters.length - 1]
    if (previouslastParam) {
      parameters[parameters.length - 1] = {
        ...previouslastParam,
        value:
          previousReturn === null ? previouslastParam?.value : previousReturn,
      }
    }

    //TODO typecheck
    const returnValue = item.fn(...parameters.map(p => p.value))

    newItems.push({
      ...item,
      parameters,
      returns: { ...item.returns, value: returnValue },
    })

    previousReturn = returnValue
  }

  return newItems
}

const ParameterContext = React.createContext<{
  fns: Array<IfunctionWithId>
  setFns: React.Dispatch<React.SetStateAction<IfunctionWithId[]>>
}>({ fns: [], setFns() {} })

type IfunctionWithId = Ifunction & { id: string }

const FlowFunctionsList = React.memo(
  ({ items }: { items: Array<IfunctionWithId> }) => {
    const [fns, setFns] = React.useState(getFnsValuesFromItems(items))
    const [previousItems, setPreviousItems] = React.useState(items)
    if (previousItems !== items) {
      setPreviousItems(items)
      setFns(previousValues => getFnsValuesFromItems(items, previousValues))
    }

    //Recoil?
    //items deberia venir sin parameter values - se calculan en el setState o en el render? en el setState
    // que pasa cuando viene una fn nueva?
    // can FlowFunctionView never reupdate after initial render? not rerender if isFiFIFlow changes

    return (
      <ParameterContext.Provider value={{ fns, setFns }}>
        {items.map((item, i) => {
          return (
            <Draggable key={item.id} draggableId={item.id} index={i}>
              {(provided, snapshot) => {
                return (
                  <FlowFunctionView
                    isFirstFunctionInFlow={i === 0}
                    item={item}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    // style={provided.draggableProps.style}
                  />
                )
              }}
            </Draggable>
          )
        })}
      </ParameterContext.Provider>
    )
  },
)

const FlowCard = React.memo(
  ({
    items,
    name,
    dispatch,
  }: {
    items: Array<Ifunction & { id: string }>
    name: string
    dispatch: React.Dispatch<Action>
  }) => {
    return (
      <Box
        boxShadow={'base'}
        padding={1}
        minWidth={'50%'}
        minHeight='100vh'
        height='100%'
        position='relative'
        backgroundColor='white'
        display='flex'
        flexDirection='column'
      >
        <Flex paddingLeft={2} alignItems='center'>
          <Heading fontSize='xl' fontStyle='italic' color='unison.purple'>
            Flow
          </Heading>
          <Spacer></Spacer>
          {items.length > 0 && (
            <Button
              color='unison.darkPink'
              sx={{ '&:hover': { backgroundColor: 'red.50' } }}
              variant='ghost'
              leftIcon={<DeleteIcon />}
              onClick={() => {
                dispatch({ type: 'clearFlowCard' })
              }}
            >
              Clear
            </Button>
          )}
          <PopoverExplanation label='Flow card explanation' title='Flow card'>
            Flow is a special view for the flow/pipe function (left-to-right
            variadic compose). This is meant as a "functional Scratch" to
            visually explore function composition. Last argument and return type
            line up vertically to reinforce the pipeline metaphor. JS is
            executed and shown on the right if functions don't have
            side-effects, otherwise a 'Play' button will appear. `console.log`
            is the only effect so far. Note that functions need to be curried
            manually.
          </PopoverExplanation>
        </Flex>
        <Divider marginTop={2}></Divider>
        <Droppable droppableId='FlowCard'>
          {(provided, snapshot) => {
            return (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                // minWidth={'50%'}
                flex={1}
                minHeight='100%'
                height='100%'
                overflow='auto'
                paddingX={2}
                paddingY={4}
              >
                <FlowFunctionsList items={items}></FlowFunctionsList>
                {provided.placeholder}
              </Box>
            )
          }}
        </Droppable>
      </Box>
    )
  },
)

export default FlowCard
