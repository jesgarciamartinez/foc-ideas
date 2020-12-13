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
      sx={{ color: orange, backgroundColor: yellow }}
      // borderLeftRadius='20%'
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
