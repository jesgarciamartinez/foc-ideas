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

const EditableText = (props: EditableProps) => (
  <Editable {...props}>
    <EditablePreview />
    <EditableInput
      _focus={{
        outline: '',
      }}
    />
  </Editable>
)

const defaultName = 'name'
const defaultType = '_'
const typeSuggestions: Array<{ title: Itype | 'New type' }> = [
  { title: 'string' },
  { title: 'boolean' },
  { title: 'number' },
]
const getFilteredTypeSuggestions = (
  typeSuggestions_: typeof typeSuggestions,
  inputValue: string,
) => matchSorter(typeSuggestions_, inputValue, { keys: ['title'] })

const FunctionCreationForm = () => {
  const [state, setState] = React.useState({
    name: '',
    params: [{ type: defaultType }, { type: defaultType }],
    description: '',
    code: '',
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
        return x
      // case 'array':
      //   return '' //TODO
      // case 'undefined':
      // case 'null':
      //   return ''
    }
  }

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
  return (
    <Card>
      <EditableText
        value={name}
        onChange={onChangeName}
        placeholder={defaultName}
        fontSize='3xl'
        textColor={nameColor}
        fontStyle={nameFontStyle}
      />
      <Code fontSize='xl'>
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
                          <TypeBadge>{item.title}</TypeBadge>
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
      {/* <Input maxWidth='50%' value={'a'}></Input> */}

      {/* <Input maxWidth='50%'></Input> */}

      {/* <HStack>
        <EditableText></EditableText>
        <Text> : </Text>
        <Input maxWidth='50%'></Input>
        <ArrowForwardIcon></ArrowForwardIcon>
        <Input maxWidth='50%'></Input>
      </HStack> */}

      <Textarea
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
