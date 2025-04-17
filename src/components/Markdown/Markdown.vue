<script lang='ts' setup>
import marked from '@/model/marked'
import { computed, onMounted } from 'vue';
import 'github-markdown-css/github-markdown.css'; // 引入 GitHub 样式
import 'highlight.js/styles/github-dark.css'


const props = defineProps<{
    md: string
}>()

const emit = defineEmits(['setRef']);

let html = computed(() => marked(props.md))
const previewRef = ref<HTMLDivElement>();

onMounted(() => {
    // 将markdown-body下的 a 标签的 target 属性设置为 _blank
    document.querySelectorAll('.markdown-body a').forEach((item: any) => {
        item.target = '_blank'
    })

    emit('setRef', previewRef.value)
})

</script>
<template>
    <div class="markdown-body" v-html="html" ref="previewRef"></div>
</template>
<script lang='ts'>

export default {
    name: 'Markdown',
}
</script>
<style lang='less'>
.markdown-body {
    background-color: transparent;
    min-height: auto;
    color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));

    padding: 1rem 0;
    box-sizing: border-box;
    overflow-y: auto;
    background-color: transparent;

    a {
        color: #42b883;
        text-decoration: none;

        &:hover {
            color: #33a06f;
        }
    }

    .collapse {
        position: relative;
        margin-bottom: 15px;
        background: rgba(255, 255, 255, .1);

        &:hover {
            background: rgba(255, 255, 255, .15);
        }

        .collapse-title {
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            align-items: center;
            // 0.5s 动画
            transition: all 0.5s;

            &::after {
                content: "\F0415";
                display: inline-block;
                font: normal normal normal 24px/1 "Material Design Icons";
                font-size: 1.5rem;
                text-rendering: auto;
                line-height: inherit;
                -webkit-font-smoothing: antialiased;
            }

            &:hover {
                opacity: .7;
            }
        }

        .collapse-content {
            padding: 1rem;
            border-top: 1px solid rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));

            .inner {
                padding: 5px 15px;
                color: #d4d4d4;
            }
        }
    }
}
</style>