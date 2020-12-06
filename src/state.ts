import * as React from 'react'
import { v4 as uuid } from 'uuid'
import { Ifunction, IsmallFunctionView } from './components/interfaces'

type Reducer<A, B> = (a: A, b: B) => A

/* See https://github.com/jefflombard/use-reducer-logger */
const getCurrentTimeFormatted = () => {
  const currentTime = new Date()
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()
  const milliseconds = currentTime.getMilliseconds()
  return `${hours}:${minutes}:${seconds}.${milliseconds}`
}
const useLoggerReducer = <A, B extends { type: string | number }>(
  reducer: Reducer<A, B>,
  initialState: A,
) => {
  const reducerWithLogger = React.useCallback(
    (state: A, action: B): A => {
      const next = reducer(state, action)
      console.group(
        `%cAction: %c${action.type} %cat ${getCurrentTimeFormatted()}`,
        'color: lightgreen; font-weight: bold;',
        'color: white; font-weight: bold;',
        'color: lightblue; font-weight: lighter;',
      )
      console.log(
        '%cPrevious State:',
        'color: #9E9E9E; font-weight: 700;',
        state,
      )
      console.log('%cAction:', 'color: #00A7F7; font-weight: 700;', action)
      console.log('%cNext State:', 'color: #47B04B; font-weight: 700;', next)
      console.groupEnd()
      return next
    },
    [reducer],
  )

  return React.useReducer(reducerWithLogger, initialState)
}

const initialFunctions: Array<Ifunction> = [
  {
    name: 'length',
    parameterTypes: ['string'],
    returnType: 'number',
    code: 'function length(s){return s.length}',
    description: 'Takes a string and returns how many characters it has',
  },
  {
    name: 'upperCase',
    parameterTypes: ['string'],
    returnType: 'string',
    code: 'function(s){s.toUppercase()}',
    description:
      'Takes a string and returns is with all characters in uppercase',
  },
]

export type Action =
  | { type: 'isDragging' }
  | { type: 'createFunction'; function: Ifunction }
  | { type: 'dropOutside' }
  | { type: 'dropFnFromSideBarOnFlowCard'; index: number; draggableId: string }
  | {
      type: 'dropFnFromFlowCardToFlowCard'
      sourceIndex: number
      destinationIndex: number
    }

type State = {
  functions: Ifunction[]
  isSideBarItemDragging: boolean
  flowCardFunctions: Array<{ name: string; id: string }>
}

const initialState: State = {
  functions: initialFunctions,
  isSideBarItemDragging: false,
  flowCardFunctions: [],
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const listCopy = [...list]
  const [removed] = listCopy.splice(startIndex, 1)
  listCopy.splice(endIndex, 0, removed)
  return listCopy
}
const insert = <A>(list: Array<A>, index: number, item: A) => {
  const listCopy = [...list]
  listCopy.splice(index, 0, item)
  return listCopy
}

function reducer(state: State, action: Action): State {
  let flowCardFunctions
  switch (action.type) {
    case 'isDragging':
      return { ...state, isSideBarItemDragging: true }
    case 'createFunction':
      return { ...state, functions: state.functions.concat(action.function) }
    case 'dropOutside':
      return { ...state, isSideBarItemDragging: false }
    case 'dropFnFromSideBarOnFlowCard':
      return {
        ...state,
        isSideBarItemDragging: false,
        flowCardFunctions: insert(state.flowCardFunctions, action.index, {
          name: action.draggableId.split('_')[1],
          id: uuid(),
        }),
      }
    case 'dropFnFromFlowCardToFlowCard':
      return {
        ...state,
        isSideBarItemDragging: false,
        flowCardFunctions: reorder(
          state.flowCardFunctions,
          action.sourceIndex,
          action.destinationIndex,
        ),
      }
  }
}

export const useAppReducer =
  process.env.NODE_ENV === 'development'
    ? () => useLoggerReducer(reducer, initialState)
    : () => React.useReducer(reducer, initialState)

export const fnSelector = (state: State) => ({
  name,
  id,
}: {
  name: string
  id: string
}) => {
  const fn = state.functions.find(f => f.name === name) as Ifunction
  return { ...fn, id }
}
