<script lang='ts' setup>

</script>
<template>
    <!-- <div class="footer">
        <v-speed-dial location="top center" transition="scale-transition">
            <template v-slot:activator="{ props: activatorProps }">
                <v-fab v-bind="activatorProps" size="large" icon="$vuetify"></v-fab>
            </template>
<v-btn key="1" icon="$success"></v-btn>
<v-btn key="2" icon="$info"></v-btn>
<v-btn key="3" icon="$warning"></v-btn>
<v-btn key="4" icon="$error"></v-btn>
</v-speed-dial>
</div> -->
</template>
<script lang='ts'>

export default {
    name: 'BassFooter',
}
</script>
<style lang='less' scoped>
.footer {
    position: absolute;
    right: 100px;
    bottom: 50px;
}
</style>