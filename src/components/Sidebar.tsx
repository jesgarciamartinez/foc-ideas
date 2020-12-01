import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import type { IfunctionView } from './interfaces'
import { Code, Badge, Text } from '@chakra-ui/react'
import { makeStyles } from '@material-ui/core/styles'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import './cloneStyles.css'

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

type IsideBarItem =
  | {
      nodeId: 'functions'
      label: 'Functions'
      items: Array<IfunctionView>
    }
  | {
      nodeId: 'types'
      label: 'Types'
      items: Array<ItypeView>
    }

export default function SideBar({
  items,
  isAnyItemDragging,
}: {
  items?: Array<IsideBarItem>
  isAnyItemDragging?: boolean
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
            <TreeItem nodeId={item.nodeId} label={item.label}>
              {(() => {
                switch (item.nodeId) {
                  case 'functions':
                    return item.items.map((innerItem, i) => (
                      <FunctionTreeItem
                        {...innerItem}
                        nodeId={item.nodeId + i}
                        isAnyItemDragging={!!isAnyItemDragging}
                      />
                    ))
                  case 'types':
                    return item.items.map((innerItem, i) => (
                      <TypeTreeItem
                        {...innerItem}
                        nodeId={item.nodeId + i}
                        isAnyItemDragging={!!isAnyItemDragging}
                      />
                    ))
                  default:
                    let x: never = item
                }
              })()}
            </TreeItem>
          )
        })}
    </TreeView>
  )
}
const getRenderItem = (props: IfunctionView) => (
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
      <Text wrap='nowrap'>
        <Code /*backgroundColor='white'*/>{props.name}</Code>
        <Text as='span'>:</Text>
        <Text as={'span'} flexWrap='nowrap'>
          {props.parameterTypes.map((p, i) => (
            <Text as='span' key={i}>
              <Badge>{p}</Badge> <Text as='span'> →</Text>
            </Text>
          ))}
        </Text>
        <Text as='span'>
          <Badge>{props.returnType}</Badge>
        </Text>
      </Text>
    </ul>
  )
}
const useTreeItemStyles = makeStyles({
  content: {
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'grabbing',
    },
  },
})
const FunctionTreeItem = (
  props: IfunctionView & { nodeId: string; isAnyItemDragging: boolean },
) => {
  const { content } = useTreeItemStyles()
  return (
    <TreeItem
      classes={{ content: props.isAnyItemDragging ? content : undefined }}
      nodeId={props.nodeId}
      label={
        <Droppable
          droppableId={props.nodeId}
          renderClone={getRenderItem(props)}
          isDropDisabled={true}
        >
          {(provided, snapshot) => {
            const shouldRenderClone =
              props.nodeId === snapshot.draggingFromThisWith
            return (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {shouldRenderClone ? (
                  <li className='react-beautiful-dnd-copy'>
                    <Text wrap='nowrap'>
                      <Code /*backgroundColor='white'*/>{props.name}</Code>
                      <Text as='span'>:</Text>
                      <Text as={'span'} flexWrap='nowrap'>
                        {props.parameterTypes.map((p, i) => (
                          <Text as='span' key={i}>
                            <Badge>{p}</Badge> <Text as='span'> →</Text>
                          </Text>
                        ))}
                      </Text>
                      <Text as='span'>
                        <Badge>{props.returnType}</Badge>
                      </Text>
                    </Text>
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
                          <Text wrap='nowrap'>
                            <Code /*backgroundColor='white'*/>
                              {props.name}
                            </Code>
                            <Text as='span'>:</Text>
                            <Text as={'span'} flexWrap='nowrap'>
                              {props.parameterTypes.map((p, i) => (
                                <Text as='span' key={i}>
                                  <Badge>{p}</Badge> <Text as='span'> →</Text>
                                </Text>
                              ))}
                            </Text>
                            <Text as='span'>
                              <Badge>{props.returnType}</Badge>
                            </Text>
                          </Text>
                        </li>
                      )
                    }}
                  </Draggable>
                )}
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
