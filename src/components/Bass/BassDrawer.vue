<script lang='ts' setup>

const main = useMain()

const gamemapStores = useGamemap()

// const unshowMarks = ref([] as number[])

const types = computed(() => {

    const types = [] as { name: string, list: IGameMark[], total: number }[]

    gamemapStores.marks.forEach(item => {
        const type = types.find(type => type.name == item.mark_type_parent)
        if (type) {
            type.list.push(item)
        } else {
            types.push({ name: item.mark_type_parent, list: [item], total: item.marks.length })
        }
    })

    return types
})

function switchMarks(mark: IGameMark) {

    if (gamemapStores.unshowMarks.includes(mark.id)) {
        gamemapStores.unshowMarks = gamemapStores.unshowMarks.filter(item => item != mark.id)
    } else {
        gamemapStores.unshowMarks.push(mark.id)
    }
    // console.log(gamemapStores.pointsIds);

    window.$gmap?.addPoints(gamemapStores.fillterMarks, gamemapStores.pointsIds)

}

function clearAll() {
    gamemapStores.unshowMarks = gamemapStores.marks.map(mark => mark.id)
    window.$gmap?.addPoints(gamemapStores.fillterMarks, gamemapStores.pointsIds)

}

function selectAll() {
    gamemapStores.unshowMarks = []
    window.$gmap?.addPoints(gamemapStores.fillterMarks, gamemapStores.pointsIds)

}



</script>
<template>
    <v-navigation-drawer class="drawer" v-model="main.drawer" width="375">
        <v-card>
            <v-card-text class="content">
                <v-col cols="12">
                    <h1 class="title">潜行者2 互动地图</h1>
                </v-col>
                <v-col cols="12">
                    <v-img cover src="https://mod.3dmgame.com/static/upload/logo/croppedImg_67e41b904f5c9.jpg"></v-img>
                </v-col>
                <v-col cols="12" class="buttons">
                    <el-button @click="selectAll">显示全部</el-button>
                    <el-button @click="clearAll">隐藏全部</el-button>
                </v-col>
                <v-col cols="12">
                    <el-input placeholder="搜索标记点">
                        <template #append>
                            <el-button slot="append"> <el-icon><el-icon-search></el-icon-search></el-icon> </el-button>
                        </template>
                    </el-input>
                    <div class="mark" v-for="type in types">
                        <h3 class="mark-parent">{{ type.name }}</h3>
                        <div class="mark-types">
                            <v-chip class="type-list" v-for="mark in type.list" variant="text" label
                                @click="switchMarks(mark)"
                                :class="{ unshow: gamemapStores.unshowMarks.includes(mark.id) }">
                                <template #prepend>
                                    <v-avatar :image="mark.mark_type_icon" size="25"></v-avatar>
                                </template>
                                <span class="name"> {{ mark.mark_type_name }}</span>
                                <template #append>
                                    <span class="total">{{ type.total }}</span>
                                </template>
                            </v-chip>
                        </div>
                    </div>
                </v-col>
            </v-card-text>
        </v-card>
        <div class="sidebar-close" @click="main.drawer = !main.drawer">
            <v-icon v-if="main.drawer">mdi-chevron-double-left</v-icon>
            <v-icon v-else>mdi-chevron-double-right</v-icon>
        </div>
    </v-navigation-drawer>
</template>
<script lang='ts'>

export default {
    name: 'BassDrawer',
}
</script>
<style lang='less' scoped>
.drawer {
    position: relative;

    .content {
        .title {
            text-align: center;
        }

        .buttons {
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
                    .total {
                        margin-left: 0.5rem;
                    }

                    &.unshow {
                        opacity: .3;
                    }
                }
            }
        }
    }


    .sidebar-close {
        left: 100%;
        position: absolute;
        top: 8px;
        cursor: pointer;
        height: 48px;
        width: 23px;
        display: flex;
        align-items: center;
        background-color: rgb(var(--v-theme-background));
    }
}
</style>
