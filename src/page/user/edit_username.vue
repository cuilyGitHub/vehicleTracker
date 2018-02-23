<template>
    <div>
        <div class='edit-panel'>
            <input class="user-name" type="text" placeholder="用户昵称">
            <div class="push">
                <p class="pwd-des">最多10个字描述</p>
                <div class="pwd-btn">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'drawrail',
        data () {
            return {

            }
        },
        created () {
          //this.$utils.setFontSzie(document,window);
        },
        mounted() {

        },
        watch:{

        },
        methods:{

        }
    }
</script>

<style scoped lang="less">
  @import '../../style/less/user/edit_username.less';
</style>
