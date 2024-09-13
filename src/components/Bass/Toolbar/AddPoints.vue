<script lang='ts' setup>
import { usePoints } from '@/stores/usePoints';


const points = usePoints()

const formLabelWidth = '140px'


</script>
<template>
    <el-button text size="small" @click="points.addPointsShow = true">
        <v-icon size="15">mdi-plus</v-icon>添加
    </el-button>

    <el-dialog title="添加标记点" v-model="points.addPointsShow" append-to-body draggable :close-on-click-modal="false"
        width="700">

    </el-dialog>
</template>
<script lang='ts'>

export default {
    name: 'AddPoints',
}
</script>
<style lang='less' scoped></style>