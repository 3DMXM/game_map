import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts';

import vuetify from 'vite-plugin-vuetify'

// 获取仓库名称，用于 GitHub Pages 部署
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        Layouts({
            layoutsDirs: 'src/layouts', // 指定布局文件的目录路径
            defaultLayout: 'default' // 指定默认布局文件的名称
        }),
        vue(),
        vuetify(),
        vueDevTools(),
        AutoImport({
            imports: [
                'vue', 'vue-router', 'pinia',
                { axios: [['default', 'axios']] }
            ],
            resolvers: [
                ElementPlusResolver(),
                // 自动导入图标组件
                IconsResolver({
                    prefix: 'Icon',
                }),

            ],
            dirs: ['src/model', 'src/stores'],
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                (name) => {
                    if (name.startsWith('Mb')) {
                        return { name, from: '@mapbox-vue3/core/es' };
                    }
                    return null;
                }
            ],
        }),
        Icons({
            autoInstall: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    base: process.env.NODE_ENV === 'production' ? `/${repository}/` : '/',
})
