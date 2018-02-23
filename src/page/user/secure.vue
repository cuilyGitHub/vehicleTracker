<template>
    <div class="secure-panel">
        <router-link class='secure' v-bind:to="'editpwd'">
            <mt-cell title="修改密码" is-link>
                <span class="des">建议定期更换密码</span>
            </mt-cell>
        </router-link>
        <router-link class='secure' v-bind:to="'bindmobile/mobile'">
            <mt-cell title="绑定手机" is-link>
                <span v-if="!phone" class="des">未绑定</span>
                <span v-if="phone" class="des">已绑定</span>
            </mt-cell>
        </router-link>
        <router-link class='secure' v-bind:to="'bindmobile/email'">
            <mt-cell title="绑定邮箱" is-link>
                <span v-if="email" class="des">已绑定</span>
                 <span v-if="!email" class="des">未绑定</span>
            </mt-cell>
        </router-link>
        <router-link class='secure' v-show="name" v-bind:to="'identity'">
            <mt-cell title="实名认证" is-link>
                <span class="des">已认证</span>
            </mt-cell>
        </router-link>
         <router-link class='secure' v-show="!name"  v-bind:to="'identityapple'">
            <mt-cell title="实名认证" is-link>
                <span class="des">未认证</span>
            </mt-cell>
        </router-link>
    </div>
</template>
<script>
    import cookieUtil from '../../utils/utils'
    export default {
        name:'secure-panel',
        data () {
            return {
              phone:null,
              email:null,
              name:null,
            }
        },
        created () {
          let that = this;
          this.$api.get('/user/client_get_user_info.do', {
            user: cookieUtil.getCookie("user")
          }, function (success) {
            that.phone = success.result.phone;
            that.email = success.result.email;
            that.name = success.result.name;
            console.log(success.result)
          }, function (error) {

          })
        },
        mounted() {

        },
        methods:{

        }
    }
</script>
<style scoped lang='less'>
  @import '../../style/less/user/secure.less';
</style>
