<script lang='ts' setup>

import { monaco } from '@/model/customMonaco';


const props = defineProps<{
    height?: string
}>()
// const emit = defineEmits(['update:modelValue']);

const editValue = defineModel<string>()



const editorRef = ref<HTMLElement>();
const previewRef = ref<HTMLDivElement>();
// const markdown = useMarkdown()

let editor: monaco.editor.IStandaloneCodeEditor;

//#region 工具栏
function insertText(before: string, after: string = '') {
    const selection = editor.getSelection();
    if (selection) {
        const id = { major: 1, minor: 1 };
        const text = editor.getModel()?.getValueInRange(selection);
        editor.executeEdits('my-source', [
            {
                range: selection,
                text: before + text + after,
                forceMoveMarkers: true
            }
        ]);
    }
}

function insertTextAtFirst(code: string) {
    // 获取当前选择或光标位置
    const selection = editor.getSelection();
    if (selection) {
        const model = editor.getModel();
        if (model) {
            const text = model.getValueInRange(selection);
            const range = selection.isEmpty()
                ? new monaco.Range(selection.startLineNumber, 1, selection.startLineNumber, 1)
                : selection;
            editor.executeEdits('my-source', [
                {
                    range: range,
                    text: text.split('\n').map(line => code + line).join('\n'),
                    forceMoveMarkers: true
                }
            ]);
        }
    }
}

function addHeading(level: number) {
    insertTextAtFirst('#'.repeat(level) + ' ');
}

function addBold() {
    insertText('**', '**');
}

function addItalic() {
    insertText('*', '*');
}

function addStrikethrough() {
    insertText('~~', '~~');
}

function addBlockquote() {
    insertTextAtFirst('> ');
}

function TextAlignment(to: number) {
    // 1 居左 2 居中 3 居右
    let text = ''
    switch (to) {
        case 1:
            text = 'left'
            break;
        case 2:
            text = 'center'
            break;
        case 3:
            text = 'right'
            break;
    }
    insertText(`<div style="text-align: ${text}">`, '</div>');
}

function addUnorderedList() {
    insertTextAtFirst('- ');
}

function addOrderedList() {
    insertTextAtFirst('1. ');
}

function addTaskList() {
    insertTextAtFirst('- [ ] ');
}

function addHr() {
    insertText('\n----\n');
}

function addLink() {
    insertText('[', '](http://mod.3dmgame.com)');
}

function addImage() {
    insertText('![', '](https://mod.3dmgame.com/assets/image/lazy_img.webp)');
}

async function upimage(image: File) {
    let formdata = new FormData()
    formdata.append('file', image)
    return axios({
        method: 'post',
        url: '/upload/fileUpload',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' }
    })
}

function addLocalImage() {
    // 弹出选择图片的对话框
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                let { data } = await upimage(file)
                if (data.code == '00') {
                    insertText('![', `](/static/upload/mod/${data.url}@webp)`);
                }
            }
            reader.readAsDataURL(file);
        }
    }
    input.click();
}

function addInlineCode() {
    insertText('`', '`');
}

function addCodeBlock() {
    insertText('```\n', '\n```');
}

function addTable() {
    insertText('| 标题 | 标题 |\n| --- | --- |\n| 内容 | 内容 |\n| 内容 | 内容 |');
}

const color = ref('#55ffef');
function addColor() {
    insertText(`<span style="color: ${color.value}">`, '</span>');
}

function addCollapse() {
    insertText('[collapse title="展开详细"]\n', '\n[/collapse]');
}

function addVideo() {
    insertText('[video]', '[/video]')
}

//#endregion

