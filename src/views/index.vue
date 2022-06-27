<template>
    <div class="index">
        <div class="layout">
            <div style="padding-right:400px;margin:-500px 0px 0px -300px;text-align:center">
                <h2>
                    <!-- 智慧城轨新一代智能列车运行系统 -->
                    智慧城轨示范工程<br/>
                    轨道交通运行仿真模型
                    <span></span>
                </h2>
            </div>
            <div class="login-container">
                <el-form ref="loginForm"
                    :inline="true"
                    :model="loginForm"
                    :rules="loginRules"
                    class="login-form"
                    auto-complete="on"
                    label-position="left">
                    <el-form-item prop="username">
                        <div style="display:flex;lext-direction:row;align-items:center;">
                            <span class="svg-container">
                                <svg-icon icon-class="user" />
                            </span>
                            <el-input ref="username"
                                v-model="loginForm.username"
                                placeholder="用户名"
                                name="username"
                                type="text"
                                tabindex="1"
                                auto-complete="on" />
                        </div>
                    </el-form-item>

                    <el-form-item prop="password">
                        <div style="display:flex;lext-direction:row;align-items:center;">
                            <span class="svg-container">
                                <svg-icon icon-class="password" />
                            </span>
                            <el-input :key="passwordType"
                                ref="password"
                                style="width:70%"
                                v-model="loginForm.password"
                                :type="passwordType"
                                placeholder="密码"
                                name="password"
                                tabindex="2"
                                auto-complete="on"
                                @keyup.enter.native="handleLogin" />
                            <span class="show-pwd"
                                @click="showPwd">
                                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                            </span>
                        </div>
                    </el-form-item>
                    <el-form-item class="el-form-item-btn" style="text-align:right">
                        <el-button :loading="loading"
                            type="primary"
                            size="medium"
                            @click.native.prevent="handleLogin">登 录</el-button>
                    </el-form-item>

                    <el-checkbox v-model="testTool"
                        v-if="false"
                        style="width:100%;margin-bottom:0px;margin-left:30px;">开启维护信息（仅限调试人员）</el-checkbox>
                </el-form>
            </div>
        </div>

        <img src="../assets/basie/logo.png"
            class="logo">
        <p>@2022 交控科技 京ICP备08007677号 城市轨道交通列车通信与运行控制国家工程实验室</p>
    </div>
</template>

<script>
import Cookies from "js-cookie";

// import { validUsername } from '@/utils/validate'
export default {
    name: "index",
    components: {},
    data() {
        // const validateUsername = (rule, value, callback) => {
        // if (!validUsername(value)) {
        //     callback(new Error('Please enter the correct user name'))
        // } else {
        //     callback()
        // }
        // }
        // const validatePassword = (rule, value, callback) => {
        // if (value.length < 6) {
        //     callback(new Error('The password can not be less than 6 digits'))
        // } else {
        //     callback()
        // }
        // }
        return {
            loginForm: {
                username: "用户1",
                password: "111111",
            },
            loginRules: {
                // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            passwordType: "password",
            redirect: undefined,
            userList: [
                {
                    name: "用户1",
                    pwd: "111111",
                },
                {
                    name: "用户2",
                    pwd: "11111111",
                },
            ],
            testTool: false,
        };
    },
    created() {
        this.$store.commit("setTestTool", false);
        sessionStorage.clear();
    },
    methods: {
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
            } else {
                this.passwordType = "password";
            }
            this.$nextTick(() => {
                this.$refs.password.focus();
            });
        },
        handleLogin() {
            var self = this;
            let msg = `没有找到用户${this.loginForm.username}`;
            let finduser = this.userList.find((user) => {
                return user.name == this.loginForm.username;
            });
            if (finduser) {
                if (finduser.pwd == this.loginForm.password) {
                    this.loading = true;
                    this.$store.commit("setTestTool", this.testTool);
                    window.testTool = this.testTool;
                    setTimeout(() => {
                        Cookies.set("tct_token", this.loginForm.username, {
                            expires: 1,
                        });
                        self.$router.push({ path: "add" || "add" });
                    }, 2000);
                    return;
                } else {
                    msg = `密码错误`;
                }
            }
            this.$message({
                message: msg,
                type: "warning",
            });
        },
    },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    // width: 100%;
    text-align: right;
    width: 320px;
    margin:0 0 0 100px;
    padding:20px;
    text-align: center;
    position: absolute;
    right:100px;
    bottom:100px;
    // margin: 0 80px -30px 0;
    .el-input {
        display: inline-block;
        height: 47px;
        width: 90%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.8);
        border-radius: 5px;
        color: #454545;
        margin: 0 0 15px 0 ;
    }

    .el-form-item__content{
        line-height: 30px;
        width: 100%;
    }

     .el-form-item-btn {
        border: 1px solid rgba(255, 255, 255, 0);
        background: rgba(0, 0, 0, 0);
        border-radius: 5px;
    }
}
.login-container::before{
        content: '';
        background: #000;
        border-radius: 6px;
        opacity: 0.4;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        left:0;
        top: 0;
    }
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
    //   min-height: 100%;
    //   width: 100%;
    //   background-color: $bg;
    //   overflow: hidden;

    .login-form {
        position: relative;
        z-index: 2;
        max-width: 100%;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>


<style scoped>
@keyframes myfirst {
    0% {
        background-size: 100% 100%;
    }
    50% {
        background-size: 102% 102%;
    }
    100% {
        background-size: 100% 100%;
    }
}

.index {
    width: 100%;
    height: 100vh;
    background: url(../assets/basie/loginbg.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    animation: myfirst 30s linear infinite;
    margin-right: auto;
    margin-left: auto;
}

.layout {
    height: 100%;
    width: 100%;
    padding-bottom: 100px;
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    align-items: center;
}

.layout h2 {
    color: #fff;
    font-size: 60px;
    font-weight: bold;
    /* transform: translate(-50%, -50%); */
    /* transform: scale(1.15); */
    text-shadow: 1px 1px 1px #000;
    text-align: center;
    margin: 20px;
}
.layout h2 span {
    display: block;
    font-size: 20px;
    font-weight: normal;
}

.index .logo {
    left: 20px;
    bottom: 20px;
    transform: translate(0, 0);
}
.index p {
    position: absolute;
    right: 40px;
    bottom: 20px;
    color: #fff;
}
</style>
