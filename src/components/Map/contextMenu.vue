<script lang='ts' setup>

const gamemapStores = useGamemap()


function addPoint() {

}

</script>
<template>
    <div class="context-menu">
        <div class="menu-list" @click="addPoint">新建标记点</div>
        <div class="menu-list">新建范围</div>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'contextMenu',
}
</script>
<style lang='less' scoped>
.context-menu {
    background-color: rgb(var(--v-theme-surface));

    .menu-list {
        padding: 5px 10px;
        cursor: pointer;

        &:hover {
            background-color: rgb(var(--v-theme-primary));
            color: rgb(var(--v-theme-on-primary));
        }
    }
}
</style>
