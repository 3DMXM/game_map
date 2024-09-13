<script lang='ts' setup>
import { useMain } from '@/stores/useMain';

const main = useMain()

main.getMaps()
</script>
<template>
    <v-card title="切换地图">
        <v-card-text>
            <v-select variant="solo" v-model="main.selectMap" :items="main.maps" item-title="game" item-value="maps"
                return-object>
            </v-select>
            <v-btn variant="text" label v-for="item in main.selectMap.maps" :key="item.id"
                :to="item.path">{{ item.name }}</v-btn>
        </v-card-text>
    </v-card>
</template>
<script lang='ts'>

export default {
    name: 'SwitchMap',
}
</script>
<style lang='less' scoped></style>