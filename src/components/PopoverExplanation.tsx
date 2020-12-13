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
  Tooltip,
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
          icon={
            <Tooltip label={props.label} aria-label={props.label} hasArrow>
              {/* <QuestionOutlineIcon /> */}
              <QuestionIcon />
            </Tooltip>
          }
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
