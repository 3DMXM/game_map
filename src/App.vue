<script setup lang="ts">
import BassHeader from '@/components/Bass/BassHeader.vue';
import BassToolbar from '@/components/Bass/BassToolbar.vue';
import BassFooter from '@/components/Bass/BassFooter.vue';
</script>

<template>
    <v-layout>
        <BassHeader></BassHeader>
        <BassToolbar></BassToolbar>
        <v-main>
            <router-view></router-view>
        </v-main>
        <BassFooter></BassFooter>
    </v-layout>
</template>

<style scoped></style>
