<script lang='ts' setup>

</script>
<template>
    <div class="header">
        <v-btn variant="text" icon="mdi-chevron-left"></v-btn>
        <div class="map">
            <v-btn variant="text" append-icon="mdi-swap-horizontal">黑风山</v-btn>
        </div>
        <v-btn variant="text" icon="mdi-share"></v-btn>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'MobileHeader',
}
</script>
<style lang='less' scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.1);

    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
