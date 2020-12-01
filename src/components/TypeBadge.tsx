import * as React from 'react'
import { Code } from '@chakra-ui/react'
import { Itype } from './interfaces'
const TypeBadge = ({ children, ...rest }: { children: Itype }) => {
  return (
    <Code
      colorScheme={(() => {
        switch (children) {
          case 'string':
            return 'yellow'
          case 'number':
            return 'green'
          case 'boolean':
            return 'blue'
          case 'function':
            return 'purple'
          case 'object':
            return 'red'
          case 'array':
            return 'red'
          case 'undefined':
            return 'black'
          case 'null':
            return 'black'
          default:
            let x: never = children
        }
      })()}
    >
      {children}
    </Code>
  )
}

export default TypeBadge
