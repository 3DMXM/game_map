<script lang='ts' setup>

const main = useMain()


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
                    <el-button>显示全部</el-button>
                    <el-button>隐藏全部</el-button>
                </v-col>
                <v-col cols="12">
                    <el-input placeholder="搜索标记点">
                        <template #append>
                            <el-button slot="append"> <el-icon><el-icon-search></el-icon-search></el-icon> </el-button>
                        </template>
                    </el-input>
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
