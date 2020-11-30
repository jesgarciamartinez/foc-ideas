import * as React from 'react'
import type { IfunctionView } from './interfaces'
import { VStack, Divider, Badge, Text } from '@chakra-ui/react'
import './cloneStyles.css'

const BrickFunctionView = ({
  name,
  parameterTypes,
  returnType,
}: IfunctionView) => {
  return (
    <VStack width='50%' borderWidth='1px' borderRadius='lg'>
      {parameterTypes.map((p, i) => (
        <Badge key={i}>{p}</Badge>
      ))}
      <Divider></Divider>
      <Text>{name}</Text>
      <Divider></Divider>
      <Badge>{returnType}</Badge>
    </VStack>
  )
}

export default BrickFunctionView
