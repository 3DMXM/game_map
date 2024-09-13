<script lang='ts' setup>
import { useMain } from '@/stores/useMain';
import { useMap } from '@/stores/useMap';
import AddPoints from '@/components/Bass/Toolbar/AddPoints.vue'

const main = useMain()
const map = useMap()

main.getPoints()

function getIcon(name: string) {
    for (let i in map.option.series) {
        let item = (map.option.series as any[])[(i as any)]
        if (item.name == name) {
            let icon = (item.symbol as string).replace('image://', '')
            return icon
        }
    }
}

function ishide(name: string) {
    return map.hidePoints.includes(name)
}

function pointsSwitch(name: string) {
    // 判断 map.hidePoints 中是否存在 name
    if (ishide(name)) {
        // 如果存在，删除
        map.hidePoints = map.hidePoints.filter((item) => item !== name)
        map.myChart?.dispatchAction({
            type: 'legendSelect',
            name: name
        })
    } else {
        // 如果不存在，添加
        map.hidePoints.push(name)
        map.myChart?.dispatchAction({
            type: 'legendUnSelect',
            name: name
        })
    }
}


function selectAll() {
    map.hidePoints = []
    map.myChart?.dispatchAction({
        type: 'legendAllSelect'
    })
}

function selectInvert() {
    //  反选 存在 map.hidePoints 则移除 不存在 则添加
    for (let i in main.points) {
        const item = main.points[i];
        for (let j in item) {
            const name = item[j];
            if (map.hidePoints.includes(name)) {
                map.hidePoints = map.hidePoints.filter((item) => item !== name)
            } else {
                map.hidePoints.push(name)
            }
        }
    }
    map.myChart?.dispatchAction({
        type: 'legendInverseSelect'
    })
}

</script>
<template>
    <v-card>
        <v-card-title>
            标点
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <el-button text size="small" @click="selectAll">
                        <v-icon size="15">mdi-check</v-icon>全选
                    </el-button>
                    <el-button text size="small" @click="selectInvert">
                        <v-icon size="15">mdi-shuffle-variant</v-icon>反选
                    </el-button>
                    <AddPoints></AddPoints>
                </v-col>
                <v-col cols="12">
                    <div v-for="(item, index) in main.points" :key="index" class="points">
                        <div class="points-title">{{ index }}</div>
                        <div class="points-list">
                            <v-chip class="points-list-chip" :class="{ show: !ishide(name) }" label v-for="name in item"
                                variant="text" :value="name" @click="pointsSwitch(name)">
                                <template #prepend>
                                    <v-avatar :image="getIcon(name)" size="20"></v-avatar>
                                </template>
                                {{ name }}</v-chip>
                        </div>
                    </div>
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>
</template>
<script lang='ts'>

export default {
    name: 'Punctuation',
}
</script>
<style lang='less' scoped>
.points {
    .points-title {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
    }

    .points-list {
        .points-list-chip {
            opacity: .6;

            &.show {
                opacity: 1;
                color: #eac27e;
            }
        }
    }
}
</style>