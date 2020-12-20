import * as React from 'react'
import { Fade, Button, Box, Switch, IconButton, HStack } from '@chakra-ui/react'
import {
  ArrowUpDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DeleteIcon,
} from '@chakra-ui/icons'
import PopoverExplanation from '../PopoverExplanation'
import TypeBadge from '../TypeBadge'
import { Itype } from '../interfaces'
import { FunctionItem } from '../Sidebar'
import { GoVersions } from 'react-icons/go'
import { Action, StateContext } from '../../state'
const { useContext } = React

export const SaveButton = ({
  onClick,
  fadeIn,
  disabled,
}: {
  onClick: () => void
  fadeIn: boolean
  disabled: boolean
}) =>
  fadeIn ? (
    <Fade in={true}>
      {/* Save button */}
      <Button
        color={disabled ? 'gray.300' : 'unison.green'}
        sx={{ '&:hover': { backgroundColor: 'green.50' } }}
        variant='ghost'
        leftIcon={<CheckIcon />}
        disabled={disabled}
        onClick={onClick}
      >
        Save
      </Button>
    </Fade>
  ) : null

export const ClearButton = ({
  onClick,
  fadeIn,
}: {
  onClick: () => void
  fadeIn: boolean
}) =>
  fadeIn ? (
    <Fade in={true}>
      <Button
        color='unison.darkPink'
        sx={{ '&:hover': { backgroundColor: 'red.50' } }}
        variant='ghost'
        leftIcon={<DeleteIcon />}
        onClick={onClick}
      >
        Clear
      </Button>
    </Fade>
  ) : null

export const DocsExplanation = () => (
  <PopoverExplanation label='Docs card explanation' title='Docs card'>
    Docs is an editable view of the documentation for a function. The signature
    input will autocomplete types (string/boolean/number so far) and arrows but
    will not prevent invalid states, which are signified by the disabled "Save"
    button. The description can reference other functions with "@" (triggers
    autocomplete) and navigate to them by clicking on the link.
  </PopoverExplanation>
)

export const TypeSuggestionList = ({
  typeSuggestions,
  selectedIndex,
  left,
  top,
}: {
  typeSuggestions: {
    title: Itype['type']
  }[]
  selectedIndex: number
  left: number
  top: number
}) => (
  <Box
    as='ul'
    position='fixed'
    left={left}
    top={top}
    listStyleType='none'
    padding={1}
    boxShadow='lg'
    backgroundColor='white'
    rounded='sm'
    zIndex={1000}
  >
    {typeSuggestions.map((s, i) => (
      <Box
        as='li'
        key={s.title}
        display='block'
        textAlign='center'
        paddingX={1}
        paddingY={1}
        backgroundColor={
          i === selectedIndex
            ? 'unison.aqua'
            : s.title === 'string'
            ? 'yellow.100'
            : s.title === 'number'
            ? 'green.100'
            : s.title === 'boolean'
            ? 'pink.100'
            : 'white'
        }
      >
        <TypeBadge rounded={'none'} typeAsString={s.title}>
          {s.title}
        </TypeBadge>
      </Box>
    ))}
  </Box>
)

export const FunctionSuggestionList = ({
  functionSuggestions,
  selectedIndex,
  left,
  top,
}: {
  functionSuggestions: {
    name: string
  }[]
  selectedIndex: number
  left: number
  top: number
}) => (
  <Box
    as='ul'
    position='fixed'
    left={left}
    top={top}
    listStyleType='none'
    padding={1}
    boxShadow='lg'
    backgroundColor='white'
    rounded='sm'
    zIndex={1000}
  >
    {functionSuggestions.map((s, i) => (
      <Box
        as='li'
        key={s.name}
        display='block'
        textAlign='center'
        paddingX={1}
        paddingY={1}
        backgroundColor={i === selectedIndex ? 'unison.aqua' : 'white'}
        rounded={'base'}
      >
        {s.name}
      </Box>
    ))}
  </Box>
)

const buttonStyles = {
  color: 'unison.purple',
  variant: 'ghost',
  sx: {
    '&:hover': {
      color: 'unison.aqua',
    },
  },
}

export const DocsNavigationTypeSelector = ({
  navigationType,
  dispatch,
}: {
  navigationType: 'history' | 'panes'
  dispatch: React.Dispatch<Action>
}) => {
  return (
    <IconButton
      onClick={() => {
        dispatch({
          type: 'changeNavigationType',
          navigationType: navigationType === 'history' ? 'panes' : 'history',
        })
      }}
      {...buttonStyles}
      aria-label='Change navigation type'
      size='md'
      icon={
        navigationType === 'panes' ? (
          <ArrowUpDownIcon
            sx={{ transform: 'rotate(90deg)' }}
          ></ArrowUpDownIcon>
        ) : (
          <GoVersions></GoVersions>
        )
      }
    ></IconButton>

    /* <Switch
        size='sm'
        isChecked={navigationType === 'panes'}
        marginX={1}
        onChange={() => {
          dispatch({
            type: 'changeNavigationType',
            navigationType: navigationType === 'history' ? 'panes' : 'history',
          })
        }}
      ></Switch> */
  )
}
export const DocsNavigationArrows = () => {
  const { state, dispatch } = useContext(StateContext)
  const size = '6'
  return (
    <HStack>
      <IconButton
        onClick={() => {
          dispatch({
            type: 'docsNavigate',
            to: 'back',
          })
        }}
        aria-label='Navigate back'
        {...buttonStyles}
        disabled={state.docCardsSelectedIndex === 0}
        icon={<ChevronLeftIcon w={size} h={size}></ChevronLeftIcon>}
      ></IconButton>

      <IconButton
        margin={0}
        onClick={() => {
          dispatch({
            type: 'docsNavigate',
            to: 'forwards',
          })
        }}
        disabled={state.docCardsSelectedIndex === state.docCards.length - 1}
        aria-label='Navigate forwads'
        {...buttonStyles}
        // size={size}
        icon={<ChevronRightIcon w={size} h={size}></ChevronRightIcon>}
      ></IconButton>
    </HStack>
  )
}
