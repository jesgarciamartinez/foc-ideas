import produce from 'immer'
import * as React from 'react'
import { v4 as uuid } from 'uuid'
import { Ifunction, Ieffect, Itype } from './components/interfaces'
import DocsCard from './components/DocsCard/DocsCard'

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
    parameters: [{ type: 'string' }],
    returns: { type: 'number' },
    fn: function length(s: any) {
      return s.length
    },
    description: 'Takes a string and returns how many characters it has',
  },
  {
    name: 'upperCase',
    parameters: [{ type: 'string' }],
    returns: { type: 'string' },
    fn: function (s: any) {
      return s.toUpperCase()
    },
    description:
      'Takes a string and returns is with all characters in uppercase',
  },
  {
    name: 'add',
    parameters: [{ type: 'number' }, { type: 'number' }],
    returns: { type: 'number' },
    fn: function add(x: any, y: any) {
      return x + y
    },
    description: 'Adds two numbers together',
  },
  // {
  //   name: 'map',
  //   parameters: [
  //     { type: 'function', parameterName: 'f' },
  //     { type: 'array', of: { typeParam: 'A' }, parameterName: 'as' },
  //   ],
  //   returns: { type: 'array', of: { typeParam: 'B' } },
  //   code: 'function map(f,as){return as.map(f)}',
  //   description: 'Applies a function to each element of an array',
  // },
  {
    name: 'id',
    parameters: [{ type: 'string' }],
    returns: { type: 'string' },
    fn: function id(s: any) {
      return s
    },
    description: 'monomorphic id for string',
  },
  {
    name: 'greaterThan',
    parameters: [{ type: 'number' }, { type: 'number' }],
    returns: { type: 'boolean' },
    fn: function greaterThan(n: number, m: number) {
      return m > n
    },
    description: 'Number is greater than another',
  },
]
const initialDataTypes: Array<Itype> = [
  { type: 'string' },
  { type: 'number' },
  { type: 'boolean' },
]
const initialEffects: Array<Ieffect> = []

export type Action =
  | { type: 'isDragging' }
  | { type: 'createFunction'; function: Ifunction; index: number }
  | { type: 'dropOutside' }
  | { type: 'dropFnFromSideBarOnFlowCard'; index: number; draggableId: string }
  | {
      type: 'dropFnFromFlowCardToFlowCard'
      sourceIndex: number
      destinationIndex: number
    }
  | { type: 'clearFlowCard' }
  | { type: 'sideBarSearch'; value: string }
  | { type: 'dropFnFromSideBarToDocsCard'; draggableId: string }
  | { type: 'openDocs'; fnName: string }
  | { type: 'closeDocsCard'; index: number }
  | { type: 'clearDocsCard'; index: number }
  | { type: 'newDocsCard' }
// | {
//     type: 'changeFunctionParamValue'
//     paramValue: string | number | boolean
//     paramIndex: number
//     functionId: string
//   }

type DocsType = { type: 'creating' } | { type: 'editing'; fnName: string }

type State = {
  functions: Ifunction[]
  dataTypes: Itype[]
  effects: Ieffect[]
  isSideBarItemDragging: boolean
  flowCardFunctions: Array<Ifunction & { id: string }>
  docCards: Array<DocsType>
  searchValue: string
}

const initialState: State = {
  functions: initialFunctions,
  dataTypes: initialDataTypes,
  effects: initialEffects,
  isSideBarItemDragging: false,
  flowCardFunctions: [],
  docCards: [{ type: 'creating' }],
  searchValue: '',
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

const changeAtIndex = <A>(list: Array<A>, index: number, item: A) => {
  const listCopy = [...list]
  listCopy.splice(index, 1, item)
  return listCopy
}

const getDefaultValue = (p: Itype) => {
  return p.type === 'string'
    ? ''
    : p.type === 'number'
    ? 0
    : p.type === 'boolean'
    ? false
    : p.type === 'object'
    ? ''
    : p.type === 'undefined'
    ? undefined
    : p.type === 'null'
    ? undefined
    : ''
}
const findFunction = ({
  state,
  name,
  id,
}: {
  state: State
  name: string
  id: string
}) => {
  const fn = state.functions.find(f => f.name === name) as Ifunction
  const parameters = fn.parameters.map(p => {
    const value = getDefaultValue(p)
    return {
      ...p,
      value,
    }
  })
  const returns = { ...fn.returns, value: getDefaultValue(fn.returns) }
  return { ...fn, parameters, returns, id }
}

// return {
//   ...state,
//   isSideBarItemDragging: false,
//   flowCardFunctions: insert(state.flowCardFunctions, action.index, {
//     name: action.draggableId.split('_')[1],
//     id: uuid(),
//   }),
// }

// export const fnSelector = (state: State) => ({
//   name,
//   id,
// }: {
//   name: string
//   id: string
// }) => {
//   const fn = state.functions.find(f => f.name === name) as Ifunction
//   return { ...fn, id }
// }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'isDragging':
      return { ...state, isSideBarItemDragging: true }
    case 'createFunction':
      const fnIndex = state.functions.findIndex(
        f => f.name === action.function.name,
      )
      return fnIndex === -1
        ? {
            ...state,
            functions: state.functions.concat(action.function),
            docCards: changeAtIndex(state.docCards, action.index, {
              type: 'editing',
              fnName: action.function.name,
            }),
          }
        : {
            ...state,
            functions: changeAtIndex(state.functions, fnIndex, action.function),
          }
    case 'dropOutside':
      return { ...state, isSideBarItemDragging: false }
    case 'dropFnFromSideBarOnFlowCard':
      return {
        ...state,
        isSideBarItemDragging: false,
        flowCardFunctions: insert(
          state.flowCardFunctions,
          action.index,
          findFunction({
            state,
            name: action.draggableId.split('_')[1],
            id: uuid(),
          }),
        ),
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
    case 'clearFlowCard':
      return {
        ...state,
        flowCardFunctions: [],
      }
    case 'sideBarSearch':
      return {
        ...state,
        searchValue: action.value,
      }
    case 'dropFnFromSideBarToDocsCard':
      return {
        ...state,
        docCards: [
          { type: 'editing', fnName: action.draggableId.split('_')[1] },
        ],
      }
    case 'openDocs':
      const fn = state.functions.find(f => f.name === action.fnName)
      if (!fn) {
        return state
      }
      return {
        ...state,
        docCards: [{ type: 'editing', fnName: action.fnName }],
      }
    // const fn = state.functions.find(f => f.name === action.fnName)
    // const alreadyInDocCards = state.docCards.find(d =>
    //   'fnName' in d ? d.fnName === action.fnName : false,
    // )

    // if (!fn || alreadyInDocCards) {
    //   return state
    // }
    // return {
    //   ...state,
    //   docCards: [
    //     ...state.docCards,
    //     { type: 'editing', fnName: action.fnName },
    //   ],
    // }
    case 'closeDocsCard':
      return {
        ...state,
        docCards: state.docCards.filter((_, i) => i !== action.index),
      }
    case 'clearDocsCard':
      return {
        ...state,
        docCards: changeAtIndex(state.docCards, action.index, {
          type: 'creating',
        }),
      }
    case 'newDocsCard':
      return {
        ...state,
        docCards: [{ type: 'creating' }],
      }
  }
}

export const useAppReducer =
  process.env.NODE_ENV === 'development'
    ? () => useLoggerReducer(reducer, initialState)
    : () => React.useReducer(reducer, initialState)
