<script lang='ts' setup>

const percentage = ref(100)

</script>
<template>
    <Teleport to="body">
        <div class="map-loading">
            <div class="logo">
                <el-image src="/images/loading-logo.png"></el-image>
                <div class="progress">
                    <el-progress :show-text="false" :percentage="percentage" :stroke-width="10" :indeterminate="true"
                        :duration="2" color="#F8CEA0" />
                </div>
                <div class="text">
                    正在进入地图...
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script lang='ts'>

export default {
    name: 'MapLoading',
}
</script>
<style lang='less' scoped>
.map-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
        width: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .progress {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 20px;
        }
    }

}
</style>
