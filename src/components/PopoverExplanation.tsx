import { QuestionIcon, QuestionOutlineIcon } from '@chakra-ui/icons'
import {
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
  PopoverBodyProps,
} from '@chakra-ui/react'
import React from 'react'

const PopoverExplanation = (props: {
  children: PopoverBodyProps['children']
  label: string
  title: string
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label={props.label}
          // icon={<QuestionIcon />}
          icon={<QuestionOutlineIcon />}
          size='lg'
          colorScheme='purple'
          color='unison.purple'
          variant='ghost'
          sx={{
            '&:hover': {
              color: 'unison.aqua',
            },
          }}
        />
      </PopoverTrigger>
      {/* <PopoverContent borderColor='unison.purple'> */}
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{props.title}</PopoverHeader>
        <PopoverBody>{props.children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default PopoverExplanation
