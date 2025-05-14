<script lang='ts' setup>

const main = useMain()
const gamemapStores = useGamemap()

</script>
<template>
    <div class="bottom">
        <div class="marker-button" v-if="!main.drawer && !main.movileDrawer">
            <v-btn prepend-icon="mdi-filter-menu" color="#FFF176" @click="main.drawer = !main.drawer">
                筛选标记点
            </v-btn>
        </div>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'MobileBottom',
}
</script>
<style lang='less' scoped>
.bottom {
    position: fixed;
    bottom: 50px;
    left: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;


}
</style>
