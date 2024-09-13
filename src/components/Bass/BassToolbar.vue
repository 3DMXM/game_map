<script lang='ts' setup>
import { useMain } from '@/stores/useMain';
import SwitchMap from '@/components/Bass/Toolbar/SwitchMap.vue';
import Points from '@/components/Bass/Toolbar/Points.vue';

const main = useMain()

</script>
<template>
    <v-navigation-drawer v-model="main.drawer">
        <v-card>
            <v-card-text>
                <RouterLink to="/">
                    <img class="logo" src="@\assets\logo\wukong_map_logo.png" alt="logo" />
                </RouterLink>
            </v-card-text>
        </v-card>
        <SwitchMap></SwitchMap>
        <Points></Points>
    </v-navigation-drawer>
</template>
<script lang='ts'>

export default {
    name: 'BassToolbar',
}
</script>
<style lang='less' scoped>
.logo {
    width: 100%;
    // 缩放
    transform: scale(1.3);
}
</style>