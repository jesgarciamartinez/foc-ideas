import * as React from 'react'
import {
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  Textarea,
  Code,
  EditableProps,
  IconButton,
  Input,
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { AddIcon, ArrowForwardIcon, ChevronDownIcon } from '@chakra-ui/icons'
import Card from './Card'
// import useAutocomplete from '@material-ui/lab/useAutocomplete'
// import Autosuggest from 'react-autosuggest'
import { useCombobox, useMultipleSelection } from 'downshift'
import Editor from './Editor'
import { Itype, Ifunction } from './interfaces'
import { matchSorter } from 'match-sorter'
import TypeBadge from './TypeBadge'
import EditableText from './EditableText'

const defaultName = 'name'
const defaultType = '_'
const typeSuggestions: Array<{ title: Itype | 'New type' }> = [
  { title: { type: 'string' } },
  { title: { type: 'boolean', value: true } },
  { title: { type: 'number' } },
]
const getFilteredTypeSuggestions = (
  typeSuggestions_: typeof typeSuggestions,
  inputValue: string,
) => matchSorter(typeSuggestions_, inputValue, { keys: ['title'] })

// const typeToName = (x: Itype | string, n: number): string => {
//   const suffix = n || ''
//   switch (x) {
//     case 'string':
//       return 's' + suffix
//     case 'number':
//       return 'n' + suffix
//     case 'boolean':
//       return 'bool' + suffix
//     case 'function':
//       return ['f', 'g', 'h', 'i', 'j'][n]
//     case 'object':
//       return 'o' + suffix
//     default:
//       return x
// case 'array':
//   return '' //TODO
// case 'undefined':
// case 'null':
//   return ''
//   }
//

const FunctionCreationForm = ({
  func,
}: {
  func?: Ifunction & { parameterTypes: Itype | '_' }
}) => {
  const [state, setState] = React.useState({
    name: func?.name || '',
    params: /*func?.parameterTypes
      .map(type => ({ type }))
      .concat({ type: func.returnType }) ||*/ [
      { type: defaultType },
      { type: defaultType },
    ],
    description: func?.description || '',
    code: func?.fn.toString() || '',
  })
  const { name, params, description, code } = state
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
  const [focusedInputIndex, setFocusedInputIndex] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')
  const onFocusInput = (i: number) => {
    setFocusedInputIndex(i)
  }

  const {
    isOpen,
    // getToggleButtonProps,
    // getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    // selectItem,
  } = useCombobox({
    inputValue,
    items: typeSuggestionsList,
    onInputValueChange: ({ inputValue }) => {
      console.log({ inputValue })
      if (!inputValue) {
        return
      }
      setTypeSuggestionsList(
        getFilteredTypeSuggestions(typeSuggestionsList, inputValue),
      )
    },
  })
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

  const editorValue = `function ${name}(${params
    .map(({ type }) => type)
    .join(',')}) {\n}`

  const [signature2, setSignature2] = React.useState('')
  const signature2Ref = React.useRef<HTMLInputElement>(null)
  const signature2PreviousValueRef = React.useRef('')
  const onChangeSignature2 = (value: string) => {
    const arrow = '→'
    let newValue = value
    const isDeleting = signature2PreviousValueRef.current.length > value.length
    const triggerArrow = value.endsWith(',') || value.endsWith(' ')
    if (
      triggerArrow && // trigger arrow
      !isDeleting
    ) {
      const previousMeaningfulCharIsArrow = value
        .replace(',', ' ')
        .trimEnd()
        .endsWith(arrow)
      const previousCharIsClosingBracket = value
        .substr(0, value.length - 1)
        .endsWith('}')
      if (previousMeaningfulCharIsArrow) {
        newValue = value.substr(0, value.length - 1)
      } else if (previousCharIsClosingBracket && value.endsWith(' ')) {
        //abilities
        newValue = value
      } else {
        // only if last non-space or comma char is not arrow
        newValue = value.substr(0, value.length - 1).concat(` ${arrow} `)
      }
    }
    if (value.endsWith('[') && !isDeleting) {
      newValue = value.concat(']')
    }
    if (value.endsWith('{') && !isDeleting) {
      const valueWithoutLastLetter = value.substr(0, value.length - 1)
      const previousValueIsArrow = valueWithoutLastLetter
        .trimEnd()
        .endsWith(arrow)
      if (previousValueIsArrow) {
        newValue = valueWithoutLastLetter.trimEnd().concat('{}')
      } else {
        newValue = value.concat('}')
      }
    }

    setSignature2(newValue)
  }
  React.useEffect(() => {
    const isDeleting =
      signature2PreviousValueRef.current.length > signature2.length //TODO fix this
    if ((signature2.endsWith(']') || signature2.endsWith('}')) && !isDeleting) {
      const range = signature2.length - 1
      // signature2Ref.current!.focus()
      signature2Ref.current!.setSelectionRange(range, range)
    }
    signature2PreviousValueRef.current = signature2
  }, [signature2])

  return (
    <Card>
      <EditableText
        /* NAME */
        value={name}
        onChange={onChangeName}
        placeholder={defaultName}
        fontSize='3xl'
        textColor={nameColor}
        fontStyle={nameFontStyle}
      />
      <Code fontSize='xl'>
        {/* SIGNATURE */}
        <HStack>
          <EditableText
            as='span'
            placeholder={defaultName}
            fontStyle={nameFontStyle}
            width={(name || defaultName).length * 12 + 12 + 'px'}
            value={name}
            textColor={nameColor}
            onChange={onChangeName}
          />
          <Text as='span'>: </Text>
          {params.map((param, i) => (
            <React.Fragment key={i}>
              {i === 0 ? null : <ArrowForwardIcon></ArrowForwardIcon>}
              <Editable
                value={param.type}
                // placeholder={defaultType} //TODOr
                textColor={param.type === defaultType ? 'gray.400' : 'normal'}
                display='inline'
                width={param.type.length * 12 + 12 + 'px'}
                onChange={v => onChangeParam(v, i)}
                {...getComboboxProps()}
              >
                <EditablePreview />
                <EditableInput
                  onFocus={() => onFocusInput(i)}
                  _focus={{ outline: 'none' }}
                  {...getInputProps()}
                />
                <ul
                  {...getMenuProps()}
                  style={{
                    position: 'absolute',
                    background: 'white',
                    borderRadius: '10%',
                    border: '1px solid gray',
                    zIndex: '20000',
                    color: 'black',
                  }}
                >
                  {isOpen &&
                    i === focusedInputIndex &&
                    typeSuggestions.map((item, index) => (
                      <li
                        style={
                          highlightedIndex === index
                            ? { backgroundColor: '#bde4ff' }
                            : {}
                        }
                        key={`${item.title}${index}`}
                        {...getItemProps({ item, index })}
                      >
                        {item.title === 'New type' ? (
                          <Code>{item.title}</Code>
                        ) : (
                          <TypeBadge typeAsString={item.title.type} />
                        )}
                      </li>
                    ))}
                </ul>
              </Editable>
              {i === params.length - 1 ? (
                <IconButton
                  aria-label='Add parameter'
                  icon={<AddIcon />}
                  onClick={addParam}
                />
              ) : null}
            </React.Fragment>
          ))}
        </HStack>
      </Code>

      <Code fontSize='xl' display='block' marginTop={2}>
        {/* SIGNATURE 2 */}
        <EditableText
          ref={signature2Ref}
          placeholder={defaultName}
          fontStyle={nameFontStyle}
          width={(signature2 || defaultName).length * 12 + 12 + 'px'}
          maxWidth='100%'
          value={signature2}
          textColor={nameColor}
          onChange={onChangeSignature2}
        />
        {/* <Input
          onChange={e => onChangeSignature2(e.target.value)}
          ref={signature2Ref}
          placeholder={defaultName}
          fontStyle={nameFontStyle}
          width={(signature2 || defaultName).length * 12 + 12 + 'px'}
          maxWidth='100%'
          value={signature2}
        ></Input> */}
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
            <Editor value={editorValue}></Editor>
          </TabPanel>
          <TabPanel>
            <Code>{editorValue}</Code>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}
export default FunctionCreationForm
