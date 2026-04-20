import type { ReferenceElement } from 'reka-ui'
import type { Directive } from 'vue'
import type { TooltipInfo } from '../composables/useTooltip'

type TooltipBinding = string | TooltipInfo
type TooltipDirectiveBinding = DirectiveBinding<TooltipBinding>

interface ElementContext {
  handlers: { enter: () => void, leave: () => void, focus: () => void, blur: () => void }
  info: TooltipInfo
  anchor: ReferenceElement
}

const elementMap = new Map<HTMLElement, ElementContext>()
let activeElement: HTMLElement | null = null
const { openTooltip, closeTooltip, TOOLTIP_ID, state } = useTooltip()

function resolveInfo(value: TooltipBinding): TooltipInfo {
  return typeof value === 'string' ? { content: value } : { ...value }
}

function isDisabled(element: HTMLElement): boolean {
  if ((element as HTMLButtonElement).disabled) return true
  if (element.getAttribute('aria-disabled') === 'true') return true
  if (element.closest('fieldset:disabled') !== null) return true
  return element.querySelector(':disabled, [aria-disabled="true"]') !== null
}

function beforeMount(element: HTMLElement, binding: TooltipDirectiveBinding) {
  if (isDisabled(element)) return

  const info = resolveInfo(binding.value)
  const anchor = { getBoundingClientRect: () => element.getBoundingClientRect() }
  const open = () => {
    if (isDisabled(element)) return
    const context = elementMap.get(element)
    if (!context) return
    activeElement = element
    openTooltip(context.info, context.anchor)
  }
  const close = () => {
    if (activeElement !== element) return
    activeElement = null
    closeTooltip()
  }

  const handlers = {
    enter: open,
    leave: close,
    focus: open,
    blur: close,
  }

  element.addEventListener('mouseenter', handlers.enter)
  element.addEventListener('mouseleave', handlers.leave)
  element.addEventListener('focus', handlers.focus)
  element.addEventListener('blur', handlers.blur)
  element.setAttribute('aria-describedby', TOOLTIP_ID)
  elementMap.set(element, { handlers, info, anchor })
}

function unmounted(element: HTMLElement) {
  const context = elementMap.get(element)
  if (!context) return

  element.removeEventListener('mouseenter', context.handlers.enter)
  element.removeEventListener('mouseleave', context.handlers.leave)
  element.removeEventListener('focus', context.handlers.focus)
  element.removeEventListener('blur', context.handlers.blur)
  element.removeAttribute('aria-describedby')
  elementMap.delete(element)

  if (activeElement === element) {
    activeElement = null
    closeTooltip()
  }
}

function updated(element: HTMLElement, binding: TooltipDirectiveBinding) {
  if (binding.value === binding.oldValue) return

  if (!binding.value) {
    unmounted(element)
    return
  }

  const context = elementMap.get(element)
  if (!context) {
    beforeMount(element, binding)
    return
  }

  Object.assign(context.info, resolveInfo(binding.value))

  if (state.value.open && activeElement === element) {
    state.value.content = context.info.content
    state.value.side = context.info.side ?? state.value.side
    state.value.align = context.info.align ?? state.value.align
  }
}

const vTooltip: Directive<any, TooltipBinding> = { beforeMount, unmounted, updated }

export default vTooltip
