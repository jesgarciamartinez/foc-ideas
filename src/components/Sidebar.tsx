import * as React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import type { Ieffect, Itype, Ifunction } from './interfaces'
import {
  Box,
  Code,
  forwardRef,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Kbd,
  ListItem,
  UnorderedList,
  Center,
  useTheme,
  InputRightElement,
  InputRightAddon,
  HStack,
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
import { FaShapes } from 'react-icons/fa'
// import { VscSymbolMisc as FaShapes } from 'react-icons/vsc'
import { GiMineExplosion } from 'react-icons/gi'
// import { IoShapes } from 'react-icons/io' //RiFunctionLine, RiFunctionFill //IoShapesOutline
import './sideBarStyles.css'
import TypeBadge from './TypeBadge'
import { Action } from '../state'
import MouseTrap from 'mousetrap'
// import { FlowFunctionView } from './FlowCard'
import PopoverExplanation from './PopoverExplanation'

type IsideBarItem =
  | {
      nodeId: 'functions'
      label: 'Functions'
      items: Array<Ifunction>
    }
  | {
      nodeId: 'types'
      label: 'Data Types'
      items: Array<Itype>
    }
  | {
      nodeId: 'effects'
      label: 'Effects'
      items: Array<Ieffect>
    }

const FunctionItem = (props: Ifunction) => {
  return (
    <Text
      wrap='nowrap'
      color='unison.purple'
      _hover={{ color: 'unison.lightPurple' }}
    >
      <Code
        fontSize='sm'
        // fontWeight='700'
        paddingX={1}
        paddingY={0.5}
        rounded='base'
        backgroundColor='transparent'
        color='inherit'
      >
        {props.name}
      </Code>
      <Text as='span'>: </Text>
      <Text as={'span'} flexWrap='nowrap'>
        {props.parameters.map((p, i) => (
          <Text as='span' key={i}>
            <TypeBadge typeAsString={p.type} />
            <ArrowForwardIcon marginX={1} />
          </Text>
        ))}
      </Text>
      <TypeBadge typeAsString={props.returns.type} />
    </Text>
  )
}

const getFunctionRenderItem = (props: Ifunction) => (
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
  props: Ifunction & { nodeId: string; isAnyItemDragging: boolean },
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
    ></TreeItem>
  )
}
const TypeTreeItem = (
  props: Itype & { nodeId: string; isAnyItemDragging: boolean },
) => {
  const { content } = useTreeItemStyles()
  return (
    <TreeItem
      nodeId={props.nodeId}
      classes={{ content: props.isAnyItemDragging ? content : undefined }}
      label={<TypeBadge typeAsString={props.type}></TypeBadge>}
    />
  )
}

const Sidebar = React.memo(
  forwardRef(
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
      const theme = useTheme()
      const {
        colors: {
          unison: { purple, lightPurple, pink },
        },
      } = theme

      //Search
      const [isHoveringSearch, setIsHoveringSearch] = React.useState(false)
      const onMouseEnterSearch = React.useCallback(() => {
        setIsHoveringSearch(true)
      }, [])
      const onMouseLeaveSearch = React.useCallback(() => {
        setIsHoveringSearch(false)
      }, [])

      return (
        <Box height='100%' flex={1} backgroundColor={'purple.50'}>
          <InputGroup
            width='100%'
            whiteSpace='nowrap'
            padding={1}
            display='flex'
            onMouseEnter={onMouseEnterSearch}
            onMouseLeave={onMouseLeaveSearch}
            // _focusWithin={{ color: 'teal.600' }}
          >
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color={purple} />} //TODO teal
            />
            <Input
              ref={ref}
              placeholder='Search'
              variant='outline'
              _hover={{ borderBottomColor: lightPurple }}
              focusBorderColor={'unison.aqua'}
              size='md'
              borderRadius='0%'
              borderTop='none'
              borderLeft='none'
              borderRight='none'
              borderBottom={`2px solid ${purple}`}
              value={searchValue}
              onFocus={() => {
                if (!ref || !('current' in ref)) return
                ref.current.setSelectionRange(0, ref.current.value.length)
              }}
              onChange={e =>
                dispatch({ type: 'sideBarSearch', value: e.target.value })
              }
            />
            {isHoveringSearch ? (
              <HStack
                background='transparent'
                position='absolute'
                right={2}
                top={2}
                pointerEvents='none'
              >
                <Kbd>ctrl</Kbd>
                <Text>/</Text>
                <Kbd>⌘</Kbd>
                <Text>+</Text>
                <Kbd>B</Kbd>
              </HStack>
            ) : null}
          </InputGroup>
          <Center>
            <PopoverExplanation label='Sidebar explanation' title='Sidebar'>
              <UnorderedList>
                <ListItem>
                  Drag functions and drop them onto Flow Card or Docs Card
                </ListItem>
                <ListItem>
                  <Kbd>up</Kbd>, <Kbd>down</Kbd>, <Kbd>left</Kbd>,{' '}
                  <Kbd>right</Kbd> to move in Sidebar
                </ListItem>
                <ListItem>
                  <Kbd>space</Kbd> to drag, <Kbd>right</Kbd> then{' '}
                  <Kbd>space</Kbd> to drop
                </ListItem>
                <ListItem>
                  Datatypes and Effects are not interactive at this point
                </ListItem>
              </UnorderedList>
            </PopoverExplanation>
          </Center>

          <TreeView
            selected={[]}
            aria-label='Functions, types and effects'
            defaultCollapseIcon={<ChevronDownIcon color='unison.purple' />}
            defaultExpandIcon={<ChevronRightIcon color='unison.purple' />}
            onNodeFocus={(e, v) => {
              const draggable: any = document.querySelector(
                `[data-rbd-draggable-id="${v}"]`,
              )

              if (draggable) {
                const focused = document.querySelectorAll('.Mui-focused')
                focused.forEach(e => {
                  e.classList.remove('Mui-focused')
                })
                const div =
                  draggable.parentElement?.parentElement?.parentElement
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
          >
            {items &&
              items.map(item => {
                const label = (
                  <Text fontSize='lg' color={'unison.purple'}>
                    {item.label}
                  </Text>
                )
                return (
                  <TreeItem
                    nodeId={item.nodeId}
                    key={item.nodeId}
                    label={
                      <HStack>
                        {item.nodeId === 'functions' ? (
                          <Text fontWeight='bold' fontSize='xl' color={purple}>
                            λ
                          </Text>
                        ) : item.nodeId === 'types' ? (
                          <FaShapes color={purple} />
                        ) : item.nodeId === 'effects' ? (
                          <GiMineExplosion color={purple} />
                        ) : null}
                        {label}
                      </HStack>
                    }
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
                            const id = `${item.nodeId}_${innerItem.type}`
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
  ),
)

export default Sidebar
