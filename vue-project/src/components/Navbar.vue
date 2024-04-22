<template>
    <nav class="pt-2">
      
        <a class="has-text-black burger  p-4 is-size-4" :class="visibleNavbar ? 'is-active' : ''" @click="toggleNavBar">
            <i class="fa-solid fa-bars"></i>
        </a>
        <div class="navbar" v-if="visibleNavbar">
            <aside class="menu pt-6 px-4">
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>{{ $t('lists') }}</span>
                </p>
                <ul class="menu-list">
                    <NavItem :name="$t('todos')" class="fa-solid fa-list-check" @action="setFilter(FILTER_ALL)" />
                    <NavItem :name="$t('tags')" class="fa-solid fa-tags" @action="changeTab('Tags')" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-display"></i>
                    </span>
                    <span>{{ $t('view') }}</span>
                </p>
                <ul class="menu-list">
                    <NavItem :name="$t('calendar')" class="fa-solid fa-calendar" @action="changeTab('Calendar')" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-filter"></i>
                    </span>
                    <span>{{ $t('filters') }}</span>
                </p>
                <ul class="menu-list">
                    <NavItem :name="$t('today')" class="fa-regular fa-file" @action="setFilter(FILTER_TODAY)" />
                    <NavItem :name="$t('important')" class="fa-solid fa-triangle-exclamation"
                        @action="setFilter(FILTER_IMPORTANT)" />
                    <NavItem :name="$t('completed')" class="fa-solid fa-check" @action="setFilter(FILTER_COMPLETED)" />
                    <NavItem :name="$t('uncompleted')" class="fa-regular fa-circle"
                        @action="setFilter(FILTER_UNCOMPLETED)" />
                    <NavItem v-for="tag in tags" :key="tag.index" :name="tag.name" :class="[tag.icon, tag.color]"
                        @action="setFilter(tag.name)" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>{{ $t('actions') }}</span>
                </p>
                <ul class="menu-list">
                    <NavItem :name="$t('mark_all_as_completed')" class="fa-solid fa-circle-check"
                        @action="markAllAsCompleted" />
                    <NavItem :name="$t('mark_all_as_uncompleted')" class="fa-solid fa-circle"
                        @action="markAllAsUncompleted" />
                    <NavItem :name="$t('clear_all_completed')" class="fa-solid fa-broom" @action="deleteAllTodos" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-regular fa-file-code"></i>
                    </span>
                    <span>{{ $t('json') }}</span>
                </p>
                <ul class="menu-list">
                    <NavItem :name="$t('export')" class="fa-solid fa-file-export" @action="exportJSON" />
                    <NavItem :name="$t('import')" class="fa-solid fa-file-import" @action="importJSON" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-gear"></i>
                    </span>
                    <span>{{ $t('settings') }}</span>
                </p>
                <ul class="menu-list">
                    <div class="language-item">
                        <NavItem :name="$t('language')" class="fa-solid fa-language" />
                        <div class="select">
                            <select v-model="language" @change="setLanguage">
                                <option v-for="language in languages" :value="language">{{ this.$t(language) }}</option>
                            </select>
                        </div>
                    </div>
                </ul>
            </aside>
        </div>
    </nav>
</template>

<script>
import NavItem from '@/components/NavItem.vue';
export default {
    name: "Navbar",
    components: {
        NavItem
    },
    data() {
        return {
            FILTER_ALL: 1,
            FILTER_TODAY: 2,
            FILTER_COMPLETED: 3,
            FILTER_UNCOMPLETED: 4,
            FILTER_IMPORTANT: 5,
            language: "",
            languages: ['en', 'fr'],
            visibleNavbar: false,
        }
    },
    props: ['tags'],
    emits: ['filter', 'tab', 'completed', 'uncompleted', 'delete', 'export', 'import', 'language'],
    methods: {
        setFilter(type) {
            this.$emit('filter', type)
            this.visibleNavbar = false;
        },
        toggleNavBar() {
            this.visibleNavbar = !this.visibleNavbar;
        },
        changeTab(tab) {
            this.$emit('tab', tab)
            this.visibleNavbar = false;
        },
        markAllAsCompleted() {
            this.$emit('completed');
            this.visibleNavbar = false;
        },
        markAllAsUncompleted() {
            this.$emit('uncompleted');
            this.visibleNavbar = false;
        },
        deleteAllTodos() {
            this.$emit('delete');
            this.visibleNavbar = false;
        },
        exportJSON() {
            this.$emit('export');
            this.visibleNavbar = false;
        },
        importJSON() {
            this.$emit('import');
            this.visibleNavbar = false;
        },
        setLanguage() {
            this.$emit('language', this.language);
            this.visibleNavbar = false;
        },
    }
}
</script>
<style>
.language-item {
    display: flex;
}

.navbar {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: 1;
}

.burger {
    position: relative;
    z-index: 3;
}
</style>