import * as React from 'react'
import MonacoEditor from '@monaco-editor/react'
function Editor({ value }: { value: string }) {
  // function onChange(newValue: any, e: any) {
  //   console.log('onChange', newValue, e)
  // }

  // const code = this.state.code;
  const options = {
    selectOnLineNumbers: true,
  }
  return (
    <MonacoEditor
      width='100%'
      height='600px'
      language='typescript'
      theme='vs-dark'
      value={value}
      options={options}
      // onChange={onChange}
      editorDidMount={(editor, monaco) =>
        console.log('editorDidMount', { editor })
      }
    />
  )
}
export default Editor
