import * as React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  Box,
  Button,
  Center,
  ScaleFade,
  useTheme,
  useToken,
} from '@chakra-ui/react'
import SideBar from './components/Sidebar'
import CardHStack from './components/CardHStack'
import SplitPane from 'react-split-pane'
import FlowCard from './components/FlowCard'
import { StateContext, useAppReducer } from './state'
import DocsCard from './components/DocsCard/DocsCard'
import { matchSorter } from 'match-sorter'
import './styles.css'
import { HotKeys } from 'react-hotkeys'
import { AddIcon } from '@chakra-ui/icons'

export const App = () => {
  const [state, dispatch] = useAppReducer()
  const onDragEnd = React.useCallback(
    dropResult => {
      if (
        //SideBar to FlowCard
        dropResult.source.droppableId !== 'FlowCard' &&
        dropResult.destination?.droppableId === 'FlowCard'
      ) {
        dispatch({
          type: 'dropFnFromSideBarOnFlowCard',
          index: dropResult.destination.index,
          draggableId: dropResult.draggableId,
        })
      } else if (
        // FlowCard to FlowCard
        dropResult.source.droppableId === 'FlowCard' &&
        dropResult.destination?.droppableId === 'FlowCard'
      ) {
        dispatch({
          type: 'dropFnFromFlowCardToFlowCard',
          sourceIndex: dropResult.source.index,
          destinationIndex: dropResult.destination.index,
        })
      } else if (dropResult.destination?.droppableId === 'DocsCard') {
        dispatch({
          type: 'dropFnFromSideBarToDocsCard',
          draggableId: dropResult.draggableId,
        })
      } else {
        dispatch({ type: 'dropOutside' })

        //Regain focus after dropping outside - TODO does not work if dragged and esc pressed
        const li: any = document.querySelector(
          `[id$='${dropResult.draggableId}']`,
        )
        if (li) {
          li.focus()
        }
      }
    },
    [dispatch],
  )
  const sideBarRef = React.useRef()
  const purple = useToken('colors', 'unison.purple')

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <HotKeys //TODO substitute for mousetrap + useEffect
        keyMap={{ focusSidebar: ['ctrl+b', 'command+b'] }} //TODO parameterize
        handlers={{
          focusSidebar() {
            let a = sideBarRef as any
            a.current.focus()
          },
        }}
      >
        <DragDropContext
          onDragStart={() => {
            dispatch({ type: 'isDragging' })
          }}
          onDragEnd={onDragEnd}
        >
          <SplitPane
            style={{
              // overflow: 'auto',
              height: '100vh',
              borderTop: `6px solid ${purple}`,
            }}
            defaultSize='20%'
            minSize={100}
            maxSize={-300}
            split='vertical'
            pane2Style={{
              overflowX: 'auto',
              // overflow: 'auto',
            }}
          >
            <SideBar
              ref={sideBarRef}
              searchValue={state.searchValue}
              dispatch={dispatch}
              isAnyItemDragging={state.isSideBarItemDragging}
              items={[
                {
                  nodeId: 'functions',
                  label: 'Functions',
                  items: matchSorter(state.functions, state.searchValue, {
                    keys: ['name'],
                  }),
                },
                {
                  nodeId: 'types',
                  label: 'Data Types',
                  items: matchSorter(state.dataTypes, state.searchValue, {
                    keys: ['type'],
                  }),
                },
                {
                  nodeId: 'effects',
                  label: 'Effects',
                  items: matchSorter(state.effects, state.searchValue, {
                    keys: ['name'],
                  }),
                },
              ]}
            ></SideBar>
            <CardHStack></CardHStack>
          </SplitPane>
        </DragDropContext>
      </HotKeys>
    </StateContext.Provider>
  )
}
//"calc(100vh - 3rem)"
