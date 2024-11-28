<script lang='ts' setup>
import type { IGame, IMap } from '@/ts/Interfaces';
import axios from 'axios';

const gameList = ref<IGame[]>([])
const mapList = ref<IMap[]>([])

const list = computed(() => {
    return gameList.value.map((game) => {
        return {
            ...game,
            maps: mapList.value.filter((map) => map.game_id == game.id)
        }
    })
})

function getGameList() {
    axios.post('/admin/getGameList').then(({ data }) => {
        gameList.value = data.data
    })
}
function getMapList() {
    axios.post('/admin/getMapList').then(({ data }) => {
        mapList.value = data.data
    })
}

getGameList()
getMapList()

</script>
<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <h1>游戏列表</h1>
            </v-col>
            <v-col cols="12" md="3" v-for="game in list" :key="game.id">
                <el-card v-if="game.maps.length > 0" :header="game.game_name">
                    <el-menu router>
                        <el-menu-item v-for="map in game.maps" :key="map.id" :index="`/games/${map.map_path}`">
                            {{ map.map_name }}
                        </el-menu-item>
                    </el-menu>
                </el-card>
            </v-col>
        </v-row>

    </v-container>
</template>
<script lang='ts'>

export default {
    name: 'GamesView',
}
</script>
<style lang='less' scoped></style>
