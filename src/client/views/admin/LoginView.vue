<script lang='ts' setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import md5 from 'md5'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router';


const router = useRouter()

const form = reactive({
    username: '',
    password: ''
})


function login() {
    let password = md5(form.password)
    axios.post("/admin/login", { username: form.username, password }).then(({ data }) => {
        if (data.code == 0) {
            ElMessage.success('登录成功')
            Cookies.set("user", data.data)
            // window.location.href = '/admin'
            router.push({ name: 'AdminHome' })
        } else {
            ElMessage.error(data.msg)
        }
    })
}

</script>
<template>
    <div class="login">
        <el-form v-model="form" :label-width="70" @keyup.enter="login">
            <el-form-item label="用户名">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn" type="primary" @click="login">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang='ts'>

export default {
    name: 'AdminLogin',
}
</script>
<style lang='less' scoped>
.login {
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}
</style>
