<template>
    <nav>
        <i class="fa-solid fa-bars is-size-4 p-4 burger" @click="toggleNavBar"></i>
        <div v-if="visibleNavbar" class="navbar">
            <aside class="menu pt-6 px-4">
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>Filters</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="All" class="fa-regular fa-file" @action="setFilter(FILTER_ALL)" />
                    <NavItem name="Today" class="fa-regular fa-file" @action="setFilter(FILTER_TODAY)" />
                    <NavItem name="Important" class="fa-solid fa-triangle-exclamation"
                        @action="setFilter(FILTER_IMPORTANT)" />
                    <NavItem name="Completed" class="fa-solid fa-check" @action="setFilter(FILTER_COMPLETED)" />
                    <NavItem name="Uncompleted" class="fa-regular fa-circle" @action="setFilter(FILTER_UNCOMPLETED)" />
                    <NavItem v-for="tag in tags" :key="tag.index" :name="tag.name" :class="tag.color"
                        class="fa-solid fa-tag" @action="setFilter(tag.name)" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>Actions</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Mark all as completed" class="fa-solid fa-circle-check"
                        @action="markAllAsCompleted" />
                    <NavItem name="Mark all as uncompleted" class="fa-solid fa-circle" @action="markAllAsUncompleted" />
                    <NavItem name="Clear all completed" class="fa-solid fa-broom" @action="deleteAllTodos" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-tags"></i>
                    </span>
                    <span>Tags</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Tag list" class="fa-solid fa-tag" @action="changeTab('Tags')" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-regular fa-file-code"></i>
                    </span>
                    <span>JSON</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Export" class="fa-solid fa-file-export" @action="exportJSON" />
                    <NavItem name="Import" class="fa-solid fa-file-import" @action="importJSON" />
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-gear"></i>
                    </span>
                    <span>Settings</span>
                </p>
                <ul class="menu-list">
                    <div class="language-item">
                     
                        <NavItem name="Language" class="fa-solid fa-language"/>
                        <div class="select">
                            <select v-model="language" @change="setLanguage">
                                <option v-for="language in languages" :value="language">{{ language }}</option>
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
            FILTER_ALL:1,
            FILTER_TODAY:2,
            FILTER_COMPLETED:3,
            FILTER_UNCOMPLETED:4,
            FILTER_IMPORTANT:5,
            language: "",
            languages: ['en', 'fr'],
            visibleNavbar: false,
        }
    },
    props: ['tags'],
    emits: ['filter', 'tab', 'completed', 'uncompleted', 'delete', 'export', 'import', 'language'],
    methods: {
        // todos
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
        }
    }
}
</script>
<style>
.language-item {
    display: flex;
}
</style>