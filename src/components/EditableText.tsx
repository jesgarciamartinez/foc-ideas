import * as React from 'react'
import {
  EditableProps,
  Editable,
  EditablePreview,
  EditableInput,
} from '@chakra-ui/react'

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

export default EditableText
