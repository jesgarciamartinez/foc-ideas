import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import type { Ieffect, IsmallFunctionView, ItypeView } from './interfaces'
import {
  Box,
  Code,
  forwardRef,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from '@chakra-ui/react'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowForwardIcon,
  SearchIcon,
} from '@chakra-ui/icons'
import './cloneStyles.css'
import TypeBadge from './TypeBadge'
import { Action } from '../state'
import MouseTrap from 'mousetrap'
// import { FlowFunctionView } from './FlowCard'

// const useTreeViewStyles = makeStyles({
//   root: {
//     height: '100%',
//     flex: 1,
//   },
// })

type IsideBarItem =
  | {
      nodeId: 'functions'
      label: 'Functions'
      items: Array<IsmallFunctionView>
    }
  | {
      nodeId: 'types'
      label: 'Data Types'
      items: Array<ItypeView>
    }
  | {
      nodeId: 'effects'
      label: 'Effects'
      items: Array<Ieffect>
    }

export default forwardRef(
  (
    {
      items,
      isAnyItemDragging,
      dispatch,
      searchValue,
    }: {
      items: Array<IsideBarItem>
      isAnyItemDragging: boolean
      dispatch: React.Dispatch<Action>
      searchValue: string
    },
    ref,
  ) => {
    // const { root } = useTreeViewStyles()
    return (
      <Box height='100%' flex={1}>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.300' />}
          />
          <Input
            ref={ref}
            placeholder='Search'
            size='md'
            borderRadius='0%'
            borderX='none'
            value={searchValue}
            onChange={e =>
              dispatch({ type: 'sideBarSearch', value: e.target.value })
            }
          />
        </InputGroup>

        <TreeView
          selected={[]}
          aria-label='Functions and types'
          // className={root}
          defaultCollapseIcon={<ChevronDownIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeFocus={(e, v) => {
            console.log({ isAnyItemDragging, e, v })
            const draggable: any = document.querySelector(
              `[data-rbd-draggable-id="${v}"]`,
            )

            if (draggable) {
              const div = draggable.parentElement?.parentElement?.parentElement
              const li = div?.parentElement
              const parentMenu =
                li?.parentElement?.parentElement?.parentElement?.parentElement
              const previous = li?.previousElementSibling
              const next = li?.nextElementSibling

              if (!draggable.bound) {
                draggable.bound = true
                MouseTrap(draggable).bind('left', e => {
                  if (isAnyItemDragging) {
                    return
                  }
                  div?.classList.remove('Mui-focused')
                  parentMenu?.focus()
                })
                MouseTrap(draggable).bind('down', e => {
                  if (isAnyItemDragging) {
                    return
                  }
                  if (next) {
                    next.focus()
                    div?.classList.remove('Mui-focused')
                  } else {
                    parentMenu?.nextElementSibling?.focus()
                    div?.classList.remove('Mui-focused')
                  }
                })
                MouseTrap(draggable).bind('up', e => {
                  if (isAnyItemDragging) {
                    return
                  }
                  if (previous) {
                    previous.focus()
                    div?.classList.remove('Mui-focused')
                  } else {
                    parentMenu?.focus()
                    div?.classList.remove('Mui-focused')
                  }
                })
              }

              div?.classList.add('Mui-focused')
              draggable.focus()
            }
          }}
          // onNodeSelect={(e: any, v: string) => {
          // console.log('select', { e, v })
          // const draggable: HTMLInputElement | null = document.querySelector(
          //   `[data-rbd-draggable-id="${v}"]`,
          // )
          // if (draggable) {
          //   draggable.focus()
          // }
          // if (!v.startsWith('functions')) {
          //   return
          // }
          // const [label, name, action] = v.split('_')
          // if (action === 'flow') {
          //   dispatch({
          //     type: 'dropFnFromSideBarOnFlowCard',
          //     index: 0, //TODO
          //     draggableId: `${label}_${name}`,
          //   })
          // } else if (action === 'docs') {
          // }
          // }}
          // onNodeToggle={(e: any, v: any) => console.log('toggle', { e, v })}
        >
          {items &&
            items.map(item => {
              return (
                <TreeItem
                  nodeId={item.nodeId}
                  key={item.nodeId}
                  label={item.label}
                >
                  {(() => {
                    switch (item.nodeId) {
                      case 'functions':
                        return item.items.map(innerItem => {
                          const id = `${item.nodeId}_${innerItem.name}`
                          return (
                            <FunctionTreeItem
                              {...innerItem}
                              key={id}
                              nodeId={id}
                              isAnyItemDragging={!!isAnyItemDragging}
                            />
                          )
                        })
                      case 'types':
                        return item.items.map(innerItem => {
                          const id = `${item.nodeId}_${innerItem.name}`
                          return (
                            <TypeTreeItem
                              {...innerItem}
                              key={id}
                              nodeId={id}
                              isAnyItemDragging={!!isAnyItemDragging}
                            />
                          )
                        })
                      case 'effects':
                        return null //@TODO
                      default:
                        let _: never = item
                    }
                  })()}
                </TreeItem>
              )
            })}
        </TreeView>
      </Box>
    )
  },
)

const FunctionItem = (props: IsmallFunctionView) => {
  return (
    <Text wrap='nowrap'>
      <Code /*backgroundColor='white'*/>{props.name}</Code>
      <Text as='span'>:</Text>
      <Text as={'span'} flexWrap='nowrap'>
        {props.parameterTypes.map((p, i) => (
          <Text as='span' key={i}>
            <TypeBadge>{p}</TypeBadge>{' '}
            <Text as='span'>
              {' '}
              <ArrowForwardIcon />{' '}
            </Text>
          </Text>
        ))}
      </Text>
      <Text as='span'>
        <TypeBadge>{props.returnType}</TypeBadge>
      </Text>
    </Text>
  )
}

const getFunctionRenderItem = (props: IsmallFunctionView) => (
  provided: any,
  snapshot: any,
  rubric: any,
) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
    >
      <div>
        <FunctionItem {...props} />
        {/* <FlowFunctionView item={{ ...props }} /> */}
      </div>
    </div>
  )
}
const useTreeItemStyles = makeStyles({
  root: {
    marginBottom: '5px',
  },
  content: {
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'grabbing',
    },
  },
})

