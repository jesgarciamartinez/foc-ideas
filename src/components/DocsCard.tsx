import * as React from 'react'
import {
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  Textarea,
  Code,
  IconButton,
  Box,
  Divider,
  Flex,
  Heading,
  Spacer,
  Button,
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { AddIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons'
import Card from './Card'
// import useAutocomplete from '@material-ui/lab/useAutocomplete'
// import Autosuggest from 'react-autosuggest'
// import { useCombobox, useMultipleSelection } from 'downshift'
import MonacoEditor from './Editor'
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
  convertToRaw,
  ContentState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import './draftEditorStyles.css'

// const decorator = new CompositeDecorator({[

// ]}

const defaultName = 'name'
const defaultType = '_'
const typeSuggestions: Array<{ title: Itype['type'] | 'New type' }> = [
  { title: 'string' },
  { title: 'boolean' },
  { title: 'number' },
]
const getFilteredTypeSuggestions = (
  typeSuggestions_: typeof typeSuggestions,
  inputValue: string,
) => matchSorter(typeSuggestions_, inputValue, { keys: ['title'] })

const typeToName = (x: Itype | string, n: number): string => {
  const suffix = n || ''
  switch (x) {
    case 'string':
      return 's' + suffix
    case 'number':
      return 'n' + suffix
    case 'boolean':
      return 'bool' + suffix
    case 'function':
      return ['f', 'g', 'h', 'i', 'j'][n]
    case 'object':
      return 'o' + suffix
    default:
      return 'x'
    case 'array':
      return '' //TODO
    case 'undefined':
    case 'null':
      return ''
  }
}

const getStateValueFromFunc = (
  func?: Ifunction,
): { name: string; params: any[]; description: string; code: string } => {
  return {
    name: func?.name || '',
    params: [],
    /*func?.parameterTypes
      .map(type => ({ type }))
      .concat({ type: func.returnType }) ||*/
    // { type: defaultType },
    // { type: defaultType },
    description: func?.description || '',
    code: func?.fn.toString() || '',
  }
}

const DocsCard = ({
  func,
  dispatch,
}: {
  func?: Ifunction //& { parameterTypes: Itype | '_' }
  dispatch: React.Dispatch<Action>
}) => {
  const [state, setState] = React.useState<{
    name: string
    params: any[]
    description: string
    code: string
  }>(() => getStateValueFromFunc(func))

  const [previousFunc, setPreviousFunc] = React.useState(func)
  if (previousFunc !== func) {
    //reference check on function from state.functions
    setPreviousFunc(func)
    setState(getStateValueFromFunc(func))
  }

  const { name, params, description, code } = state
  const onChangeCode = (code: string) => setState(state => ({ ...state, code }))
  const onChangeName = (name: string) => setState(state => ({ ...state, name }))
  const onChangeDescription = (description: string) =>
    setState(state => ({ ...state, description }))
  const onChangeParam = (v: string, i: number) => {
    setState(state => {
      const params = [...state.params]
      const param = params[i]
      params[i] = { type: v }
      return { ...state, params }
    })
  }
  const addParam = () => {
    setState(state => ({
      ...state,
      params: state.params.concat({ type: defaultType }),
    }))
  }

  const [typeSuggestionsList, setTypeSuggestionsList] = React.useState(
    typeSuggestions,
  )
  // const [focusedInputIndex, setFocusedInputIndex] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')
  // const onFocusInput = (i: number) => {
  //   setFocusedInputIndex(i)
  // }

  // const {
  //   isOpen,
  //   // getToggleButtonProps,
  //   // getLabelProps,
  //   getMenuProps,
  //   getInputProps,
  //   getComboboxProps,
  //   highlightedIndex,
  //   getItemProps,
  //   // selectItem,
  // } = useCombobox({
  //   inputValue,
  //   items: typeSuggestionsList,
  //   onInputValueChange: ({ inputValue }) => {
  //     console.log({ inputValue })
  //     if (!inputValue) {
  //       return
  //     }
  //     setTypeSuggestionsList(
  //       getFilteredTypeSuggestions(typeSuggestionsList, inputValue),
  //     )
  //   },
  // })
  const nameFontStyle = [defaultName, ''].includes(name) ? 'italic' : 'normal'
  const nameColor = [defaultName, ''].includes(name) ? 'gray.400' : 'normal'

  // const paramString: string = params.reduce(
  //   (acc, p) => {
  //     acc.typeCount[p.type] = acc.typeCount[p.type]
  //       ? acc.typeCount[p.type] + 1
  //       : 0
  //     const prefix = acc.result === '' ? '' : ', '
  //     acc.result = acc.result + typeToName(p.type, acc.typeCount[p.type])
  //     return acc
  //   },
  //   { result: '', typeCount: {} },
  // ).result

  const editorValue =
    code ||
    `function ${name || '_'}(${params
      .map(({ type }) => type)
      .join(',')}) {\n\n}`

  const decorator = new CompositeDecorator([
    {
      strategy(contentBlock, cb, contentState) {
        function findWithRegex(regex: any, contentBlock: any, callback: any) {
          const text = contentBlock.getText()
          let matchArr, start
          while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index
            callback(start, start + matchArr[0].length)
          }
        }
        findWithRegex(
          new RegExp(
            `(${typeSuggestions.map(({ title }) => title).join('|')})`,
            'gi',
          ),
          contentBlock,
          cb,
        )
      },
      component: (props: any) => {
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
  const [draftEditorState, setDraftEditorState] = React.useState(() =>
    EditorState.createEmpty(decorator),
  )
  const draftEditorRef = React.useRef(null)
  // const draftEditorPreviousValueRef = React.useRef('')
  // const onChangedraftEditor = (value: string) => {
  //   const arrow = '→'
  //   let newValue = value
  //   const isDeleting = draftEditorPreviousValueRef.current.length > value.length
  //   const triggerArrow = value.endsWith(',') || value.endsWith(' ')
  //   if (
  //     triggerArrow && // trigger arrow
  //     !isDeleting
  //   ) {
  //     const previousMeaningfulCharIsArrow = value
  //       .replace(',', ' ')
  //       .trimEnd()
  //       .endsWith(arrow)
  //     const previousCharIsClosingBracket = value
  //       .substr(0, value.length - 1)
  //       .endsWith('}')
  //     if (previousMeaningfulCharIsArrow) {
  //       newValue = value.substr(0, value.length - 1)
  //     } else if (previousCharIsClosingBracket && value.endsWith(' ')) {
  //       //abilities
  //       newValue = value
  //     } else {
  //       // only if last non-space or comma char is not arrow
  //       newValue = value.substr(0, value.length - 1).concat(` ${arrow} `)
  //     }
  //   }
  //   if (value.endsWith('[') && !isDeleting) {
  //     newValue = value.concat(']')
  //   }
  //   if (value.endsWith('{') && !isDeleting) {
  //     const valueWithoutLastLetter = value.substr(0, value.length - 1)
  //     const previousValueIsArrow = valueWithoutLastLetter
  //       .trimEnd()
  //       .endsWith(arrow)
  //     if (previousValueIsArrow) {
  //       newValue = valueWithoutLastLetter.trimEnd().concat('{}')
  //     } else {
  //       newValue = value.concat('}')
  //     }
  //   }

  //   setSignature2(newValue)
  // }
  // React.useEffect(() => {
  //   const isDeleting =
  //     draftEditorPreviousValueRef.current.length > signature2.length //TODO fix this
  //   if ((signature2.endsWith(']') || signature2.endsWith('}')) && !isDeleting) {
  //     const range = signature2.length - 1
  //     // signature2Ref.current!.focus()
  //     signature2Ref.current!.setSelectionRange(range, range)
  //   }
  //   signature2PreviousValueRef.current = signature2
  // }, [signature2])

  const hasChanges = true //TODO
  const noErrors = true

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
      position='relative'
      display='flex'
      flexDirection='column'
    >
      <Flex paddingLeft={2} alignItems='center'>
        <Heading fontSize='xl' fontStyle='italic' color='unison.purple'>
          Docs
        </Heading>
        <Spacer></Spacer>
        {hasChanges && noErrors && (
          <Button
            color='unison.green'
            sx={{ '&:hover': { backgroundColor: 'green.50' } }}
            variant='ghost'
            leftIcon={<CheckIcon />}
            onClick={() => {
              // dispatch({ type: 'createFunction' })
            }}
          >
            Save
          </Button>
        )}
        <PopoverExplanation label='Docs card explanation' title='Docs card'>
          Docs is an editable view of the documentation for a function
        </PopoverExplanation>
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
                  fontSize='sm'
                  width='100%'
                  paddingX={1}
                  paddingY={1}
                  as='span'
                >
                  <DraftEditor
                    editorState={draftEditorState}
                    // onChange={handleEditorChange}
                    ref={draftEditorRef}
                    onChange={(e: EditorState) => {
                      let newEditorState: EditorState
                      switch (e.getLastChangeType()) {
                        case 'insert-characters':
                          const text = e
                            .getCurrentContent()
                            .getFirstBlock()
                            .getText()
                          newEditorState = EditorState.moveFocusToEnd(
                            EditorState.push(
                              e,
                              ContentState.createFromText(text + '!'),
                              'insert-characters',
                            ),
                          )
                          break
                        default:
                          newEditorState = e
                          break
                      }

                      setDraftEditorState(newEditorState)
                    }}
                  />
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

              <Textarea
                /* DESCRIPTION */
                fontSize='xl'
                placeholder='Description'
                onChange={e => {
                  onChangeDescription(e.target.value)
                }}
                value={description}
                marginTop={5}
              ></Textarea>

              <Tabs marginTop={5}>
                <TabList>
                  <Tab>Regular editor</Tab>
                  <Tab>Structured editor</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <MonacoEditor value={editorValue}></MonacoEditor>
                  </TabPanel>
                  <TabPanel>
                    <Code>{editorValue}</Code>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {provided.placeholder}
            </Box>
          )
        }}
      </Droppable>
    </Box>
  )
}
export default DocsCard

// {
//   params.map((param, i) => (
//     <React.Fragment key={i}>
//       {i === 0 ? null : <ArrowForwardIcon></ArrowForwardIcon>}
//       <Editable
//         value={param.type}
//         // placeholder={defaultType} //TODOr
//         textColor={param.type === defaultType ? 'gray.400' : 'normal'}
//         display='inline'
//         width={param.type.length * 12 + 12 + 'px'}
//         onChange={v => onChangeParam(v, i)}
//         {...getComboboxProps()}
//       >
//         <EditablePreview />
//         <EditableInput
//           onFocus={() => onFocusInput(i)}
//           _focus={{ outline: 'none' }}
//           {...getInputProps()}
//         />
//         <ul
//           {...getMenuProps()}
//           style={{
//             position: 'absolute',
//             background: 'white',
//             borderRadius: '10%',
//             border: '1px solid gray',
//             zIndex: '20000',
//             color: 'black',
//           }}
//         >
//           {isOpen &&
//             i === focusedInputIndex &&
//             typeSuggestions.map((item, index) => (
//               <li
//                 style={
//                   highlightedIndex === index
//                     ? { backgroundColor: '#bde4ff' }
//                     : {}
//                 }
//                 key={`${item.title}${index}`}
//                 {...getItemProps({ item, index })}
//               >
//                 {item.title === 'New type' ? (
//                   <Code>{item.title}</Code>
//                 ) : (
//                   <TypeBadge typeAsString={item.title} />
//                 )}
//               </li>
//             ))}
//         </ul>
//       </Editable>
//       {i === params.length - 1 ? (
//         <IconButton
//           aria-label='Add parameter'
//           icon={<AddIcon />}
//           onClick={addParam}
//         />
//       ) : null}
//     </React.Fragment>
//   ))
// }
