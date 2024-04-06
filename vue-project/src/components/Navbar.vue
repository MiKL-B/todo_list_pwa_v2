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

                    <li @click="setFilter('All')">
                        <a>
                            <span class="icon">
                                <i class="fa-regular fa-file"></i>
                            </span>
                            <span>All</span>
                        </a>
                    </li>
                    <li @click="setFilter('Today')">
                        <a>
                            <span class="icon">
                                <i class="fa-regular fa-file"></i>
                            </span>
                            <span>Today</span>
                        </a>
                    </li>
                    <li @click="setFilter('Important')">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                            </span>
                            <span>Important</span>
                        </a>
                    </li>
                    <li @click="setFilter('Completed')">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <span>Completed</span>
                        </a>
                    </li>
                    <li @click="setFilter('Uncompleted')">
                        <a>
                            <span class="icon">
                                <i class="fa-regular fa-circle"></i>
                            </span>
                            <span>Uncompleted</span>
                        </a>
                    </li>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-list"></i>
                    </span>
                    <span>Actions</span>
                </p>
                <ul class="menu-list">
                    <li @click="markAllAsCompleted">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-circle-check"></i>
                            </span>
                            <span>Mark all as completed</span>
                        </a>
                    </li>
                    <li @click="markAllAsUncompleted">
                        <a>
                            <span class="icon">
                                <i class="fa-regular fa-circle"></i>
                            </span>
                            <span>Mark all as uncompleted</span>
                        </a>
                    </li>
                    <li @click="deleteAllItems">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-broom"></i>
                            </span>
                            <span>Clear all completed</span>
                        </a>
                    </li>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-solid fa-tags"></i>
                    </span>
                    <span>Tags</span>
                </p>
                <ul class="menu-list">
                    <li @click="changeTab('Tags')">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-tag"></i>
                            </span>
                            <span>Tag</span>
                        </a>
                    </li>
                </ul>
                <p class="menu-label">
                    <span class="icon">
                        <i class="fa-regular fa-file-code"></i>
                    </span>
                    <span>JSON</span>
                </p>
                <ul class="menu-list">
                    <li @click="exportJSON">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-file-export"></i>
                            </span>
                            <span>Export</span>
                        </a>
                    </li>
                    <li @click="importJSON">
                        <a>
                            <span class="icon">
                                <i class="fa-solid fa-file-import"></i>
                            </span>
                            <span>Import</span>
                        </a>
                    </li>
                </ul>
            </aside>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
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
        deleteAllItems() {
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