<script setup lang="ts">
import { computed, inject } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ChevronsUpDown, LogOut, Settings } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import UserInfo from '@/components/UserInfo.vue'
import { SidebarContextKey } from '@/components/sidebar-context'
import { useAuthStore } from '@/stores/auth'
import { useTranslations } from '@/i18n'

const auth = useAuthStore()
const router = useRouter()
const t = useTranslations()
const props = defineProps<{ expanded?: boolean }>()
const sidebar = inject(SidebarContextKey, null)

const isCollapsed = computed(() => (props.expanded ? false : sidebar?.state.value === 'collapsed'))

const name = computed(() => auth.session?.name ?? '')
const email = computed(() => auth.session?.email ?? '')

function signOut() {
  auth.signOut()
  router.push('/login')
}
</script>

<template>
  <ul class="flex w-full min-w-0 flex-col gap-1">
    <li class="group/menu-item relative">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="group flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-sidebar-accent-foreground outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent focus-visible:ring-2 data-[state=open]:bg-sidebar-accent"
            :class="isCollapsed ? 'justify-center' : ''"
          >
            <UserInfo
              :name="name"
              :email="email"
              :compact="isCollapsed"
            />
            <ChevronsUpDown v-if="!isCollapsed" class="ml-auto size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :align="isCollapsed ? 'start' : 'end'"
          :side="isCollapsed ? 'right' : 'bottom'"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserInfo :name="name" :email="email" show-email />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <RouterLink class="block w-full cursor-pointer" to="/settings/appearance">
                <Settings class="mr-2" />
                {{ t('settings') }}
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="block w-full cursor-pointer" @click="signOut">
            <LogOut class="mr-2" />
            {{ t('logOut') }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  </ul>
</template>
