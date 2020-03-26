<template>
  <div id="short_message">
    <div class="left">
      <div class="left_item">
        <p>SMS Platform
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter the SMS platform"
                  v-model="message.type"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>AccessKey ID
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter accessKey id"
                  v-model="message.id"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>AccessKey Secret
          <span class="red_necessary">*</span>
        </p>
        <el-input class="select_box"
                  placeholder="Please enter accessKey secret"
                  v-model="message.key"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>SMS Signature
        </p>
        <el-input class="select_box"
                  placeholder="Please enter SMS signature"
                  v-model="message.name"
                  clearable>
        </el-input>
      </div>
      <div class="left_item">
        <p>SMS Template</p>
        <el-input class="select_box"
                  type="textarea"
                  :rows="10"
                  autosize
                  resize='none'
                  placeholder="Please enter the SMS template"
                  v-model="message.model"
                  clearable>
        </el-input>
      </div>
      <div class="left_item btn_box">
        <el-button type="primary"
                   class="save_btn">Save</el-button>
        <el-button type="primary"
                   class="test_btn">Send test SMS</el-button>
      </div>
    </div>
    <div class="mid">
    </div>
    <div class="right"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "mail-notic",
  data () {
    return {
      message: {
        type: '',
        id: '',
        key: '',
        name: '',
        model: '',

      },

    };
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    }
  },
  mounted () { },

  methods: {

  }
};
</script>

<style scoped lang="less">
#short_message {
  display: flex;
  text-align: left;
  .left {
    flex: 1;
    margin-right: 100px;
    .left_item {
      margin-bottom: 24px;
      p {
        font-size: 12px;
        color: #999999;
      }

      .save_btn {
        width: 136px;
        height: 42px;
      }
      .test_btn {
        background: #fff;
        border-color: #0070ff;
        color: #0070ff;
      }
    }
    .btn_box {
      margin-top: 30px;
    }
  }
  .mid {
    flex: 1;
  }
  .right {
    width: 500px;
  }
}
</style>
<style lang='less'>
#short_message {
  .el-input__inner {
    background: #f8f8f8;
    color: #606266;
    border: 0;
  }
  .el-switch__core {
    width: 40px !important;
  }
  .el-textarea__inner {
    margin-top: 8px;
    background: #f8f8f8;
    border: 0;
    min-height: 30px !important;
    line-height: 30px;
  }
  .select_box {
    width: 100%;
    min-height: 38px;
    margin-top: 6px;
    color: #606266;
    input {
      background: #f8f8f8 !important;
    }
  }
}
</style>
