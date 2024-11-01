<script lang='ts' setup>

// 处理菜单项点击
function onMenuClick(option: string) {
    console.log(`选择了菜单项: ${option}`)
    // 根据选项执行相应操作
    // isContextMenuVisible.value = false
}

</script>
<template>
    <v-list ref="contextMenuRef" class="context-menu">
        <v-list-item title="选项 1" @click.stop="onMenuClick('1')"></v-list-item>
        <v-list-item title="选项 2" @click.stop="onMenuClick('2')"></v-list-item>
        <v-list-item title="选项 3" @click.stop="onMenuClick('3')"></v-list-item>
    </v-list>
</template>
<script lang='ts'>

export default {
    name: 'ContextMenu',
}
</script>
<style lang='less' scoped>
.context-menu {
    position: absolute;
    border-radius: 4px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>