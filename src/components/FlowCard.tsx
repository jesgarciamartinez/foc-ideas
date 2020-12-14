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
  Grid,
  GridItem,
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
      <Flex direction={direction} justifyContent='center' alignItems='center'>
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
                  variant='outline'
                  backgroundColor='white'
                  focusBorderColor={'unison.aqua'}
                  rounded='base'
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
                  variant='outline'
                  backgroundColor='white'
                  focusBorderColor={'unison.aqua'}
                  rounded='base'
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
    let returnValue
    try {
      returnValue = item.fn(...parameters.map(p => p.value))
    } catch (error) {
      console.log({ error })
      break
    }
    console.log('break')

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
        <Grid
          {...rest}
          ref={ref}
          backgroundColor='gray.200' //TODO
          rounded='md'
          marginBottom={1}
          padding={1}
          templateColumns='auto 25%'
          width='100%'
          gap={1}
        >
          <GridItem
            width='100%'
            display='flex'
            flexDirection='row'
            alignItems='center'
          >
            <Code justifySelf='flex-start' backgroundColor='transparent'>
              {item.name}
            </Code>

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
                      <HStack
                        justifySelf='flex-end'
                        width='100%'
                        display='flex'
                        alignItems='center'
                        justifyContent='flex-end'
                        key={i}
                      >
                        <C_TypeAndValue
                          fnId={item.id}
                          paramIndex={i}
                          direction='column'
                        />{' '}
                        <ArrowForwardIcon css={css} />
                      </HStack>
                    )
                  })}
          </GridItem>
          <GridItem width='100%'>
            <VStack>
              {hasZeroParams ? (
                <Code>()</Code>
              ) : (
                <C_TypeAndValue
                  fnId={item.id}
                  paramIndex='last'
                  direction='column'
                  noInput={!isFirstFunctionInFlow}
                />
              )}
              <ArrowDownIcon></ArrowDownIcon>
              <C_TypeAndValue
                fnId={item.id}
                noInput
                paramIndex='return'
                direction='column'
              />
            </VStack>
          </GridItem>
        </Grid>
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

    //TODO typecheck, show error
    console.log({ parameters })
    let returnValue
    let error
    try {
      returnValue = item.fn(...parameters.map(p => p.value))
    } catch (err) {
      error = err
      console.log({ error })
    }

    console.log('break')

    //TODO only push if no error
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
            Flow is a special view for the flow function (left-to-right variadic
            compose). This is a stab at a "functional Scratch" to visually
            explore function composition. Last argument and return type line up
            vertically to reinforce the pipeline metaphor. JavaScript is
            executed and shown on the right if functions don't have
            side-effects, otherwise a 'Play' button will appear.
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
