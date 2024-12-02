<script lang='ts' setup>

let links = [
    {
        name: '首页',
        to: '/admin/home',
        icon: 'mdi-home'
    },
    {
        name: '用户',
        icon: 'mdi-account',
        children: [
            {
                name: '用户列表',
                to: '/admin/userlist'
            }
        ]
    },
    {
        name: '游戏',
        icon: 'mdi-gamepad-variant',
        children: [
            {
                name: '游戏列表',
                to: '/admin/gamelist'
            }
        ]
    },
    {
        name: '地图',
        icon: 'mdi-map',
        children: [
            {
                name: '瓦片集列表',
                to: '/admin/tilelist'
            },
            {
                name: '地图列表',
                to: '/admin/maplist'
            }
        ]
    },
    {
        name: '标记点',
        icon: 'mdi-map-marker',
        children: [
            {
                name: '类型列表',
                to: '/admin/marktypelist'
            },
            {
                name: '标记点列表',
                to: '/admin/markslist'
            }
        ]
    }
]

</script>
<template>
    <v-app id="inspire">
        <v-navigation-drawer>
            <v-sheet class="pa-4">
                游戏地图 - 后台管理
            </v-sheet>
            <v-divider></v-divider>
            <v-list>
                <template v-for="item in links" :key="item.name">
                    <v-list-group v-if="item.children && item.children.length > 0">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.name"></v-list-item>
                        </template>
                        <v-list-item v-for="children in item.children" :key="children.name" :title="children.name"
                            :to="children.to"></v-list-item>
                    </v-list-group>
                    <v-list-item v-else :title="item.name" :prepend-icon="item.icon" :to="item.to"></v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>
<script lang='ts'>

export default {
    name: 'AdminIndex',
}
</script>
<style lang='less' scoped></style>
