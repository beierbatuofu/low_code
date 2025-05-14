<!--
 * @Author: ben
 * @LastEditTime: 2021-05-06 09:05:53
-->
<template>
  <div>
    <rvue-label :label="$t('tableDesign.matchingRules')" />
    <el-select v-model="defaultSelect" :size="size" clearable :multiple="multiple" :placeholder="$t('global.pleaseChoose')"
      style="width: 100%">
      <el-option v-for="item in config.link" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
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
  export default class TDdefaultSelect extends BaseAttr {

    private get defaultSelect() {
      return ( < any > this).config.linkVal;
    }

    private set defaultSelect(val: any) {
      ( < any > this).config.linkVal = val;
    }

    private get multiple() {
      return Array.isArray(( < any > this).config.linkVal);
    }


    private isStatus(item: any) {
      if (( < any > this).config.type == 'process_status') {
        return item.value
      } else {
        return item.label
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-select__tags {
    max-width: 94%;
    overflow: hidden;
    // text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
  }
</style>