import type { ReferenceElement } from 'reka-ui'

export const TOOLTIP_ID = 'vue-tooltip'
export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'
export type TooltipAlign = 'start' | 'center' | 'end'

export interface TooltipInfo {
  content: string
  side?: TooltipSide
  align?: TooltipAlign
  delay?: number
}

interface TooltipState {
  open: boolean
  content: string
  side: TooltipSide
  align: TooltipAlign
  delay: number
  anchor?: ReferenceElement
}

const state = ref<TooltipState>({
  open: false,
  content: '',
  side: 'top',
  align: 'center',
  delay: 300,
  anchor: undefined,
})
let openTimer: ReturnType<typeof setTimeout> | null = null

export function useTooltip() {
  function clearOpenTimer() {
    if (openTimer) clearTimeout(openTimer)
    openTimer = null
  }

  function openTooltip({ content, side = 'top', align = 'center', delay = 300 }: TooltipInfo, anchor: ReferenceElement) {
    clearOpenTimer()

    if (!content) throw new Error('Tooltip content is required')
    if (!anchor) throw new Error('Tooltip anchor is required')

    const apply = () => {
      state.value = { open: true, content, side, align, delay, anchor }
    }

    if (delay <= 0) {
      apply()
      return
    }

    openTimer = setTimeout(apply, delay)
  }

  function closeTooltip() {
    clearOpenTimer()
    state.value.open = false
    state.value.content = ''
    state.value.anchor = undefined
  }

  return { TOOLTIP_ID, state, openTooltip, closeTooltip }
}
