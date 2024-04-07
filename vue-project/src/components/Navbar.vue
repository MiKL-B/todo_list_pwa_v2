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
                    <NavItem name="All" class="fa-regular fa-file" @action="setFilter('All')"/>
                    <NavItem name="Today" class="fa-regular fa-file" @action="setFilter('Today')"/>
                    <NavItem name="Important" class="fa-solid fa-triangle-exclamation" @action="setFilter('Important')"/>
                    <NavItem name="Completed" class="fa-solid fa-check" @action="setFilter('Completed')"/>
                    <NavItem name="Uncompleted" class="fa-regular fa-circle" @action="setFilter('Uncompleted')"/>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>Actions</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Mark all as completed" class="fa-solid fa-circle-check" @action="markAllAsCompleted"/>
                    <NavItem name="Mark all as uncompleted" class="fa-solid fa-circle" @action="markAllAsUncompleted"/>
                    <NavItem name="Clear all completed" class="fa-solid fa-broom" @action="deleteAllTodos"/>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-tags"></i>
                    </span>
                    <span>Tags</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Tag" class="fa-solid fa-tag" @action="changeTab('Tags')"/>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-regular fa-file-code"></i>
                    </span>
                    <span>JSON</span>
                </p>
                <ul class="menu-list">
                    <NavItem name="Export" class="fa-solid fa-file-export" @action="exportJSON"/>
                    <NavItem name="Import" class="fa-solid fa-file-import" @action="importJSON"/>
                </ul>
            </aside>
            <!-- <slot name="tag"></slot> -->
        </div>
    </nav>
</template>

<script>
import NavItem from '@/components/NavItem.vue';
export default {
    name: "Navbar",
    components:{
        NavItem
    },
    data() {
        return {
            visibleNavbar: false,
        }
    },
    emits: ['filter', 'tab', 'completed', 'uncompleted', 'delete','export','import'],
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

        importJSON(){
            this.$emit('import');
            this.visibleNavbar = false;
        }
    }
}
</script>