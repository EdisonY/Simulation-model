<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar" />

        <!-- <breadcrumb class="breadcrumb-container" v-show="false" /> -->
        <div class="title">
            <!-- 北京轨道交通燕房线 -->
            {{currentLine}}
            <!-- <span v-show="currentLine"> ({{currentLine}})</span> -->
        </div>
        <!-- <div class="title" style="font-size:20px">{{currentLine}}</div> -->
        <div class="right-menu">
            <el-dropdown class="avatar-container"
                trigger="click"
                placement="bottom-end">
                <div class="avatar-wrapper">
                    <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown"
                    class="user-dropdown">
                    <router-link to="/add">
                        <el-dropdown-item>
                            主页
                        </el-dropdown-item>
                    </router-link>
                    <router-link to="/login">
                        <el-dropdown-item divided>
                            <span style="display:block;">登出</span>
                        </el-dropdown-item>
                    </router-link>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
    components: {
        Breadcrumb,
        Hamburger,
    },
    computed: {
        ...mapGetters(["sidebar", "avatar", "currentLine"]),
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        async logout() {
            await this.$store.dispatch("user/logout");
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        },
    },
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    // overflow: hidden;
    position: relative;
    z-index: 3;
    background: #304156;
    // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 15px;
                    font-size: 12px;
                }
            }
        }
    }
}
.navbar .right-menu .avatar-container .avatar-wrapper {
    height: 40px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom {
    top: 14px !important;
    color: #fff;
}

.title {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    height: 50px;
    line-height: 50px;
    font-size: 30px;
    color: #fff;
}

.title span {
    text-align: center;
    font-size: 60%;
    font-weight: bold;
    color: rgb(73, 152, 243);
}
.navbar::after{
    content: '';
    width: 20px;
    height: 20px;
    background: #304156;
    display: block;
    border-radius: 20px;
    position: absolute;
    left: -10px;
    bottom: -10px;
}
.navbar::before{
    content: '';
    z-index: 2;
    width: 20px;
    height: 20px;
    background: #fff;
    display: block;
    border-radius: 20px;
    position: absolute;
    left: 0px;
    bottom: -20px;
}
.el-popper{margin:12px -10px 0 0}
</style>
