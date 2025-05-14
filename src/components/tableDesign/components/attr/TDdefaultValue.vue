<template>
  <div>
    <rvue-label :label="$t('tableDesign.defaultValue')" />
    <el-input v-model="value" :type="type" placeholder="请输入内容"></el-input>
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Watch,
    Prop
  } from "vue-property-decorator";
  import BaseAttr from "../../core/BaseAttr";

  const types: TJson = {
    input: "text",
    textarea: "textarea",
  };

  @Component
  export default class TDdefaultValue extends BaseAttr {
    private get type() {
      return types[this.config.type] || "text";
    }

    private get value() {
      let lang = ( < any > this).lang;
      return ( < any > this).config.defVal;
    }

    private set value(val: string | number) {
      let lang = ( < any > this).lang;
      ( < any > this).config.defVal = val;
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep.el-textarea{
    .el-textarea__inner{
    height: 40px !important;
    overflow: hidden;
    resize:none;
    }
  }
</style>