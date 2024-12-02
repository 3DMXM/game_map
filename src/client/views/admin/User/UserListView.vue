<script lang='ts' setup>
import type { IUser } from '@/ts/Interfaces';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import md5 from 'md5';

type formType = IUser

const tableData = ref<formType[]>([])
const shewDialog = ref(false)
const form = ref({
    id: 0,
    username: '',
    oldpassword: '',
    newpassword: '',
    repassword: ''
})

async function gettableData() {
    let { data } = await axios.post('/admin/getUserList')
    console.log(data);
    tableData.value = data.data
}

function save() {
    if (!form.value.oldpassword) {
        ElMessage.error('旧密码不能为空')
        return
    }
    if (form.value.newpassword != form.value.repassword) {
        ElMessage.error('两次密码不一致')
        return
    }

    axios.post('/admin/saveUser', {
        id: form.value.id,
        oldpassword: md5(form.value.oldpassword),
        newpassword: md5(form.value.newpassword)
    }).then(({ data }) => {
        if (data.code == 0) {
            shewDialog.value = false
            gettableData()
            clear()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}

function edit(row: formType) {
    form.value = JSON.parse(JSON.stringify(row))
    shewDialog.value = true
}

function del(id: number) {
    axios.post('/admin/delUser', { id }).then(({ data }) => {
        if (data.code == 0) {
            gettableData()
            ElMessage.success(data.msg)
        } else {
            ElMessage.error(data.msg)
        }
    })
}

function clear() {
    form.value = {} as any
}

gettableData()
</script>
<template>
    <el-card>
        <template #header>
            <!-- <el-button @click=" shewDialog = true">添加用户 <el-icon> <el-icon-plus></el-icon-plus> </el-icon> </el-button> -->
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="id" width="100" />
            <el-table-column prop="username" label="用户名" width="180" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="edit(row)">修改密码
                        <el-icon><el-icon-edit /></el-icon>
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="shewDialog" title="修改密码" width="400" draggable :close-on-click-modal="false" @close="clear">
            <el-form :label-width="100" @submit.prevent @keyup.enter="save">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="旧密码">
                    <el-input v-model="form.oldpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="form.newpassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input v-model="form.repassword" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save">添加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-card>
</template>
<script lang='ts'>

export default {
    name: 'UserListView',
}
</script>
<style lang='less' scoped></style>
