// import * as React from 'react'
// import type { IfunctionView } from './interfaces'
// import { Draggable } from 'react-beautiful-dnd'
// import { HStack, Code, Badge, Text } from '@chakra-ui/react'

// export const NonDragSmallFunctionView = ({
//   name,
//   parameterTypes,
//   returnType,
// }: IfunctionView) => (
//   <HStack padding={1} borderWidth='1px' backgroundColor={'white'}>
//     <Code backgroundColor='white'>{name}</Code>
//     <Text as='span'>:</Text>
//     <Text as={'span'}>
//       {parameterTypes.map(p => (
//         <Text as='span'>
//           <Badge>{p}</Badge> <Text as='span'> →</Text>
//         </Text>
//       ))}
//     </Text>
//     <Text as='span'>
//       <Badge>{returnType}</Badge>
//     </Text>
//   </HStack>
// )

// const SmallFunctionView = ({
//   name,
//   parameterTypes,
//   returnType,
//   index,
// }: IfunctionView & { index: number }) => {
//   return (
//     <Draggable draggableId={name + 'SideBar'} index={index}>
//       {(provided, snapshot) => (
//         <li
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}>
//           <NonDragSmallFunctionView {...{ name, parameterTypes, returnType }} />
//         </li>
//       )}
//     </Draggable>
//   )
// }
// export default SmallFunctionView
