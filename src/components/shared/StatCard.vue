<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    change?: string
    changePositive?: boolean
    icon?: Component
    description?: string
  }>(),
  { changePositive: true },
)

const changeClass = computed(() =>
  props.changePositive ? 'text-foreground' : 'text-destructive',
)
</script>

<template>
  <Card class="gap-3 py-5 shadow-none">
    <CardHeader class="flex flex-row items-center justify-between gap-3">
      <CardDescription class="text-sm font-medium">{{ title }}</CardDescription>
      <component :is="icon" v-if="icon" class="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <p class="text-2xl font-semibold tracking-tight tabular-nums">{{ value }}</p>
      <p v-if="change" class="mt-1 text-xs text-muted-foreground">
        <span class="font-medium" :class="changeClass">{{ change }}</span>
        {{ description ?? '' }}
      </p>
    </CardContent>
  </Card>
</template>
