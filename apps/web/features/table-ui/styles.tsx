import { createStyles } from '@egodb/ui'

interface PinnedTDProps {
  left?: number
}

type PinnedClassName = 'cell' | 'sticky' | 'last'

export const usePinnedStyles: ReturnType<typeof createStyles<PinnedClassName, PinnedTDProps>> = createStyles(
  (theme, { left }: PinnedTDProps) => ({
    cell: {
      position: 'relative',
    },
    sticky: {
      position: 'sticky',
      left: left ? left + 'px' : 0,
      top: 0,
    },
    last: {
      boxShadow: 'rgb(7 0 20 / 10%) 1px 0px 3px 0px, rgb(7 0 20 / 6%) 1px 0px 2px 0px',
    },
  }),
)