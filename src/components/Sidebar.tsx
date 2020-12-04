import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import type { IsmallFunctionView } from './interfaces'
import { Code, Badge, Text } from '@chakra-ui/react'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons'
import './cloneStyles.css'
import TypeBadge from './TypeBadge'
import { FlowFunctionView } from './FlowCard'

const useTreeViewStyles = makeStyles({
  root: {
    height: '100%',
    flex: 1,
  },
})

type ItypeView = {
  name: string
  type: string
  typeParameters?: Array<string>
}

type Ieffect = 'console' | 'fetch'

type IsideBarItem =
  | {
      nodeId: 'functions'
      label: 'Functions'
      items: Array<IsmallFunctionView>
    }
  | {
      nodeId: 'types'
      label: 'Types'
      items: Array<ItypeView>
    }
  | {
      nodeId: 'effects'
      label: 'Effects'
      items: Array<Ieffect>
    }

export default function SideBar({
  items,
  isAnyItemDragging,
}: {
  items?: Array<IsideBarItem>
  isAnyItemDragging: boolean
}) {
  const { root } = useTreeViewStyles()

  return (
    <TreeView
      aria-label='Functions and types'
      className={root}
      defaultCollapseIcon={<ChevronDownIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {items &&
        items.map(item => {
          return (
            <TreeItem nodeId={item.nodeId} key={item.nodeId} label={item.label}>
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
  )
}

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
    <ul
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
    >
      <li>
        <FunctionItem {...props} />
        {/* <FlowFunctionView item={{ ...props }} /> */}
      </li>
    </ul>
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
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderClone ? (
                  <li className='react-beautiful-dnd-copy'>
                    <FunctionItem {...props}></FunctionItem>
                  </li>
                ) : (
                  <Draggable draggableId={props.nodeId} index={0}>
                    {(provided, snapshot) => {
                      return (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <FunctionItem {...props}></FunctionItem>
                        </li>
                      )
                    }}
                  </Draggable>
                )}
                {/* {provided.placeholder} */}
              </ul>
            )
          }}
        </Droppable>
      }
    ></TreeItem>
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
