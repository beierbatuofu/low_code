<!--
 * @Author: ben
 * @LastEditTime: 2021-04-29 18:00:14
-->
<template>
  <div>
    <rvue-label :label="$t('tableDesign.defaultValue')" />
    <rvue-organ :tags="tags" @change="bindChange" :multiple="multiple" :hide="hide" />
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Watch,
    Prop
  } from "vue-property-decorator";
  import BaseAttr from "../../core/BaseAttr";

  const hideConfig = {
    dept: 1,
  };

  @Component
  export default class TDdefaultOrg extends BaseAttr {

    @Prop({
			type: Object,
			default: () =>{}
		})
		ext!: any; 

    private get tags() {
      return this.config.defVal;
    }

    private get hide() {
      let {
        type
      } = this.config;

      if (type.indexOf("dept") !== -1) return [1, 2];
      if (type.indexOf("use") !== -1) return [0, 1];
    }

    private bindChange(d: any) {
      this.config.defVal = d;
    }

    private get multiple() {
      return this.ext.multiple || true;
    }

  }
</script>
<style lang="scss">
  .TD-attr-style {}
</style>