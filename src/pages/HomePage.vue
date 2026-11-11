<script setup lang="ts">
import type { Component, Directive } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ArrowRight,
  BarChart3,
  Check,
  FolderOpen,
  Kanban,
  Menu,
  MessageSquare,
  Moon,
  ShoppingBag,
  Sun,
  Users,
  X,
} from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { usePreferencesStore } from '@/stores/preferences'

const prefs = usePreferencesStore()

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Pricing', href: '#pricing' },
]

const metrics = [
  { value: '82', label: 'shadcn-vue components' },
  { value: '64', label: 'ready app routes' },
  { value: '3', label: 'languages included' },
  { value: '5', label: 'theme color presets' },
]

const features: { icon: Component; title: string; description: string }[] = [
  {
    icon: BarChart3,
    title: 'Pages that are already built',
    description:
      'Analytics, orders, customers, kanban, chat, mail, calendar, invoices and more. Open a route and it is ready.',
  },
  {
    icon: ShoppingBag,
    title: 'Real mock data out of the box',
    description:
      'In-memory data modules that behave like an API. No backend needed to preview any page before shipping.',
  },
  {
    icon: Users,
    title: 'Dark mode, built in and themeable',
    description:
      'Light, dark and system colors switch in one click. Five color presets and text density tokens included.',
  },
  {
    icon: MessageSquare,
    title: 'Type safe from the start',
    description:
      'TypeScript throughout the library, 21 typed data modules, route tables that error before they break.',
  },
  {
    icon: FolderOpen,
    title: '82 shadcn-vue components',
    description:
      'Button, dialog, dropdown, sheet, command, tooltip, sidebar and more. Swap one of them into your own design.',
  },
  {
    icon: Kanban,
    title: 'i18n with three languages',
    description:
      'English, German and French translations are already wired in. Add a fourth language in minutes, not days.',
  },
]

const pricingPlans = [
  {
    name: 'Personal',
    price: '$29',
    period: 'one-time',
    description: 'For side projects and personal portfolios.',
    features: ['1 project', '6 months of updates', 'Community support', 'Personal use license'],
    highlighted: false,
  },
  {
    name: 'Commercial',
    price: '$59',
    period: 'one-time',
    description: 'For client work and commercial products.',
    features: [
      'Unlimited projects',
      '1 year of updates',
      'Priority email support',
      'Commercial use license',
    ],
    highlighted: true,
  },
  {
    name: 'Extended',
    price: '$149',
    period: 'one-time',
    description: 'For SaaS products and resale rights.',
    features: [
      'Unlimited projects',
      'Lifetime updates',
      'Priority email support',
      'SaaS and resale license',
    ],
    highlighted: false,
  },
]

const footerColumns = [
  {
    title: 'Template',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pages', href: '#analytics' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Live preview', href: '/login' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Sign up', href: '/sign-up' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

const showcaseItems = [
  'Full auth flow: login, signup, 2FA, reset, lock screen',
  'Dashboard with charts, metrics, and recent activity',
  'Commerce pages with tables, forms, and invoicing',
]

const taglineWords = 'Skip three weeks of setup. Start from pages that already work.'.split(' ')
const year = new Date().getFullYear()

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const revealObservers = new WeakMap<HTMLElement, IntersectionObserver>()

const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.style.transitionDelay = `${binding.value ?? 0}s`

    if (reducedMotion) {
      el.classList.replace('opacity-0', 'opacity-100')
      el.classList.replace('translate-y-4', 'translate-y-0')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          el.classList.replace('opacity-0', 'opacity-100')
          el.classList.replace('translate-y-4', 'translate-y-0')
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    revealObservers.set(el, observer)
  },
  unmounted(el) {
    revealObservers.get(el)?.disconnect()
    revealObservers.delete(el)
  },
}

const open = ref(false)
const dark = () => prefs.resolvedAppearance === 'dark'

const taglineRef = ref<HTMLElement | null>(null)
const taglineVisible = ref(reducedMotion)
let taglineObserver: IntersectionObserver | undefined

onMounted(() => {
  if (reducedMotion || !taglineRef.value) return
  taglineObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        taglineVisible.value = true
        taglineObserver?.disconnect()
      }
    },
    { rootMargin: '-96px' },
  )
  taglineObserver.observe(taglineRef.value)
})

onUnmounted(() => {
  taglineObserver?.disconnect()
})
</script>

