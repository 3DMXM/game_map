<script lang='ts' setup>

</script>
<template>
    <div class="home">
        <h1>游戏攻略地图</h1>
        <div class="link">
            <v-btn variant="text" to="/games">游戏列表</v-btn>
            <v-btn variant="text" to="/admin/login">后台管理</v-btn>
        </div>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'HomeView',
}
</script>
<style lang='less' scoped>
.home {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>