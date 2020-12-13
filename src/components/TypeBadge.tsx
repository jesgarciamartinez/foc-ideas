import * as React from 'react'
import { Code, useTheme } from '@chakra-ui/react'
import { Itype } from './interfaces'
const TypeBadge = ({
  typeAsString,
  ...rest
}: {
  typeAsString: Itype['type']
}) => {
  const {
    colors: {
      unison: { orange, yellow },
    },
  } = useTheme()

  return (
    <Code
      paddingX={1}
      paddingY={0.5}
      // colorScheme={'yellow'}
      sx={
        {
          string: { color: 'unison.darkOrange', backgroundColor: 'yellow.100' },
          number: {
            color: 'unison.darkGreen',
            backgroundColor: 'green.100',
          },
          boolean: { color: 'unison.pink', backgroundColor: 'pink.100' },
          function: { color: 'unison.purple', backgroundColor: 'purple.100' },
          object: { color: 'black', backgroundColor: 'gray.100' },
          array: { color: 'black', backgroundColor: 'gray.100' },
          undefined: { color: 'black', backgroundColor: 'gray.100' },
          null: { color: 'black', backgroundColor: 'gray.100' },
        }[typeAsString]
      }
      rounded={'base'}
      //   colorScheme={(() => {
      //     switch (typeAsString) {
      //       case 'string':
      //         return ''
      //       case 'number':
      //         return 'green'
      //       case 'boolean':
      //         return 'blue'
      //       case 'function':
      //         return 'purple'
      //       case 'object':
      //         return 'red'
      //       case 'array':
      //         return 'red'
      //       case 'undefined':
      //         return 'black'
      //       case 'null':
      //         return 'black'
      //       default:
      //         let x: never = typeAsString
      //     }
      //   })()}
    >
      {typeAsString}
    </Code>
  )
}

export default TypeBadge
