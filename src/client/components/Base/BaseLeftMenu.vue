<script lang='ts' setup>
import { useMap } from '@/stores/useMap';
import type { IMapMarksType, IMarksType } from '@/ts/Interfaces';
import axios from 'axios';


const usemap = useMap()
const router = useRouter()

const unshowMarks = ref([] as number[])

const drawer = ref(null)
const selectMap = computed({
    get: () => usemap.map?.map_path,
    set: (val) => {
        console.log(val);
        router.push({ name: 'GameMap', params: { path: val } })
    }
})

const types = computed(() => {
    // 将 usemap.markTypes 按 mark_type_parent 分类
    const types = [] as { name: string, list: IMarksType[] }[]
    usemap.markTypes.forEach(item => {
        const type = types.find(type => type.name == item.mark_type_parent)
        if (type) {
            type.list.push(item)
        } else {
            types.push({ name: item.mark_type_parent, list: [item] })
        }
    })
    return types
})

const marks = computed<IMapMarksType[]>(() => {
    return usemap.markTypes.filter(mark => !unshowMarks.value.includes(mark.id))
})

const props = {
    expandTrigger: 'hover' as const,
    emitPath: false
}

const changeMapList = computed(() => {
    return usemap.datalist.gameList.map(item => {
        return {
            label: item.game_name,
            disabled: usemap.datalist.mapList.filter(map => map.game_id == item.id).length == 0,
            children: usemap.datalist.mapList.filter(map => map.game_id == item.id).map(map => {
                return {
                    value: map.map_path,
                    label: map.map_name
                }
            })
        }
    })
})

function getGameList() {
    axios.post('/admin/getGameList').then(({ data }) => {
        usemap.datalist.gameList = data.data
    })
}

function getMapList() {
    axios.post('/admin/getMapList').then(({ data }) => {
        usemap.datalist.mapList = data.data
    })
}

function switchMarks(mark: IMarksType) {
    if (unshowMarks.value.includes(mark.id)) {
        unshowMarks.value = unshowMarks.value.filter(item => item != mark.id)
    } else {
        unshowMarks.value.push(mark.id)
    }
    usemap.setMarker(marks.value)
}

function clear() {
    unshowMarks.value = usemap.markTypes.map(mark => mark.id)
    usemap.setMarker([])
}

function selectAll() {
    unshowMarks.value = []
    usemap.setMarker(marks.value)
}

getGameList()
getMapList()

</script>
<template>
    <div class="menu-btn">
        <v-btn v-if="!drawer" link @click="drawer = !drawer" append-icon="mdi-chevron-double-right">展开</v-btn>
    </div>
    <v-navigation-drawer class="left-menu" v-model="drawer">
        <v-sheet class="pa-4">
            <h1>游戏攻略地图 <el-button link @click="drawer = !drawer"><v-icon>mdi-chevron-double-left</v-icon>收起</el-button>
            </h1>
        </v-sheet>
        <v-card title="切换地图">
            <v-card-text>
                <el-cascader v-model="selectMap" :options="changeMapList" :props="props" filterable></el-cascader>
            </v-card-text>
        </v-card>
        <v-card title="标记点">
            <v-card-text>
                <div class="">
                    <el-button link @click="selectAll">全选 <v-icon>mdi-check-all</v-icon> </el-button>
                    <el-button link type="danger" @click="clear">清空 <el-icon><el-icon-delete /></el-icon> </el-button>
                </div>
                <div class="mark" v-for="type in types">
                    <h3 class="mark-parent">{{ type.name }}</h3>
                    <div class="mark-types">
                        <v-chip class="type-list" v-for="mark in type.list" variant="text" label
                            @click="switchMarks(mark)" :class="{ unshow: unshowMarks.includes(mark.id) }">
                            <v-avatar :image="mark.mark_type_icon" size="25"></v-avatar> {{ mark.mark_type_name }}
                        </v-chip>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-navigation-drawer>
</template>
<script lang='ts'>

export default {
    name: 'BaseLeftMenu',
}
</script>
<style lang='less' scoped>
.menu-btn {
    position: fixed;
    top: 50px;
    z-index: 999;
}

.left-menu {
    position: absolute;
    height: calc(100vh - 100px) !important;
    top: 50px !important;


    h1 {
        text-align: center;
    }

    .mark {
        .mark-parent {
            margin-bottom: 5px;
            margin-top: 15px;
        }

        .mark-types {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 10px 17px;

            .type-list {
                &.unshow {
                    opacity: .3;
                }
            }
        }
    }



}
</style>
