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

type IsideBarItem =
  | {
      nodeId: 'functions'
      label: 'functions'
      items: Array<IfunctionView>
    }
  | {
      nodeId: 'types'
      label: 'types'
      items: Array<IfunctionView>
    }

export default function SideBar({ items }: { items?: Array<IsideBarItem> }) {
  const TreeViewClasses = useTreeViewStyles()

  return (
    <TreeView
      aria-label='Functions and types'
      className={TreeViewClasses.root}
      defaultCollapseIcon={<ChevronDownIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId='1' label='Functions'>
        <StyledTreeItem
          nodeId='2'
          name='length'
          parameterTypes={['String', 'String', 'String', 'String']}
          returnType='Number'
          isAnyItemDragging={false}
        ></StyledTreeItem>
        <StyledTreeItem
          nodeId='3'
          name='pluchus'
          parameterTypes={['String']}
          returnType='Number'
          isAnyItemDragging={true}
        ></StyledTreeItem>
        <StyledTreeItem
          nodeId='4'
          name='flinchumer'
          parameterTypes={['String']}
          returnType='Number'
          isAnyItemDragging={true}
        ></StyledTreeItem>
      </TreeItem>
      <TreeItem nodeId='5' label='Types'>
        <TreeItem nodeId='10' label='OSS' />
        <TreeItem nodeId='6' label='Material-UI'>
          <TreeItem nodeId='7' label='src'>
            <TreeItem nodeId='8' label='index.js' />
            <TreeItem nodeId='9' label='tree-view.js' />
          </TreeItem>
        </TreeItem>
      </TreeItem>
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
const StyledTreeItem = (
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
