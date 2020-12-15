import * as React from 'react'
import {
  ControlledEditor,
  ControlledEditorOnChange,
} from '@monaco-editor/react'
function Editor({
  value,
  onChange,
}: {
  value: string
  onChange: ControlledEditorOnChange
}) {
  // function onChange(newValue: any, e: any) {
  //   console.log('onChange', newValue, e)
  // }

  // const code = this.state.code;
  const options: { lineNumbers: 'off'; minimap: { enabled: boolean } } = {
    // selectOnLineNumbers: true,
    minimap: { enabled: false },
    lineNumbers: 'off',
  }
  return (
    <ControlledEditor
      width='100%'
      height='30vh'
      language='javascript'
      theme='vs-light'
      value={value}
      options={options}
      onChange={onChange}
      // editorDidMount={(editor, monaco) =>
      //   console.log('editorDidMount', { editor, monaco })
      // }
    />
  )
}
export default Editor