<template>
  <main class="min-h-svh bg-background text-foreground">
    <header class="sticky top-4 z-50 mx-auto w-full max-w-4xl px-4">
      <nav
        aria-label="Main"
        class="flex items-center justify-between rounded-xl border bg-background/80 px-4 py-3 shadow-sm backdrop-blur-md"
      >
        <RouterLink to="/" class="flex items-center" aria-label="Atera home">
          <div class="flex items-center">
            <div
              class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <svg
                viewBox="0 0 256 256"
                xmlns="http://www.w3.org/2000/svg"
                class="size-5 fill-current"
              >
                <g fill="currentColor">
                  <rect x="110" y="12" width="33" height="33" />
                  <rect x="61" y="61" width="33" height="33" />
                  <rect x="159" y="61" width="33" height="33" />
                  <rect x="12" y="110" width="33" height="33" />
                  <rect x="61" y="110" width="33" height="33" />
                  <rect x="110" y="110" width="33" height="33" />
                  <rect x="159" y="110" width="33" height="33" />
                  <rect x="208" y="110" width="33" height="33" />
                  <rect x="12" y="159" width="33" height="33" />
                  <rect x="208" y="159" width="33" height="33" />
                  <rect x="12" y="208" width="33" height="33" />
                  <rect x="208" y="208" width="33" height="33" />
                </g>
              </svg>
            </div>
            <div class="ml-3 text-left text-sm leading-none">
              <span class="truncate font-semibold">Atera</span>
              <span class="mt-1 block truncate text-2xs text-muted-foreground">Dashboard</span>
            </div>
          </div>
        </RouterLink>
        <div class="hidden items-center gap-6 md:flex">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            {{ link.label }}
          </a>
        </div>
        <div class="hidden items-center gap-2 md:flex">
          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
            :aria-label="dark() ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="prefs.toggleAppearance"
          >
            <Sun v-if="dark()" class="size-4" />
            <Moon v-else class="size-4" />
          </button>
          <Button as-child variant="ghost" size="sm">
            <RouterLink to="/login">Log in</RouterLink>
          </Button>
          <Button as-child size="sm">
            <RouterLink to="/sign-up">Get the template</RouterLink>
          </Button>
        </div>
        <button
          type="button"
          class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground md:hidden"
          :aria-expanded="open"
          aria-label="Toggle navigation menu"
          @click="open = !open"
        >
          <X v-if="open" class="size-4" />
          <Menu v-else class="size-4" />
        </button>
      </nav>
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="open"
          class="absolute inset-x-4 top-full mt-2 flex flex-col gap-1 rounded-xl border bg-background/95 p-4 shadow-md backdrop-blur-md md:hidden"
        >
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
            @click="open = false"
          >
            {{ link.label }}
          </a>
          <div class="mt-2 flex items-center gap-2 border-t pt-3">
            <button
              type="button"
              class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground"
              :aria-label="dark() ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="prefs.toggleAppearance"
            >
              <Sun v-if="dark()" class="size-4" />
              <Moon v-else class="size-4" />
            </button>
            <Button as-child variant="outline" class="flex-1">
              <RouterLink to="/login" class="w-full">Log in</RouterLink>
            </Button>
            <Button as-child class="flex-1">
              <RouterLink to="/sign-up" class="w-full">Get the template</RouterLink>
            </Button>
          </div>
        </div>
      </Transition>
    </header>

    <section class="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div class="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <h1
          v-reveal
          class="text-4xl font-semibold tracking-tight text-balance opacity-0 translate-y-4 transition duration-700 sm:text-5xl"
        >
          A Vue dashboard template for developers
        </h1>
        <p
          v-reveal="0.08"
          class="mt-5 text-lg text-pretty text-muted-foreground opacity-0 translate-y-4 transition duration-700"
        >
          Atera includes typed admin pages, in-memory sample data, and theme controls, ready to
          explore and adapt to your project.
        </p>
        <div
          v-reveal="0.16"
          class="mt-8 flex flex-col items-center gap-3 opacity-0 translate-y-4 transition duration-700 sm:flex-row"
        >
          <Button as-child size="lg">
            <RouterLink to="/sign-up">
              Get the template
              <ArrowRight class="size-4" />
            </RouterLink>
          </Button>
          <Button as-child variant="outline" size="lg">
            <RouterLink to="/login">Browse the demo</RouterLink>
          </Button>
        </div>
        <p
          v-reveal="0.24"
          class="mt-4 text-sm text-muted-foreground opacity-0 translate-y-4 transition duration-700"
        >
          One-time purchase. Free updates for 6 months.
        </p>
      </div>
      <div v-reveal="0.12" class="mt-14 w-full opacity-0 translate-y-4 transition duration-700">
        <img
          src="/dashboard-preview.png"
          alt="A screenshot of Atera's analytics dashboard"
          class="w-full rounded-xl border object-cover shadow-sm"
          :class="dark() && 'brightness-75 contrast-125 saturate-75'"
        />
      </div>
    </section>

    <section class="border-y bg-muted/40" aria-label="Key numbers">
      <div class="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div
          v-for="(metric, index) in metrics"
          :key="metric.label"
          v-reveal="index * 0.08"
          class="text-center opacity-0 translate-y-4 transition duration-700"
        >
          <p class="text-3xl font-bold tracking-tight">{{ metric.value }}</p>
          <p class="mt-1 text-sm text-muted-foreground">{{ metric.label }}</p>
        </div>
      </div>
    </section>

    <section id="features" class="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
      <div
        v-reveal
        class="mx-auto max-w-[680px] text-center opacity-0 translate-y-4 transition duration-700"
      >
        <h2 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Every page your admin panel needs, already built
        </h2>
        <p class="mt-4 text-pretty text-muted-foreground">
          Login flows, dashboard, analytics, commerce, kanban, chat, calendar, settings — each one
          wired to typed mock data so you can see it working before you write a line.
        </p>
      </div>
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          v-reveal="(index % 3) * 0.08"
          class="opacity-0 translate-y-4 transition duration-700"
        >
          <div
            class="flex h-full flex-col gap-3 rounded-xl border bg-background p-6 transition-colors duration-300 hover:bg-accent/40"
          >
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <component :is="feature.icon" class="size-5" />
            </div>
            <h3 class="text-lg font-semibold tracking-tight">{{ feature.title }}</h3>
            <p class="text-sm leading-6 text-pretty text-muted-foreground">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="analytics" class="scroll-mt-24 bg-muted/40">
      <div class="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-24 lg:grid-cols-2">
        <div class="opacity-0 translate-y-4 transition duration-700" v-reveal>
          <h2 class="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Open any page and it already works
          </h2>
          <p class="mt-4 max-w-[680px] text-pretty text-muted-foreground">
            Each route comes with its own mock data module and typed API. Click around the demo and
            see how it is put together.
          </p>
          <ul class="mt-6 flex flex-col gap-3">
            <li v-for="item in showcaseItems" :key="item" class="flex items-start gap-3 text-sm">
              <span
                class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <Check class="size-3" />
              </span>
              {{ item }}
            </li>
          </ul>
          <Button as-child variant="link" class="mt-8 px-0">
            <RouterLink to="/login">
              Open the live preview
              <ArrowRight class="size-4" />
            </RouterLink>
          </Button>
        </div>
        <div class="opacity-0 translate-y-4 transition duration-700" v-reveal="0.1">
          <img
            src="/dashboard-preview.png"
            alt="A screenshot of Atera's analytics dashboard"
            class="w-full rounded-xl border object-cover shadow-sm"
            :class="dark() && 'brightness-75 contrast-125 saturate-75'"
          />
        </div>
      </div>
    </section>

    <section class="mx-auto w-full max-w-4xl px-6 py-28">
      <p
        ref="taglineRef"
        class="text-center text-4xl font-bold tracking-tight text-balance text-pretty sm:text-5xl"
      >
        <span
          v-for="(word, index) in taglineWords"
          :key="index"
          class="inline-block transition-opacity duration-700"
          :class="taglineVisible ? 'opacity-100' : 'opacity-25'"
          :style="{ transitionDelay: reducedMotion ? '0s' : `${index * 0.08}s` }"
        >{{ word }}{{ index < taglineWords.length - 1 ? '\u00A0' : '' }}</span>
      </p>
    </section>

    <section id="pricing" class="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
      <div
        v-reveal
        class="mx-auto max-w-[680px] text-center opacity-0 translate-y-4 transition duration-700"
      >
        <h2 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          One purchase, every page included
        </h2>
        <p class="mt-4 text-pretty text-muted-foreground">
          Pay once and use Atera in as many projects as your license allows. No subscriptions, no
          per-seat pricing.
        </p>
      </div>
      <div class="mt-14 grid gap-5 lg:grid-cols-3">
        <div
          v-for="(plan, index) in pricingPlans"
          :key="plan.name"
          v-reveal="index * 0.08"
          class="h-full opacity-0 translate-y-4 transition duration-700"
        >
          <div
            class="flex h-full flex-col rounded-xl border bg-background p-6"
            :class="plan.highlighted && 'border-primary shadow-sm'"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold tracking-tight">{{ plan.name }}</h3>
              <span
                v-if="plan.highlighted"
                class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                Most popular
              </span>
            </div>
            <div class="mt-4 flex items-baseline gap-1">
              <span class="text-4xl font-bold tracking-tight">{{ plan.price }}</span>
              <span class="text-sm text-muted-foreground">{{ plan.period }}</span>
            </div>
            <p class="mt-3 text-sm text-pretty text-muted-foreground">{{ plan.description }}</p>
            <ul class="mt-6 flex flex-1 flex-col gap-3">
              <li v-for="item in plan.features" :key="item" class="flex items-start gap-3 text-sm">
                <Check class="mt-0.5 size-4 shrink-0 text-primary" />
                {{ item }}
              </li>
            </ul>
            <Button as-child :variant="plan.highlighted ? 'default' : 'outline'" class="mt-8 w-full">
              <RouterLink to="/sign-up">Buy {{ plan.name }} license</RouterLink>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto w-full max-w-6xl px-6 pb-24">
      <div class="opacity-0 translate-y-4 transition duration-700" v-reveal>
        <div
          class="flex flex-col items-center gap-6 rounded-xl border bg-primary px-8 py-16 text-center text-primary-foreground"
        >
          <h2 class="max-w-[680px] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Your next admin panel starts here
          </h2>
          <p class="max-w-[520px] text-pretty opacity-80">
            Start with prebuilt admin pages, typed sample data, and theme controls in one Vue
            project.
          </p>
          <div class="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              as-child
              size="lg"
              variant="secondary"
              class="bg-background text-foreground hover:bg-background/90"
            >
              <RouterLink to="/sign-up">
                Get the template
                <ArrowRight class="size-4" />
              </RouterLink>
            </Button>
            <Button
              as-child
              size="lg"
              variant="ghost"
              class="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <RouterLink to="/login">Browse the demo</RouterLink>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <footer class="border-t bg-muted/40">
      <div class="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <RouterLink to="/" aria-label="Atera home" class="inline-flex items-center">
            <div class="flex items-center">
              <div
                class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <svg
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5 fill-current"
                >
                  <g fill="currentColor">
                    <rect x="110" y="12" width="33" height="33" />
                    <rect x="61" y="61" width="33" height="33" />
                    <rect x="159" y="61" width="33" height="33" />
                    <rect x="12" y="110" width="33" height="33" />
                    <rect x="61" y="110" width="33" height="33" />
                    <rect x="110" y="110" width="33" height="33" />
                    <rect x="159" y="110" width="33" height="33" />
                    <rect x="208" y="110" width="33" height="33" />
                    <rect x="12" y="159" width="33" height="33" />
                    <rect x="208" y="159" width="33" height="33" />
                    <rect x="12" y="208" width="33" height="33" />
                    <rect x="208" y="208" width="33" height="33" />
                  </g>
                </svg>
              </div>
              <div class="ml-3 text-left text-sm leading-none">
                <span class="truncate font-semibold">Atera</span>
                <span class="mt-1 block truncate text-2xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          </RouterLink>
          <p class="mt-4 max-w-xs text-sm text-pretty text-muted-foreground">
            A Vue admin dashboard template with every page already built.
          </p>
        </div>
        <nav v-for="column in footerColumns" :key="column.title" :aria-label="column.title">
          <p class="text-sm font-semibold">{{ column.title }}</p>
          <ul class="mt-4 flex flex-col gap-2">
            <li v-for="link in column.links" :key="link.label">
              <a
                v-if="link.href.startsWith('#')"
                :href="link.href"
                class="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {{ link.label }}
              </a>
              <RouterLink
                v-else
                :to="link.href"
                class="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
      <div class="border-t">
        <p class="mx-auto w-full max-w-6xl px-6 py-6 text-xs text-muted-foreground">
          &copy; {{ year }} Atera. All rights reserved.
        </p>
      </div>
    </footer>
  </main>
</template>
