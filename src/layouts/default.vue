<script lang='ts' setup>

</script>
<template>
    <v-layout>
        <BassDrawer></BassDrawer>
        <v-main>
            <v-container style="padding: 0;" fluid>
                <RouterView></RouterView>
            </v-container>
        </v-main>
    </v-layout>
</template>
<script lang='ts'>
export default {
    name: 'DefaultLayout',
}
</script>
<style lang='less' scoped></style>
