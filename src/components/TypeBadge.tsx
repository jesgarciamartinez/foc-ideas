import * as React from 'react'
import { Code, CodeProps, TextProps, useTheme } from '@chakra-ui/react'
import { Itype } from './interfaces'

const TypeBadge = ({
  typeAsString,
  // fontSize,
  as,
  children,
}: {
  typeAsString: Itype['type']
  // fontSize?: CodeProps['fontSize']
  as?: CodeProps['as']
  children?: any
  // rest?: CodeProps
}) => {
  // const {
  //   colors: {
  //     unison: { orange, yellow },
  //   },
  // } = useTheme()

  return (
    <Code
      as={as}
      // fontSize={fontSize}
      // paddingX={1}
      // paddingY={0.5}
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
    >
      {children ?? typeAsString}
    </Code>
  )
}

export default TypeBadge
