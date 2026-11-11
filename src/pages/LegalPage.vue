<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'

const route = useRoute()

const isPrivacy = computed(() => route.name === 'privacy' || route.path.endsWith('/privacy'))
const title = computed(() => (isPrivacy.value ? 'Privacy' : 'License terms'))
</script>

<template>
  <main class="min-h-svh bg-background text-foreground">
    <header class="border-b">
      <div class="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <RouterLink to="/" aria-label="Atera home" class="flex items-center gap-3">
          <span
            class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              class="size-5 fill-current text-sidebar-primary-foreground"
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
          </span>
          <span class="text-sm font-semibold">Atera</span>
        </RouterLink>
        <Button variant="ghost" size="sm" as-child>
          <RouterLink to="/">Back to home</RouterLink>
        </Button>
      </div>
    </header>

    <article class="mx-auto w-full max-w-3xl px-6 py-14">
      <h1 class="text-3xl font-medium tracking-tight">{{ title }}</h1>
      <div
        class="mt-8 flex flex-col gap-6 text-sm leading-6 text-muted-foreground [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-foreground"
      >
        <template v-if="isPrivacy">
          <p>
            This demo stores nothing on a server. There is no backend, no analytics script and no
            tracking pixel in this project.
          </p>
          <h2>What is stored in your browser</h2>
          <p>
            A session key, your appearance choice and your customization preferences are written to
            localStorage and cookies so the demo keeps its state between page loads. You can clear
            them at any time from your browser settings.
          </p>
          <h2>Third parties</h2>
          <p>
            The demo does not send data to third parties. Social sign-in buttons are placeholders and
            are not connected to any provider.
          </p>
        </template>
        <template v-else>
          <p>
            Atera is a demo template distributed as source code. Nothing on this site processes a
            payment, and no purchase is completed here.
          </p>
          <h2>What the license covers</h2>
          <p>
            A license grants the right to use the source code in your own projects. The Personal tier
            covers one project, the Commercial tier covers client and commercial work, and the
            Extended tier adds SaaS and resale rights. Each tier states its update window on the
            pricing section.
          </p>
          <h2>What it does not cover</h2>
          <p>
            Redistribution of the source code as a competing template or starter kit is not
            permitted, except under the Extended tier. Third-party assets keep their own licenses.
          </p>
          <h2>Demo data</h2>
          <p>
            Every record in this project is mock data generated for demonstration. It does not
            describe real people, companies, invoices or transactions.
          </p>
        </template>
      </div>
    </article>
  </main>
</template>
