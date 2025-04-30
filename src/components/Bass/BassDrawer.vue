<script lang='ts' setup>

const main = useMain()
const gamemapStores = useGamemap()

// 添加搜索关键字变量
const searchKeyword = ref('')

const types = computed(() => {
    const types = [] as { name: string, list: IGameMark[], total: number }[]

    // 根据搜索关键字过滤标记点
    const filteredMarks = searchKeyword.value
        ? gamemapStores.marks.filter(item => item.mark_type_name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
        : gamemapStores.marks

    filteredMarks.forEach(item => {
        const type = types.find(type => type.name == item.mark_type_parent)
        if (type) {
            type.list.push(item)
            // 确保总数正确计算
            type.total = type.list.reduce((sum, mark) => sum + mark.marks_point.length, 0)
        } else {
            types.push({ name: item.mark_type_parent, list: [item], total: item.marks_point.length })
        }
    })

    return types
})


watch([() => gamemapStores.unshowMarks, () => gamemapStores.showName], () => {
    if (window.$gmap) {
        gamemapStores.pointsIds = window.$gmap.addPoints(gamemapStores.fillterMarks, gamemapStores.showName, gamemapStores.pointsIds, true)
    }

}, { deep: true })


// 处理搜索输入变更
function handleSearch() {
    // 添加点位后需要重新渲染地图
    window.$gmap?.addPoints(gamemapStores.fillterMarks, gamemapStores.showName, gamemapStores.pointsIds, true)
}


// 点击切换 显示 或者 隐藏标记点
function switchMarks(mark: IGameMark) {

    if (gamemapStores.unshowMarks.includes(mark.id)) {
        gamemapStores.unshowMarks = gamemapStores.unshowMarks.filter(item => item != mark.id)
    } else {
        gamemapStores.unshowMarks.push(mark.id)
    }
    // console.log(gamemapStores.pointsIds);


}

function clearAll() {
    gamemapStores.unshowMarks = gamemapStores.marks.map(mark => mark.id)

}

function selectAll() {
    gamemapStores.unshowMarks = []
}


</script>
<template>

    <v-navigation-drawer class="drawer d-none d-md-block" floating v-model="main.drawer" width="375">
        <v-card>
            <v-card-text class="content">
                <v-col cols="12">
                    <h1 class="title">潜行者2 互动地图</h1>
                </v-col>
                <v-col cols="12">
                    <v-img cover src="https://mod.3dmgame.com/static/upload/logo/croppedImg_67e41b904f5c9.jpg"></v-img>
                </v-col>
                <v-col cols="12" class="buttons">
                    <div>
                        <el-button @click="selectAll">显示全部</el-button>
                        <el-button @click="clearAll">隐藏全部</el-button>
                    </div>
                    <div>
                        <el-switch v-model="gamemapStores.showName" class="ml-2"
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="显示标记点名称" />
                    </div>
                </v-col>
                <v-col cols="12">
                    <el-input v-model="searchKeyword" placeholder="搜索标记点" @input="handleSearch">
                        <template #append>
                            <el-button> <el-icon><el-icon-search></el-icon-search></el-icon> </el-button>
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
