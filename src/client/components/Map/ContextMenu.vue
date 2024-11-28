<script lang='ts' setup>

</script>
<template>
    <div ref="contextMenuRef" class="context-menu">
        <v-list>
            <AddMarker>
                <template #operate="{ onShow }">
                    <v-list-item title="添加标记点" @click="onShow()"></v-list-item>
                </template>
            </AddMarker>
        </v-list>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'ContextMenu',
}
</script>
<style lang='less' scoped>
.context-menu {
    position: absolute;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    background-color: var(--el-bg-color);
}
</style>