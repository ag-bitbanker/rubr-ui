<template>
    <DataView
        unstyled
        :pt="theme"
        :pt-options="{
            mergeProps: ptViewMerge
        }"
    >
        <template #paginatorcontainer="{ page, pageCount, pageLinks, changePageCallback, firstPageCallback, lastPageCallback, prevPageCallback, nextPageCallback }">
            <div class="flex flex-wrap gap-2 items-center justify-center">
                <SecondaryButton text rounded :disabled="page === 0" @click="firstPageCallback">
                    <template #icon>
                        <AngleDoubleLeftIcon />
                    </template>
                </SecondaryButton>
                <SecondaryButton text rounded :disabled="page === 0" @click="prevPageCallback">
                    <template #icon>
                        <AngleLeftIcon />
                    </template>
                </SecondaryButton>
                <div class="items-center justify-center gap-2 hidden sm:flex">
                    <SecondaryButton v-for="pageLink of pageLinks" :key="pageLink" :text="page + 1 !== pageLink" rounded :class="['shrink-0 min-w-10 h-10', { 'bg-highlight!': page + 1 === pageLink }]" @click="() => changePageCallback(pageLink - 1)"
                        >{{ pageLink }}
                    </SecondaryButton>
                </div>
                <SecondaryButton text rounded :disabled="page === pageCount! - 1" @click="nextPageCallback">
                    <template #icon>
                        <AngleRightIcon />
                    </template>
                </SecondaryButton>
                <SecondaryButton text rounded :disabled="page === pageCount! - 1" @click="lastPageCallback">
                    <template #icon>
                        <AngleDoubleRightIcon />
                    </template>
                </SecondaryButton>
            </div>
        </template>
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </DataView>
</template>

<script setup lang="ts">
import AngleDoubleLeftIcon from '@primevue/icons/angledoubleleft';
import AngleDoubleRightIcon from '@primevue/icons/angledoubleright';
import AngleLeftIcon from '@primevue/icons/angleleft';
import AngleRightIcon from '@primevue/icons/angleright';
import DataView, { type DataViewPassThroughOptions, type DataViewProps } from 'primevue/dataview';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';

interface Props extends /* @vue-ignore */ DataViewProps {}
defineProps<Props>();

const theme = ref<DataViewPassThroughOptions>({
    root: `border-none`,
    header: `py-3 px-4 border-b border-surface-200 dark:border-surface-700 
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0`,
    content: `bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0`,
    emptyMessage: ``,
    footer: `py-3 px-4 border-t border-surface-200 dark:border-surface-700 
        bg-surface-0 dark:bg-surface-900
        text-surface-700 dark:text-surface-0`,
    pcPaginator: {
        root: `flex items-center justify-center flex-wrap py-2 px-4 rounded-md gap-1
        bg-surface-0 dark:bg-surface-900 text-surface-700 dark:text-surface-0`
    }
});
</script>
