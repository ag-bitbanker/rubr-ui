<script setup>
import Button from "@/volt/Button.vue";
const { isDarkMode, toggleDarkMode } = useLayout();
import { useWeb3Store } from "@/stores/web3";
import { useAppKitTheme } from '@reown/appkit/vue'
const web3Store = useWeb3Store();
const { setThemeMode } = useAppKitTheme()

watch(isDarkMode, () => {
  setThemeMode(unref(isDarkMode) ? 'dark' : 'light');
})


</script>
<template>
  <div
    class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl border border-surface-200 dark:border-surface-700 w-full">
    <div class="flex justify-between items-center">
      <div class="flex gap-3 items-center">
       
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1100_6643)">
            <path
              d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
              fill="#222B46" />
            <path
              d="M17.3721 7C19.2344 7.00001 20.7194 7.49586 21.833 8.48145C22.9465 9.47022 23.5 10.7826 23.5 12.4209C23.4999 14.0909 22.9719 15.3993 21.9131 16.3496C21.3719 16.8352 20.7222 17.199 19.9658 17.4424L23.8184 24.1836H20.8184L17.1758 17.8096H13.8359V24.1836H10.918V17.8125H8.54297V15.4062H10.918V7H17.3721ZM13.8359 15.4023H17.3242C18.3737 15.4023 19.1766 15.1561 19.7334 14.6602C20.2902 14.1642 20.5684 13.4248 20.5684 12.4424C20.5683 11.5627 20.2967 10.8431 19.7529 10.2832C19.2089 9.7232 18.4568 9.43158 17.5 9.40918H13.8359V15.4023Z"
              fill="#F0F4FA" />
          </g>
          <defs>
            <clipPath id="clip0_1100_6643">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <span class="flex flex-col"><span
            class="text-xl font-light text-surface-700 dark:text-surface-100 leading-none">RUBR</span>
          <span class="hidden sm:flex text-sm font-medium text-primary leading-tight">Bitbanker Ruble Service Coin</span>
        </span>
      </div>
      <div class="flex items-center gap-2">
        <ClientOnly>

          <appkit-button balance="hide" />
        </ClientOnly>

        <button type="button"
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-all text-surface-900 dark:text-surface-0 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 dark:focus-visible:ring-offset-surface-950"
          @click="toggleDarkMode">
          <i :class="[
            'pi text-base',
            { 'pi-moon': isDarkMode, 'pi-sun': !isDarkMode },
          ]" />
        </button>
        <!--
        <div class="relative">
          <Button v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-scalein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true,
          }" icon="pi pi-cog" text rounded aria-label="Settings" />
          <AppConfig />
        </div>
        -->
      </div>
    </div>
  </div>
</template>
