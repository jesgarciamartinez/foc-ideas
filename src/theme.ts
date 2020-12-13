import { extendTheme } from '@chakra-ui/react'

export default extendTheme({
  styles: {
    global: {
      html: {
        minWidth: '860px',
        '*:focus': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
      },
    },
  },
  shadows: {
    outline: 'none',
  },
  colors: {
    unison: {
      purple: '#520066',
      lightPurple: '#8f228f',
      aqua: '#3cd6b7',
      limegreen: '#88cc00',
      green: '#008f30',
      yellow: '#ffc41f',
      orange: '#ff8800',
      pink: '#ff4756',
      lightblue: '#00adeb',
      blue: '#0951e0',
      darkblue: '#00018f',
      gray: '#616c77',
      //derived:
    },
  },
})

/*
colors:
  - name: 'lightpurple'
    base: '#8f228f'
  - name: 'purple'
    base: '#520066'

  - name: 'aqua'
    base: '#3cd6b7'
  - name: 'limegreen'
    base: '#88cc00'
  - name: 'green'
    base: '#008f30'

  - name: 'yellow'
    base: '#ffc41f'
  - name: 'orange'
    base: '#ff8800'
  - name: 'pink'
    base: '#ff4756'

  - name: 'lightblue'
    base: '#00adeb'
  - name: 'blue'
    base: '#0951e0'
  - name: 'darkblue'
    base: '#00018f'

  - name: 'black'
    base: 'black'
  - name: 'white'
    base: 'white'
  - name: 'gray'
    base: '#616c77'


      
@import 'data/colors.yml'; // $colors

$tones: (
  xxx-dark:  ( mix: 'shade', percentage: 80% ),
  xx-dark:   ( mix: 'shade', percentage: 55% ),
  x-dark:    ( mix: 'shade', percentage: 45% ),
  dark:      ( mix: 'shade', percentage: 20% ),
  mid:       ( mix: 'tint',  percentage: 20% ),
  light:     ( mix: 'tint',  percentage: 45% ),
  x-light:   ( mix: 'tint',  percentage: 60% ),
  xx-light:  ( mix: 'tint',  percentage: 75% ),
  xxx-light: ( mix: 'tint',  percentage: 90% )
);

$UCpalettes: generate-palettes($colors, $tones);

@function palette($name, $tone: 'base') {
  $palette: map-get($UCpalettes, $name);
  $color: map-get($palette, $tone);
  @return $color;
}
*/
