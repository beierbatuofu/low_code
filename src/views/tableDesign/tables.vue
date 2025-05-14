<template>
  <div class="TD-table">
    <slot name="top" class="top"></slot>
    <div @click="tabHandle">
      <rvue-table :tableList="getTabTitleList" :pageSize="size"></rvue-table>
    </div>
  </div>
</template>
<script lang="ts">
  import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
  import {
    Component,
    Vue,
    Watch,
    Prop,
    PropSync,
    Inject
  } from "vue-property-decorator";


  @Component
  export default class TDTable extends Vue {
    @Inject('parent') readonly parent!: any;
    @Prop({
      type: Array,
      default: () => ([])
    }) getTabTitleList!: any;

    @Prop({
      type: Object,
      default: () => ({})
    }) tableObj!: any;


    @Prop({
      type: String,
      default: '10'
    }) pageSize!: string;
    //表格data

    private size = 20;

    private defConf: any = {}

    protected created() {
      this.defConf = ( < TJson > RfieldCore.ins().createField({type: "tableSet"}, "query")).config;
      this.$emit('confChange',this.defConf)
    }

    @Watch('pageSize', {
      immediate: true
    })
    changePageSelect(val: any) {
      this.size = +val
    }

    // 表格勾选事件
    handleSelectionChange(val: any) {
      // console.log(val, '变了');
    }

    private tabHandle() {
      this.defConf.pageSize=this.tableObj.pageSize
      this.defConf.sortOrder=this.tableObj.sortOrder
      this.defConf.sortCondition=this.tableObj.sortCondition
      this.defConf.headerFilter=this.tableObj.headerFilter
      // console.log(this.defConf,'this.defConf');
      this.parent.filterConfig(this.defConf)
    }

  }
</script>
<style lang="scss">
  .el-table th>.cell {
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>