const FunctionTreeItem = (
  props: IsmallFunctionView & { nodeId: string; isAnyItemDragging: boolean },
) => {
  const { root, content } = useTreeItemStyles()
  return (
    <TreeItem
      classes={{ root, content: props.isAnyItemDragging ? content : undefined }}
      nodeId={props.nodeId}
      label={
        <Droppable
          droppableId={props.nodeId}
          renderClone={getFunctionRenderItem(props)}
          isDropDisabled={true}
        >
          {(provided, snapshot) => {
            const shouldRenderClone =
              props.nodeId === snapshot.draggingFromThisWith
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderClone ? (
                  <div className='react-beautiful-dnd-copy'>
                    <FunctionItem {...props}></FunctionItem>
                  </div>
                ) : (
                  <Draggable draggableId={props.nodeId} index={0}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <FunctionItem {...props}></FunctionItem>
                        </div>
                      )
                    }}
                  </Draggable>
                )}
                {/* {provided.placeholder} */}
              </div>
            )
          }}
        </Droppable>
      }
    >
      {/* <TreeItem
        nodeId={props.nodeId + '_docs'}
        icon={<ViewIcon />}
        label={'See docs'}
      ></TreeItem>
      <TreeItem
        nodeId={props.nodeId + '_flow'}
        icon={<HamburgerIcon />}
        label={'Add to flow pane'}
      ></TreeItem> */}
    </TreeItem>
  )
}
const TypeTreeItem = (
  props: ItypeView & { nodeId: string; isAnyItemDragging: boolean },
) => {
  const { content } = useTreeItemStyles()
  return (
    <TreeItem
      nodeId={props.nodeId}
      classes={{ content: props.isAnyItemDragging ? content : undefined }}
      label={`${props.type} ${props.name}`}
    />
  )
}
