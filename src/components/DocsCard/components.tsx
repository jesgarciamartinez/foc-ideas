import * as React from 'react'
import {
  Fade,
  Button,
  Box,
  Switch,
  IconButton,
  HStack,
  ListItem,
  UnorderedList,
  Text,
  Link,
} from '@chakra-ui/react'
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
    <UnorderedList>
      <ListItem>
        Docs is an editable view of the documentation for a function.
      </ListItem>
      <ListItem>
        The signature input will autocomplete types (string/boolean/number so
        far) and arrows but won't prevent invalid states, which will disable the
        "Save" button.{' '}
      </ListItem>
      <ListItem>
        The description can reference other functions with "@" (triggers
        autocomplete) and navigate to them by clicking on the link. We could
        imagine adding tests and examples here.
      </ListItem>
      <ListItem>Navigation can be </ListItem>
      <UnorderedList styleType='none'>
        <ListItem>
          <ArrowUpDownIcon
            size={'xs'}
            sx={{ transform: 'rotate(90deg)' }}
          ></ArrowUpDownIcon>{' '}
          browser history style
        </ListItem>
        <ListItem>
          <GoVersions
            style={{ width: '16px', height: '16px', display: 'inline' }}
          ></GoVersions>{' '}
          panes style (like
          <Link
            href='https://notes.andymatuschak.org/About_these_notes'
            color='unison.purple'
            _hover={{ color: 'unison.lightPurple' }}
          >
            {' '}
            Andy Matuschak's notes
          </Link>
          )
        </ListItem>
      </UnorderedList>
    </UnorderedList>
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
  onClick,
}: {
  functionSuggestions: {
    name: string
  }[]
  selectedIndex: number
  left: number
  top: number
  onClick: (index: number) => void
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
        onClick={() => onClick(i)}
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
      variant='ghost'
      sx={{
        color: 'unison.purple',
        '&:hover': {
          color: 'unison.aqua',
        },
      }}
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

const getButtonStyles = (isDisabled: boolean) => ({
  variant: 'ghost',
  sx: isDisabled
    ? {
        color: 'grey.300',
      }
    : {
        color: 'unison.purple',
        '&:hover': {
          color: 'unison.aqua',
        },
      },
})

export const DocsNavigationArrows = () => {
  const { state, dispatch } = useContext(StateContext)
  const size = '6'
  const backDisabled = state.docCardsSelectedIndex === 0
  const forwardDisabled =
    state.docCardsSelectedIndex === state.docCards.length - 1
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
        {...getButtonStyles(backDisabled)}
        disabled={backDisabled}
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
        disabled={forwardDisabled}
        aria-label='Navigate forwads'
        {...getButtonStyles(forwardDisabled)}
        icon={<ChevronRightIcon w={size} h={size}></ChevronRightIcon>}
      ></IconButton>
    </HStack>
  )
}
