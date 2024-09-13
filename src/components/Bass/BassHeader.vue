<script lang='ts' setup>
import { useMain } from '@/stores/useMain';


const main = useMain()

</script>
<template>
    <v-app-bar>
        <v-app-bar-nav-icon variant="text" @click.stop="main.drawer = !main.drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>游戏互动地图</v-toolbar-title>
    </v-app-bar>
</template>
<script lang='ts'>

export default {
    name: 'BassHeader',
}
</script>
<style lang='less' scoped></style>