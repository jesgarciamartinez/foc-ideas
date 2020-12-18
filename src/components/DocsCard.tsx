import * as React from 'react'
import {
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  Code,
  IconButton,
  Box,
  Divider,
  Flex,
  Heading,
  Spacer,
  Button,
  Fade,
} from '@chakra-ui/react'
// import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons'
// import MonacoEditor from './Editor'
import { Itype, Ifunction } from './interfaces'
import { matchSorter } from 'match-sorter'
import TypeBadge from './TypeBadge'
import EditableText from './EditableText'
import PopoverExplanation from './PopoverExplanation'
import { Droppable } from 'react-beautiful-dnd'
import { Action } from '../state'
import {
  CompositeDecorator,
  Editor as DraftEditor,
  EditorState,
  ContentState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import './draftEditorStyles.css'
import AutocompleteInput from './autocomplete-react-draft/src/index'
// import SuggestionList from './autocomplete-react-draft/src/suggestions'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
const { hasCommandModifier } = KeyBindingUtil

const defaultName = 'name'
// const defaultType = '_'
const typeSuggestions: Array<{ title: Itype['type'] /*| 'New type' */ }> = [
  { title: 'string' },
  { title: 'boolean' },
  { title: 'number' },
]

const safeEval = (s: string) => {
  try {
    return eval(`(() => ${s})()`)
  } catch (error) {
    return null
  }
}
const getParamsAndReturns = (s: string) =>
  s.split(arrow).map(s => ({ type: s.trim() }))

const isSignatureCorrect = (
  paramsAndReturns: Array<{ type: string }>,
): paramsAndReturns is Array<Itype> =>
  paramsAndReturns.length > 1 &&
  paramsAndReturns.every(p => ['boolean', 'number', 'string'].includes(p.type))

const getFilteredTypeSuggestions = (
  typeSuggestions_: typeof typeSuggestions,
  inputValue?: string,
) => {
  if (inputValue === undefined || inputValue === null) return []
  if (inputValue === '' || inputValue === ' ') return typeSuggestions
  return matchSorter(typeSuggestions_, inputValue, { keys: ['title'] })
}

const typeToName = (x: { type: string }, n: number): string => {
  const suffix = n || ''
  switch (x.type) {
    case 'string':
      return 'str' + suffix
    case 'number':
      return 'num' + suffix
    case 'boolean':
      return 'bool' + suffix
    default:
      return 'x'
    // case 'function':
    //   return ['f', 'g', 'h', 'i', 'j'][n]
    // case 'object':
    //   return 'o' + suffix

    // case 'array':
    //   return '' //TODO
    // case 'undefined':
    // case 'null':
    //   return ''
  }
}
const getParamNames = (arr: Array<{ type: string }>): string[] => {
  let result: string[] = []
  let alreadySeenTypes: any = {}
  arr.forEach(iType => {
    const paramName = typeToName(iType, alreadySeenTypes[iType.type])
    result.push(paramName)
    alreadySeenTypes[iType.type] = (alreadySeenTypes[iType.type] || 0) + 1
  })
  return result
}

function findWithRegex(regex: any, contentBlock: any, callback: any) {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const signatureDecorator = new CompositeDecorator([
  {
    //TypeBadge
    strategy(contentBlock, cb, contentState) {
      findWithRegex(
        new RegExp(
          `(${typeSuggestions.map(({ title }) => title).join('|')})`,
          'gi',
        ),
        contentBlock,
        cb,
      )
    },
    component(props: any) {
      return (
        <TypeBadge
          typeAsString={props.decoratedText}
          children={props.children}
          as='span'
        />
      )
    },
  },
])

const HANDLE_REGEX = /@[\w]+/g
const arrow = '→'

const getStateValueFromFunc = (
  descriptionDecorator: CompositeDecorator,
  func?: Ifunction,
): {
  name: string
  signature: EditorState
  description: EditorState
  code: string
} => {
  return {
    name: func?.name || '',
    signature: EditorState.createWithContent(
      ContentState.createFromText(
        func?.parameters
          .concat(func.returns)
          .map(p => p.type)
          .join(` ${arrow} `) || '',
      ),
      signatureDecorator,
    ),
    description: EditorState.createWithContent(
      ContentState.createFromText(func?.description || ''),
      descriptionDecorator,
    ),
    code: func?.fn.toString() || '',
  }
}

type DocsCardState = {
  name: string
  signature: EditorState
  description: EditorState
  code: string
}

const setOriginalState = (
  originalState: React.MutableRefObject<{
    name: string
    signatureString: string
    descriptionString: string
    code: string
  }>,
  state: DocsCardState,
) => {
  const newOriginalState = {
    name: state.name,
    signatureString: state.signature.getCurrentContent().getPlainText(),
    descriptionString: state.description.getCurrentContent().getPlainText(),
    code: state.code,
  }

  originalState.current = newOriginalState
}

/**
 *
 *
 * DOCS CARD
 *
 *
 */

const DocsCard = ({
  func,
  dispatch,
  index,
  functions,
}: {
  func?: Ifunction
  dispatch: React.Dispatch<Action>
  index: number
  functions: Ifunction[]
}) => {
  const descriptionDecorator = new CompositeDecorator([
    {
      //TypeBadge
      strategy(contentBlock, cb, contentState) {
        findWithRegex(HANDLE_REGEX, contentBlock, cb)
      },
      component(props: any) {
        return (
          <Button
            as='span'
            variant='link'
            color='unison.aqua'
            fontSize='inherit'
            fontStyle='inherit'
            style={{
              direction: 'ltr',
              unicodeBidi: 'bidi-override',
            }}
            data-offset-key={props.offsetKey}
            onClick={e => {
              dispatch({
                type: 'openDocs',
                fnName: props.decoratedText.slice(1),
              })
            }}
          >
            {props.children}
          </Button>
        )
      },
    },
  ])
  const originalState = React.useRef<{
    name: string
    signatureString: string
    descriptionString: string
    code: string
  }>({
    name: '',
    signatureString: '',
    descriptionString: '',
    code: '',
  })
  const [state, setState] = React.useState<DocsCardState>(() => {
    const state = getStateValueFromFunc(descriptionDecorator, func)
    setOriginalState(originalState, state)
    return state
  })

  const [previousFunc, setPreviousFunc] = React.useState(func)
  if (previousFunc !== func) {
    //reference check on function from state.functions
    setPreviousFunc(func)
    const state = getStateValueFromFunc(descriptionDecorator, func)
    setOriginalState(originalState, state)
    setState(state)
  }
  const { name, signature, description, code } = state

  //Name
  const onChangeName = (name: string) => setState(state => ({ ...state, name }))
  const nameFontStyle = [defaultName, ''].includes(name) ? 'italic' : 'normal'
  const nameColor = [defaultName, ''].includes(name) ? 'gray.400' : 'normal'

  //Description
  const onChangeDescription = (description: EditorState) =>
    setState(state => ({ ...state, description }))
  const descriptionHasText = description.getCurrentContent().hasText()
  const descriptionFontStyle = descriptionHasText ? 'normal' : 'italic'
  const descriptionColor = descriptionHasText ? 'normal' : 'gray.400'
  // const descriptionEditorRef = React.useRef(null)

  //Signature

  // const [signatureEditorState, setSignatureEditorState] = React.useState(() =>
  //   EditorState.createEmpty(signatureDecorator),
  // )
  const signatureEditorRef = React.useRef<DraftEditor>(null)
  const signatureEditorParentRef = React.useRef<HTMLElement>(null)
  const coordsSignatureEditor = React.useRef<any>(null)

  const onChangeSignatureEditor = (e: EditorState) => {
    let newEditorState: EditorState
    switch (e.getLastChangeType()) {
      case 'insert-characters':
        const arrow = '→'
        const text = e.getCurrentContent().getFirstBlock().getText()
        let newText = text
        const triggerArrow = text.endsWith(',') || text.endsWith(' ')
        if (triggerArrow) {
          //TODO arrow component
          const previousMeaningfulCharIsArrow = text
            .replace(',', ' ')
            .trimEnd()
            .endsWith(arrow)
          const previousCharIsClosingBracket = text
            .substr(0, text.length - 1)
            .endsWith('}')
          if (previousMeaningfulCharIsArrow) {
            newText = text //.substr(0, text.length - 1)
          } else if (previousCharIsClosingBracket && text.endsWith(' ')) {
            //abilities
            newText = text
          } else {
            // only if last non-space or comma char is not arrow
            newText = text.substr(0, text.length - 1).concat(` ${arrow} `)
          }
        }

        newEditorState =
          text === newText
            ? e
            : EditorState.moveFocusToEnd(
                EditorState.push(
                  e,
                  ContentState.createFromText(newText),
                  'insert-fragment',
                ),
              )
        break
      default:
        newEditorState = e
        break
    }
    setState(state => ({ ...state, signature: newEditorState }))

    // autocomplete
    window.requestAnimationFrame(() => {
      const selection = window.getSelection() as Selection
      if (selection.rangeCount === 0) {
        //focus is outside
        setAutocompleteState(null)
        return
      }
      const stateSelection = newEditorState.getSelection()
      // const contentState = newEditorState.getCurrentContent()
      // const block = contentState.getBlockForKey(stateSelection.getStartKey())
      if (
        !stateSelection.getHasFocus() /*||
        block.getEntityAt(stateSelection.getStartOffset() - 1*/
      ) {
        setAutocompleteState(null)
        return
      }
      const range = selection.getRangeAt(0)
      // let text = range.startContainer.textContent//!.substring(
      //b|oolean -> 'b
      //0,
      //range.startOffset,
      //)
      // console.log(1, { text, stateSelection })
      const wholeWordText = range.startContainer.textContent as string //b|oolean -> 'boolean'
      let index = wholeWordText.length > 0 ? wholeWordText.lastIndexOf(' ') : 0
      index = index === -1 ? 0 : index
      const text = wholeWordText.substring(index).trim()

      // console.log(3, { text })

      let { left } = range.getBoundingClientRect()
      const editorParent = signatureEditorParentRef.current as HTMLElement
      const coords =
        coordsSignatureEditor.current ?? editorParent.getBoundingClientRect()
      coordsSignatureEditor.current = coords //TODO reset this cache
      let top = coords.bottom
      if (left === 0) {
        left = coords.left
      }

      setAutocompleteState({
        left,
        top,
        text,
        wholeWordText,
        selectedIndex: 0,
      })
    })
  }

  //Code
  const onChangeCode = (code: string) => setState(state => ({ ...state, code }))
  const signatureString = signature.getCurrentContent().getPlainText()
  const paramsAndReturns = getParamsAndReturns(signatureString)
  const params = paramsAndReturns.slice(0, paramsAndReturns.length - 1)
  const paramNames = getParamNames(params)
  const editorValue =
    code || `function ${name || 'name'}(${paramNames.join(', ')}) {\n\n}`

  // const [signatureTouched, setSignatureTouched] = React.useState<boolean>(false)
  const signatureError = !isSignatureCorrect(paramsAndReturns)

  const hasChanges =
    name !== originalState.current.name ||
    signatureString !== originalState.current.signatureString ||
    description.getCurrentContent().getPlainText() !==
      originalState.current.descriptionString ||
    code !== originalState.current.code

  const [autocompleteState, setAutocompleteState] = React.useState<any>(null)
  const filteredSuggestions = getFilteredTypeSuggestions(
    typeSuggestions,
    autocompleteState?.text,
  )

  return (
    <Box
      boxShadow={'base'}
      // minWidth={'48%'} //@TODO prevent Yscroll another way
      // minHeight='100%'
      backgroundColor='white'
      padding={1}
      minWidth={'50%'}
      minHeight='100vh'
      height='100%'
      // position='relative'
      display='flex'
      flexDirection='column'
    >
      <Code
        // SIGNATURE EDITOR
        fontSize='sm'
        width='100%'
        paddingX={1}
        paddingY={1}
        as='span'
        ref={signatureEditorParentRef}
        // position='relative'
      >
        <DraftEditor
          editorState={signature}
          ref={signatureEditorRef}
          onChange={onChangeSignatureEditor}
          keyBindingFn={(e): string | null => {
            switch (e.key) {
              case 'ArrowDown':
                return 'down'
              case 'ArrowUp':
                return 'up'
              case 'Escape':
                return 'close'
              case 'Enter':
                return 'select'
              case 'Tab':
                return 'select'
              default:
                return getDefaultKeyBinding(e)
            }
          }}
          handleKeyCommand={command => {
            switch (command) {
              case 'up': {
                setAutocompleteState((state: any) => ({
                  ...state,
                  selectedIndex:
                    state.selectedIndex === 0 ? 0 : state.selectedIndex - 1,
                }))
                return 'handled'
              }
              case 'down': {
                setAutocompleteState((state: any) => ({
                  ...state,
                  selectedIndex:
                    state.selectedIndex === filteredSuggestions.length - 1
                      ? filteredSuggestions.length - 1
                      : state.selectedIndex + 1,
                }))
                return 'handled'
              }
              case 'close': {
                signatureEditorRef.current!.blur()
                return 'handled'
              }
              case 'select': {
                const currentSelectionState = signature.getSelection()
                const end = currentSelectionState.getAnchorOffset()
                const anchorKey = currentSelectionState.getAnchorKey()
                const currentContent = signature.getCurrentContent()
                const currentBlock = currentContent.getBlockForKey(anchorKey)
                const blockText = currentBlock.getText()
                console.log({ blockText, signatureString })
                // const start = blockText.substring(0, end).lastIndexOf(trigger)
                // return {
                // editorState,
                // start,
                // end,
                // trigger,
                // selectedIndex: autocompleteState.selectedIndex,
                // }
                return 'handled'
              }
              default:
                return 'not-handled'
            }
          }}

          // onBlur={(e: any) => {
          //   setSignatureTouched(true)
          // }}
        />
        {filteredSuggestions.length > 0 ? (
          <Box
            as='ul'
            position='fixed'
            left={autocompleteState.left}
            top={autocompleteState.top}
            listStyleType='none'
            padding={1}
            boxShadow='lg'
            backgroundColor='white'
            rounded='sm'
            zIndex={1000}
          >
            {filteredSuggestions.map((s, i) => (
              <Box
                as='li'
                key={s.title}
                display='block'
                textAlign='center'
                paddingX={1}
                paddingY={1}
                backgroundColor={
                  i === autocompleteState.selectedIndex
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
        ) : null}
      </Code>

      <Flex paddingLeft={2} alignItems='center'>
        <Heading fontSize='xl' fontStyle='italic' color='unison.purple'>
          Docs
        </Heading>
        <Spacer></Spacer>

        <Fade in={hasChanges}>
          <Button
            color='unison.darkPink'
            sx={{ '&:hover': { backgroundColor: 'red.50' } }}
            variant='ghost'
            leftIcon={<DeleteIcon />}
            onClick={() => {
              const state = getStateValueFromFunc(
                descriptionDecorator,
                undefined,
              )
              setOriginalState(originalState, state)
              setState(state)
              dispatch({ type: 'clearDocsCard', index })
            }}
          >
            Clear
          </Button>
        </Fade>

        <Fade in={hasChanges}>
          <Button
            color={signatureError ? 'gray.300' : 'unison.green'}
            sx={{ '&:hover': { backgroundColor: 'green.50' } }}
            variant='ghost'
            leftIcon={<CheckIcon />}
            disabled={signatureError}
            onClick={() => {
              const fn = safeEval(code)
              const validParams = isSignatureCorrect(paramsAndReturns)
              if (!fn || !validParams) {
                return //TODO alert
              }
              const parameters = paramsAndReturns.slice(
                0,
                paramsAndReturns.length - 1,
              ) as Itype[] //TODO cast
              const returns = paramsAndReturns.slice(-1).pop() as Itype
              dispatch({
                type: 'createFunction',
                function: {
                  name,
                  parameters,
                  returns,
                  fn,
                  description: description.getCurrentContent().getPlainText(),
                },
                index,
              })
            }}
          >
            Save
          </Button>
        </Fade>

        <PopoverExplanation label='Docs card explanation' title='Docs card'>
          Docs is an editable view of the documentation for a function. The
          signature input will autocomplete types (string/boolean/number so far)
          and arrows but will not prevent invalid states, which are signified by
          the disabled "Save" button. The description can reference other
          functions with "@" (triggers autocomplete) and navigate to them by
          clicking on the link.
        </PopoverExplanation>
        <IconButton
          aria-label='Close card'
          icon={<CloseIcon />}
          variant='ghost'
          size='sm'
          onClick={() => dispatch({ type: 'closeDocsCard', index })}
        />
      </Flex>
      <Divider marginTop={2}></Divider>
      <Droppable droppableId='DocsCard'>
        {(provided, snapshot) => {
          return (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              // minWidth={'50%'}
              flex={1}
              minHeight='100%'
              height='100%'
              overflow='auto'
              paddingX={2}
              paddingY={2}
            >
              <EditableText
                /* NAME */
                value={name}
                onChange={onChangeName}
                placeholder={defaultName}
                fontSize='2xl'
                textColor={nameColor}
                fontStyle={nameFontStyle}
                marginBottom={3}
              />

              {/* SIGNATURE */}
              <HStack>
                <Code fontSize='sm' padding={0.5}>
                  <Editable
                    as='span'
                    placeholder={defaultName}
                    fontStyle={nameFontStyle}
                    // width={name.length * 12 + 12 + 'px'}
                    width={(name.length > 3 ? name.length : 4) * 9 + 9 + 'px'}
                    // minWidth={(name || defaultName).length * 12 + 12 + 'px'}
                    value={name}
                    textColor={nameColor}
                    onChange={onChangeName}
                    paddingX={1}
                  >
                    <EditablePreview
                      width={(name.length > 3 ? name.length : 4) * 9 + 9 + 'px'}
                    />
                    <EditableInput
                      width={(name.length > 3 ? name.length : 4) * 9 + 9 + 'px'}
                      _focus={{
                        outline: '',
                      }}
                    />
                  </Editable>
                </Code>

                <Text as='span' fontSize='sm'>
                  :{' '}
                </Text>
                <Code
                  // SIGNATURE EDITOR
                  fontSize='sm'
                  width='100%'
                  paddingX={1}
                  paddingY={1}
                  as='span'
                >
                  {/* <DraftEditor
                    editorState={signature}
                    ref={signatureEditorRef}
                    onChange={onChangeSignatureEditor}
                    // onBlur={(e: any) => {
                    //   setSignatureTouched(true)
                    // }}
                  /> */}
                </Code>
              </HStack>

              <Code fontSize='xl' display='block' marginTop={2}>
                {/* SIGNATURE 2 */}
                {/* <EditableText
                  ref={signature2Ref}
                  placeholder={defaultName}
                  fontStyle={nameFontStyle}
                  width={(signature2 || defaultName).length * 12 + 12 + 'px'}
                  maxWidth='100%'
                  value={signature2}
                  textColor={nameColor}
                  onChange={onChangeSignature2}
                /> */}
              </Code>
              <Text
                /* DESCRIPTION */
                className='description'
                marginTop={5}
                fontSize='xl'
                fontStyle={descriptionFontStyle}
                color={descriptionColor}
                backgroundColor='yellow.50'
                padding={3}
              >
                <DraftEditor
                  placeholder='Description'
                  editorState={description}
                  onChange={onChangeDescription}
                ></DraftEditor>
              </Text>
              {/* <Tabs marginTop={5}>
                <TabList>
                  <Tab>Regular editor</Tab>
                  <Tab>Structured editor</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel> */}
              {/* <Box marginTop={5}>
                <MonacoEditor
                  value={editorValue}
                  onChange={(_, v: any) => {
                    onChangeCode(v)
                  }}
                ></MonacoEditor>
              </Box> */}

              {/* </TabPanel>
                  <TabPanel>
                    <Code>{editorValue}</Code>
                  </TabPanel>
                </TabPanels>
              </Tabs> */}
              <AutocompleteInput></AutocompleteInput>

              {provided.placeholder}
            </Box>
          )
        }}
      </Droppable>
    </Box>
  )
}
export default DocsCard
