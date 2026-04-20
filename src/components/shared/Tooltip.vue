<template>
  <TooltipProvider>
    <TooltipRoot :open="state.open" @update:open="(v) => !v && closeTooltip()">
      <TooltipTrigger as="span" :reference="state.anchor" aria-hidden="true" :tabindex="-1" style="display: none" />
      <TooltipPortal>
        <TooltipContent
          :id="TOOLTIP_ID"
          class="bg-white shadow-sm px-4 py-3 rounded-md text-sm leading-none select-none" :side="state.side" :align="state.align" :side-offset="2">
          {{ state.content }}
          <TooltipArrow class="fill-white stroke-gray-200" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
const { TOOLTIP_ID, state, closeTooltip } = useTooltip()
</script>
