<template>
  <div>
    <rvue-label :label="$t('tableDesign.defaultValue')" />
    <el-select size="small" v-model="otherValue" :placeholder="$t('global.pleaseChoose')" style="width: 100%">
      <el-option v-for="item in otherOptions" :key="item.value" :label="$t(item.label)" :value="item.value">
      </el-option>
    </el-select>
    <rvue-organ class="select-organ" v-if="otherValue=='0'"  @change="bindChange" :multiple="false" :tags="tags"
      :hide="hide" />

  </div>
</template>

<script lang="ts">
  import {
    Vue,
    Component,
    Prop,
    Watch
  } from "vue-property-decorator";
  import BaseField from "../../core/BaseField";
  const hideConfig = {
    dept: 1,
  };
  @Component({})
  export default class TDfieldOther extends BaseField {

    private get otherValue() {
      return this.config.otherValue
    }

      private get tags() {
      return this.config.defVal;
    }

    private set otherValue(val: any) {
      this.config.otherValue = val
      this.config.defVal = []
    }


    private get otherOptions() {
      return this.config.otherSelect;
    }

 

    private get hide() {
      return [0, 1];
    }

    private bindChange(d: any) {
      this.config.defVal = d;
    }


  }
</script>
<!---  --->
<style lang='scss' scoped>
  .select-organ {
    margin-top: 20px;
  }
</style>