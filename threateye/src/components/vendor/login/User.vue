<template>
  <div id="UserLogin">

    <el-form class="login-form"
             status-icon
             :rules="loginRules"
             ref="loginForm"
             :model="loginForm"
             label-width="0">
      <!--用户名-->
      <el-form-item prop="username">
        <label class="view-label">User Name</label>
        <el-input class="view-input"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="Please enter a user name">
          <i slot="prefix"
             class="icon-yonghu"></i>
          <div slot="prefix"
               class="d-split"></div>
        </el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <label class="view-label">Password</label>
        <el-input class="view-input"
                  @keyup.enter.native="handleLogin"
                  :type="passwordType"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="Please enter your password">
          <i class="el-icon-view el-input__icon"
             slot="suffix"
             @click="showPassword"></i>
          <i slot="prefix"
             class="icon-mima"></i>
          <div slot="prefix"
               class="d-split"></div>
        </el-input>
      </el-form-item>

      <!--验证码模块-->
      <!--<div class="code_info">-->
      <div class="code_info"
           v-show="count >= 3">
        <el-form-item prop="code">
          <label class="view-label">Captcha</label>
          <div class="code-list">
            <el-input class="view-input view-code"
                      maxlength="8"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.code"
                      auto-complete="off"
                      placeholder="Enter captcha code here">
              <i slot="prefix"
                 class="icon-yanzhengma"></i>
              <div slot="prefix"
                   class="d-split"></div>
            </el-input>
            <!--验证码组件-->
            <div class="code"
                 @click="refreshCode">
              <s-identify :identifyCode="identifyCode"
                          :contentHeight="contentHeight"></s-identify>
            </div>
          </div>
        </el-form-item>
        <div class="code_p3_error">
          <span class="p3_error">
            <i class="el-icon-warning"></i>
            <span class="p3_error_title">User name or password entered incorrectly more than three times</span>
            <!-- <a class="p3_tips">点击联系管理员</a>-->
          </span>
        </div>
      </div>

      <!--登录按钮-->
      <el-form-item>
        <el-button type="primary"
                   @click.native.prevent="handleLogin"
                   class="login-submit">Login</el-button>
      </el-form-item>
    </el-form>

    <!--忘记密码-->
    <!--<div class="forget_pass">
      <a href="javascript:false;"
         class="pass_a">忘记密码？</a>
    </div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import SIdentify from './Identify';
import { isvalidUsername, isvalidPassword } from '@/assets/js/validate'
export default {
  name: 'UserLogin',
  data () {
    /*const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!isvalidPassword(value)) {
        callback(new Error('密码不正确，请重新输入'))
      } else {
        callback()
      }
    }*/
    return {
      count: 0,
      contentHeight: 48,
      loginForm: {
        username: '',  //admin
        // username: '',
        // password: ''
        password: '' //Hoohoolab*123
        // password: '!@#QWEasd123'
      },
      code: '',
      identifyCodes: '1234567890',
      identifyCode: '',
      loginRules: {
        username: [
          { required: true, message: 'User name is required', trigger: 'blur' },
          { required: true, message: ' ', trigger: 'change' },
          /*{ min: 2, max: 16, message: '用户名长度为2~16个字符', trigger: 'blur' },*/
          /*{ required: true, trigger: 'blur', validator: validateUsername }*/
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { required: true, message: ' ', trigger: 'change' },
          /*{ min: 6, message: '密码长度最少为6位', trigger: 'blur' },*/
          /*{ required: true, trigger: 'blur', validator: validatePassword }*/
        ]
      },
      passwordType: 'password'
    }
  },
  created () {
    this.setHeight();
    if (window.sessionStorage.getItem('overtime')) {
      this.$message.warning('Connection times out, and please login again.');
      window.sessionStorage.removeItem('overtime');
    }
  },
  mounted () {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    setHeight () {
      let width = document.body.clientWidth;
      let height = (48 * width / 1920).toFixed(0);
      this.contentHeight = height;
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode () {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    showPassword () {
      this.passwordType === '' ?
        (this.passwordType = 'password') :
        (this.passwordType = '');
    },
    handleLogin () {
      if (this.count > 2) {
        const validateCode = (rule, value, callback) => {
          if (this.identifyCode !== value) {
            this.code = '';
            this.identifyCode = '';
            this.makeCode(this.identifyCodes, 4);
            callback(new Error('Incorrect captcha code. Please try again.'))
          } else {
            callback()
          }
        }
        let codeValidate = [
          { required: true, message: 'Enter captcha code here', trigger: 'blur' },
          { min: 4, max: 4, message: 'Captcha code length is 4', trigger: 'blur' },
          { required: true, validator: validateCode, trigger: 'blur' }
        ]
        this.$set(this.loginRules, 'code', codeValidate);
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.loginForm)
            .then((resp) => {
              //返回成功跳转
              if (resp[0]) {
                this.$message.success('Login successfully');
                this.$router.push('/', () => { });//登录成功之后重定向到首页
                this.count = 0;
                //失败
              } else {
                this.$message.error(resp[1]);
                this.count++;
                //this.loginForm = {username: '', password: ''};
              }
            }).catch(err => {
              this.$message.error(err); //登录失败提示错误
            });
        }
      })
    }
  },
  components: {
    SIdentify
  }
}


</script>
<style scoped lang="less">
#UserLogin {
  /deep/ .el-form {
    .el-form-item {
      margin-top: 20px;
      margin-bottom: 0;
      .el-form-item__content {
        line-height: 1;
        .view-label {
          font-family: PingFang;
          font-size: 14px;
          color: #bbbbbb;
          line-height: 30px;
        }
        .view-input {
          position: relative;
          .el-input__inner {
            border: 1px solid #bbbbbb;
            background-color: transparent;
            color: #bbbbbb;
            height: 48px;
            padding-left: 45px;
          }
          .d-split {
            position: absolute;
            top: 14px;
            left: 30px;
            height: 20px;
            width: 2px;
            background: #bbb;
          }
          .el-input__prefix {
            i {
              display: block;
              height: 48px;
              width: 25px;
              text-align: center;
              -webkit-transition: all 0.3s;
              transition: all 0.3s;
              /*line-height: 40px;*/
              background-position: 4px 15px;
              background-repeat: no-repeat;
              background-size: 16px;
            }
            i.icon-yonghu {
              background-image: url('../../../assets/images/login/username.png');
            }
            i.icon-mima {
              background-image: url('../../../assets/images/login/password.png');
            }
            i.icon-yanzhengma {
              background-image: url('../../../assets/images/login/password.png');
            }
          }
        }
        .code-list {
          display: flex;
          height: 48px;
          .view-code {
            flex: 1;
          }
          .s-canvas {
            padding-left: 20px;
            height: 48px !important;
          }
        }
        .login-submit {
          background: #0070ff;
          width: 100%;
          border-color: #0070ff;
          margin: 20px 0 0;
          height: 48px;
        }
      }
    }
    .code_info {
      height: 120px;
    }
    .code_p3_error {
      text-align: right;
      margin-top: 18px;
      .p3_error {
        text-align: right;
        font-family: PingFang;
        font-size: 14px;
        /deep/ .el-icon-warning {
          color: #ff3a36;
        }
        .p3_error_title {
          text-align: right;
          color: #333333;
        }
        .p3_tips {
          text-align: right;
          color: #ff3a36;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
  .forget_pass {
    line-height: 80px;
    text-align: center;
    .pass_a {
      text-decoration: none;
      ont-family: PingFang;
      font-size: 16px;
      color: #bbbbbb;
    }
  }
}
</style>
