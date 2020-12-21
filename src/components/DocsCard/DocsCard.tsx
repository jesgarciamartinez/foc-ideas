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
import { CloseIcon, ArrowUpDownIcon } from '@chakra-ui/icons'
import MonacoEditor from '../Editor'

import { Itype, Ifunction } from '../interfaces'
import { matchSorter } from 'match-sorter'
import TypeBadge from '../TypeBadge'
import EditableText from '../EditableText'
import { Droppable } from 'react-beautiful-dnd'
import { Action, NavigationType } from '../../state'
import {
  CompositeDecorator,
  Editor as DraftEditor,
  EditorState,
  ContentState,
  Entity,
  Modifier,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import './draftEditorStyles.css'
import AutocompleteInput from '../autocomplete-react-draft/src/index'
// import SuggestionList from './autocomplete-react-draft/src/suggestions'
import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js'
import {
  ClearButton,
  DocsExplanation,
  DocsNavigationArrows,
  DocsNavigationTypeSelector,
  SaveButton,
  TypeSuggestionList,
} from './components'
const { hasCommandModifier } = KeyBindingUtil

const { useCallback } = React

const autocompleteKeyBindingFn = (e: any): string | null => {
  //TODO e type
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
}

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
  if (typeSuggestions.some(s => s.title === inputValue)) return []
  return matchSorter(typeSuggestions_, inputValue, { keys: ['title'] })
}

const getFilteredFunctions = (functions: Ifunction[], inputValue?: string) => {
  if (inputValue === undefined || inputValue === null) return []
  if (inputValue === '') return functions
  return matchSorter(functions, inputValue, { keys: ['name'] })
}

const arrow = '->'

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
  navigationType,
}: {
  func?: Ifunction
  dispatch: React.Dispatch<Action>
  index: number
  functions: Ifunction[]
  navigationType?: NavigationType
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
                openerIndex: index,
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

  /* Name */
  const onChangeName = (name: string) => setState(state => ({ ...state, name }))
  const nameFontStyle = [defaultName, ''].includes(name) ? 'italic' : 'normal'
  const nameColor = [defaultName, ''].includes(name) ? 'gray.400' : 'normal'

  /* Description */
  const onChangeDescription = (description: EditorState) =>
    setState(state => ({ ...state, description }))
  const descriptionHasText = description.getCurrentContent().hasText()
  const descriptionFontStyle = descriptionHasText ? 'normal' : 'italic'
  const descriptionColor = descriptionHasText ? 'normal' : 'gray.400'
  // const descriptionEditorRef = React.useRef(null)
  const [
    autocompleteDescription,
    setAutocompleteDescription,
  ] = React.useState<any>(null)
  const filteredFunctions = getFilteredFunctions(
    functions,
    autocompleteDescription?.text,
  )

  /* Signature */

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

    /* autocomplete */

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
        startIndex: index,
        selectedIndex: 0,
      })
    })
  }
  const handleKeyCommand = (command: 'up' | 'down' | 'close' | 'select') => {
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
        const anchorOffset /*end */ = currentSelectionState.getAnchorOffset()
        const anchorKey = currentSelectionState.getAnchorKey()
        const currentContent = signature.getCurrentContent()
        const currentBlock = currentContent.getBlockForKey(anchorKey)
        const blockText = currentBlock.getText()
        console.log({
          blockText,
          signatureString,
          text: autocompleteState.text,
          wholeWordText: autocompleteState.wholeWordText,
          anchorOffset,
          anchorKey,
        })
        // const start = blockText.substring(0, end).lastIndexOf(trigger)
        // return {
        // editorState,
        // start,
        // end,
        // trigger,
        // selectedIndex: autocompleteState.selectedIndex,
        // }

        // add suggestion
        const textToInsert =
          filteredSuggestions[autocompleteState.selectedIndex].title
        const newCurrentContent = currentContent.createEntity(
          'TYPE',
          'IMMUTABLE',
        )
        const entityKey = newCurrentContent.getLastCreatedEntityKey()
        const mentionTextSelection = currentSelectionState.merge({
          anchorOffset: autocompleteState.startIndex,
          focusOffset: anchorOffset,
        })
        let insertingContent = Modifier.replaceText(
          signature.getCurrentContent(),
          mentionTextSelection,
          textToInsert,
          undefined,
          // ['link', 'BOLD'],
          entityKey,
        )
        const newEditorState = EditorState.push(
          signature,
          insertingContent,
          'apply-entity',
        )
        setState(state => ({ ...state, signature: newEditorState }))

        // EditorState.forceSelection(
        //   newEditorState,
        //   insertingContent.getSelectionAfter(),
        // ),

        return 'handled'
      }
      default:
        return 'not-handled'
    }
  }

  const [autocompleteState, setAutocompleteState] = React.useState<any>(null)
  const filteredSuggestions = getFilteredTypeSuggestions(
    typeSuggestions,
    autocompleteState?.text,
  )

  /* Code */

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

  const onSaveButtonClick = () => {
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
  }

  const onClearButtonClick = useCallback(() => {
    const state = getStateValueFromFunc(descriptionDecorator, undefined)
    setOriginalState(originalState, state)
    setState(state)
    dispatch({ type: 'clearDocsCard', index })
  }, [originalState, index])

  return (
    <Box
      boxShadow={'base'}
      backgroundColor='white'
      padding={1}
      minWidth='48%'
      minHeight='99vh'
      height='100%'
      // position='relative'
      display='flex'
      flexDirection='column'
    >
      <Flex paddingLeft={2} alignItems='center'>
        <Heading fontSize='xl' fontStyle='italic' color='unison.purple'>
          Docs
        </Heading>
        {navigationType === 'history' ? (
          <DocsNavigationArrows></DocsNavigationArrows>
        ) : null}
        <Spacer></Spacer>
        <ClearButton
          onClick={onClearButtonClick}
          fadeIn={hasChanges}
        ></ClearButton>
        <SaveButton
          onClick={onSaveButtonClick}
          fadeIn={hasChanges}
          disabled={signatureError}
        ></SaveButton>
        <DocsExplanation />
        {navigationType ? (
          <DocsNavigationTypeSelector
            dispatch={dispatch}
            navigationType={navigationType}
          ></DocsNavigationTypeSelector>
        ) : null}
        <IconButton
          /* Close Button */
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
                  ref={signatureEditorParentRef}
                  // position='relative'
                >
                  <DraftEditor
                    editorState={signature}
                    ref={signatureEditorRef}
                    onChange={onChangeSignatureEditor}
                    keyBindingFn={autocompleteKeyBindingFn}
                    handleKeyCommand={handleKeyCommand}

                    // onBlur={(e: any) => {
                    //   setSignatureTouched(true)
                    // }}
                  />
                  {filteredSuggestions.length > 0 ? (
                    <TypeSuggestionList
                      typeSuggestions={filteredSuggestions}
                      selectedIndex={autocompleteState.selectedIndex}
                      left={autocompleteState.left}
                      top={autocompleteState.top}
                    ></TypeSuggestionList>
                  ) : null}
                </Code>
              </HStack>

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
              <Box marginTop={5}>
                <MonacoEditor
                  value={editorValue}
                  onChange={(_: any, v: any) => {
                    onChangeCode(v)
                  }}
                ></MonacoEditor>
              </Box>

              {/* </TabPanel>
                  <TabPanel>
                    <Code>{editorValue}</Code>
                  </TabPanel>
                </TabPanels>
              </Tabs> */}

              {provided.placeholder}
            </Box>
          )
        }}
      </Droppable>
    </Box>
  )
}
export default DocsCard