function syncScroll() {
    const editorScrollTop = editor.getScrollTop();
    const editorScrollHeight = editor.getScrollHeight();
    const previewScrollHeight = previewRef.value?.scrollHeight || 0;
    const scrollRatio = editorScrollTop / editorScrollHeight;
    if (previewRef.value) {
        previewRef.value.scrollTop = scrollRatio * previewScrollHeight;
    }
}
function resizeEditor() {
    if (editor) {
        editor.layout();
    }
}
onMounted(() => {
    if (editorRef.value) {
        editor = monaco.editor.create(editorRef.value, {
            value: editValue.value,
            language: 'markdown',
            theme: 'vs-dark',
            minimap: {
                enabled: false
            },
            wordWrap: 'on',
        });
        editor.onDidChangeModelContent(() => {
            editValue.value = editor.getValue();
        });
        editor.onDidScrollChange(syncScroll);

        window.addEventListener('resize', resizeEditor);
    }
})

// let init = false
// watch(editValue, (value) => {
//     if (editor && !init && value) {
//         editor.setValue(value);
//         init = true
//     }
// })

function setEditValue(value: string) {
    if (editor && value) editor.setValue(value);
}

function setRef(ref: HTMLDivElement) {
    previewRef.value = ref;
}

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeEditor);
});

defineExpose({
    setEditValue
})

</script>
<template>
    <div class="editor-container">
        <div class="toolbar">
            <el-color-picker @change="addColor" show-alpha v-model="color" />
            <div class="fragmenting"></div>
            <el-dropdown>
                <el-button link>标题</el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="addHeading(1)">H1</el-dropdown-item>
                        <el-dropdown-item @click="addHeading(2)">H2</el-dropdown-item>
                        <el-dropdown-item @click="addHeading(3)">H3</el-dropdown-item>
                        <el-dropdown-item @click="addHeading(4)">H4</el-dropdown-item>
                        <el-dropdown-item @click="addHeading(5)">H5</el-dropdown-item>
                        <el-dropdown-item @click="addHeading(6)">H6</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button link @click="addBold">加粗</el-button>
            <el-button link @click="addItalic">斜体</el-button>
            <el-button link @click="addStrikethrough">删除</el-button>
            <el-button link @click="addBlockquote">引用</el-button>
            <div class="fragmenting"></div>
            <el-button link @click="TextAlignment(1)"> <v-icon :size="14">mdi-format-align-left</v-icon> </el-button>
            <el-button link @click="TextAlignment(2)"> <v-icon :size="14">mdi-format-align-center</v-icon> </el-button>
            <el-button link @click="TextAlignment(3)"> <v-icon :size="14">mdi-format-align-right</v-icon> </el-button>
            <div class="fragmenting"></div>
            <el-button link @click="addUnorderedList">无序列表</el-button>
            <el-button link @click="addOrderedList">有序列表</el-button>
            <el-button link @click="addTaskList">任务列表</el-button>
            <div class="fragmenting"></div>
            <el-button link @click="addHr">分割线</el-button>
            <el-button link @click="addLink">链接</el-button>
            <el-button link @click="addImage">网络图片</el-button>
            <el-button link @click="addLocalImage">本地图片</el-button>
            <div class="fragmenting"></div>
            <el-button link @click="addInlineCode">行内代码</el-button>
            <el-button link @click="addCodeBlock">多行代码</el-button>
            <el-button link @click="addTable">表格</el-button>
            <el-button link @click="addCollapse">折叠</el-button>
            <el-button link @click="addVideo">视频</el-button>
            <div class="fragmenting"></div>
            <a href="https://mod.3dmgame.com/read/48" target="_blank">
                <el-button link>
                    <v-icon :size="14">mdi-help</v-icon>
                </el-button>
            </a>
        </div>
        <div class="editor">
            <div ref="editorRef" class="left"></div>
            <Markdown :md="editValue || ''" class="right" @set-ref="setRef"></Markdown>
        </div>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'MarkdownEditor',
}
</script>
<style lang='less' scoped>
.editor-container {
    display: flex;
    flex-direction: column;
    height: v-bind('height');

    .editor {
        display: flex;
        height: calc(100% - 50px);
    }

    .toolbar {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 10px;
        background-color: #333;
        align-items: center;

        .fragmenting {
            margin-left: 5px;
            margin-right: 5px;

            &::after {
                content: '|';
                color: #fff;
            }
        }
    }

    .left,
    .right {
        width: 50%;
        height: 100%;
    }
}
</style>
