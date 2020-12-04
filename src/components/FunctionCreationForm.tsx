import * as React from 'react'
import {
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  Text,
  Input,
  Textarea,
  Code,
  EditableProps,
} from '@chakra-ui/react'
import { ArrowForwardIcon, ChevronDownIcon } from '@chakra-ui/icons'
import Card from './Card'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
// import Autosuggest from 'react-autosuggest'
import { useCombobox, useMultipleSelection } from 'downshift'
import Editor from './Editor'
import { Itype } from './interfaces'
import { matchSorter } from 'match-sorter'

const EditableText = (props: EditableProps) => (
  <Editable {...props}>
    <EditablePreview />
    <EditableInput _focus={{ outline: '2px solid gray' }} />
  </Editable>
)

const defaultName = 'name'
const defaultType = '_'

const FunctionCreationForm = ({
  typeSuggestions,
}: {
  typeSuggestions: Array<{ title: Itype | 'New type' }>
}) => {
  const [{ name, params, returnType }, setState] = React.useState({
    name: '',
    params: [{ type: defaultType, isOpen: false }],
    returnType: defaultType,
  })
  const onChangeName = (name: string) => setState(state => ({ ...state, name }))
  const onChangeParam = (v: string, i: number) => {
    setState(state => {
      const params = [...state.params]
      const param = params[i]
      params[i] = { type: v, isOpen: true }
      return { ...state, params }
    })
  }
  const onChangeReturnType = (returnType: string) => {
    setState(state => {
      return { ...state, returnType }
    })
  }
  const getFilteredTypeSuggestions = (
    typeSuggestions_: typeof typeSuggestions,
    inputValue: string,
  ) => matchSorter(typeSuggestions, inputValue, { keys: ['title'] })

  const [inputValue, setInputValue] = React.useState('')
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    inputValue,
    items: getFilteredTypeSuggestions(typeSuggestions, inputValue),
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue as string)
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
          }
      }
    },
  })

  const nameFontStyle = [defaultName, ''].includes(name) ? 'italic' : 'normal'
  const nameColor = [defaultName, ''].includes(name) ? 'gray.400' : 'normal'
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
          />{' '}
          <Text as='span'> : </Text>
          {params.map((param, i) => (
            <React.Fragment key={i}>
              {/* <EditableText
                key={i}
                value={param.type}
                // placeholder={defaultType} //TODOr
                textColor={param.type === defaultType ? 'gray.400' : 'normal'}
                display='inline'
                width={param.type.length * 12 + 12 + 'px'}
                onChange={v => onChangeParam(v, i)}
              /> */}
              <Editable
                value={param.type}
                // placeholder={defaultType} //TODOr
                textColor={param.type === defaultType ? 'gray.400' : 'normal'}
                display='inline'
                width={param.type.length * 12 + 12 + 'px'}
                onChange={v => onChangeParam(v, i)}
              >
                <EditablePreview />
                <EditableInput _focus={{ outline: 'none' }} />
              </Editable>

              {/* <Autosuggest
                suggestions={typeSuggestions}
                renderInputComponent={inputProps => {
                  return (
                    <Editable>
                      <EditablePreview />
                      <EditableInput
                        {...inputProps}
                        onChange={(e: any) => onChangeParam(e.target.value, i)}
                        _focus={{ outline: '1px solid gray' }}
                      />
                    </Editable>
                    // <input
                    //   color={'grey'}
                    //   {...inputProps}
                    //   value={param.type}
                    //   onChange={(e: any) => {
                    //     onChangeParam(e.target.value, i)
                    //   }}
                    // />
                  )
                }}
                inputProps={{
                  value: param.type,
                  // onChange(_, { newValue }) {
                  onChange(...args) {
                    // console.log(args)
                    // onChangeParam(e.target.value, i)
                  },
                }}
                getSuggestionValue={(x: any) => x}
                renderSuggestion={(v: any) => <Text>{v}</Text>}
                onSuggestionsFetchRequested={() => {}}
                onSuggestionsClearRequested={() => {}}
              /> */}
              <ArrowForwardIcon></ArrowForwardIcon>
              {/* <Text as='span' contentEditable role='textbox'></Text> */}
            </React.Fragment>
          ))}
          <EditableText
            value={returnType}
            // placeholder={defaultType} //TODOr
            textColor={returnType === defaultType ? 'gray.400' : 'normal'}
            display='inline'
            width={returnType.length * 12 + 12 + 'px'}
            onChange={onChangeReturnType}
          ></EditableText>
        </HStack>
      </Code>
      {/* <Input maxWidth='50%' value={'a'}></Input> */}

      {/* <Input maxWidth='50%'></Input> */}

      <HStack>
        <Editable defaultValue={'function name'}>
          <EditablePreview />
          <EditableInput />
        </Editable>
        <Text> : </Text>
        <Input maxWidth='50%'></Input>
        <ArrowForwardIcon></ArrowForwardIcon>
        <Input maxWidth='50%'></Input>
      </HStack>
      <Textarea></Textarea>
    </Card>
  )
}
export default FunctionCreationForm
