<template>
  <el-col 
          :sm="12"
          :xs="24"
          :style="styleName"
        >

    <el-form-item label-width="0px">
      
      <el-button type="primary"
                 @click="formSafe.submit"
                 size="small"
                 icon="el-icon-circle-check"
                 :loading="formSafe.allDisabled"
                 >{{$t("global.submitted",[])}}</el-button>
                 
      <el-button type="primary"
                @click="formSafe.allowEdit"
                size="small"
                icon="el-icon-edit"
                :loading="formSafe.allDisabled">{{$t("global.edit")}}</el-button>

      <el-button type="primary"
                @click="formSafe.TS"
                size="small"
                icon="el-icon-folder-checked"
                :loading="formSafe.allDisabled">{{$t("global.TS")}}</el-button>
      <el-button type="primary"
                @click="formSafe.end"
                size="small"
                icon="el-icon-circle-close"
                :loading="formSafe.allDisabled">{{$t("global.end")}}</el-button>
      <el-button type="primary"
                @click="formSafe.back"
                size="small"
                icon="el-icon-back"
                :loading="formSafe.allDisabled">{{$t("global.back")}}</el-button>
      <el-button type="primary"
                @click="formSafe.deletion"
                size="small"
                icon="el-icon-delete"
                :loading="formSafe.allDisabled">{{$t("global.deletion")}}</el-button>
                

    </el-form-item>
  </el-col>
</template>
<script>

export default {
  form: '1',
  inject: ["formSafe"],
  computed: {
    styleName () {
      if (this.menuSpan !== 24) {
        return {
          padding: 0
        }
      }
      return {}
    }
  }
}
</script>
