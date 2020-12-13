import * as React from 'react'
import {
  EditableProps,
  Editable,
  EditablePreview,
  EditableInput,
  forwardRef,
} from '@chakra-ui/react'

const EditableText = forwardRef((props: EditableProps, ref) => (
  <Editable {...props}>
    <EditablePreview />
    <EditableInput
      ref={ref}
      _focus={{
        outline: '',
      }}
    />
  </Editable>
))

export default EditableText
