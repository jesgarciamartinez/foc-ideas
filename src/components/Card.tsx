import * as React from 'react'
import { Box } from '@chakra-ui/react'
const Card = ({ children }: { children?: any }) => {
  return (
    // <Droppable droppableId='Card'>
    //   {(provided, snapshot) => {
    //     return (
    <Box
      // ref={provided.innerRef}
      // {...provided.droppableProps}
      padding='4'
      boxShadow={'base'}
      minWidth={'48%'} //@TODO prevent Yscroll another way
      minHeight='100%'
      backgroundColor='white'
    >
      {children}
      {/* {provided.placeholder} */}
    </Box>
    //     )
    //   }}
    // </Droppable>
  )
}
export default Card
