<template>
    <div class="rvue-table">
      <el-table :data="data" border stripe style="max-width:99%;" height="400px" @selection-change="handleSelectionChange" :fit="fit" :size="size" :highlight-current-row="highlightcurrentrow" :lazy="lazy">
        <el-table-column type="selection" width="50" align="center" v-if='isSelect'>
        </el-table-column>
        <el-table-column v-for="(col,index) in tableList" :key="index" :prop="col.fieldId" align="center" :fixed="fixed" :label="col | getLang" >
            <!-- <template v-slot:header>
              <slot name="header">
              </slot>
            </template> -->
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background :page-sizes="[pageSize]" :current-page.sync="currentPage" :page-size="pageSize" layout="sizes,prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>
<script lang="ts">
  import {
    Component,
    Vue,
    Watch,
    Prop,
    PropSync,
    Inject
  } from "vue-property-decorator";


  @Component({})
  export default class RvueTable extends Vue {
    public static install: (param: Vue) => any;
		public static compName = "rvue-table";
    @Prop({
      type: Array,
      default: () => ([])
    }) tableList!: any; //表头数据
    @Prop({
      type: Number,
      default: 10
    }) pageSize!: number; //传入的pageSize

     @Prop({
      type: Array,
      default: () => ([])
    }) data!: any; //表格数据

    @Prop({
      type: Number,
      default: 0
    }) total!: number; // 总条数

    @Prop({
      type: Number,
      default: 1
    }) currentPage!: number; // 总条数

    @Prop({
      type: Boolean,
      default: true
    }) isSelect!: boolean; // 是否显示勾选列

    @Prop({
      type: Boolean,
      default: true
    }) fit!: boolean; // 列的宽度是否自撑开

     @Prop({
      type: String,
      default: ''
    }) size!: string;  //	Table 的尺寸 medium / small / mini

    @Prop({
      type: Boolean,
      default: false
    }) highlightcurrentrow!: boolean; // 是否要高亮当前行

    @Prop({
      type: Boolean,
      default: false
    }) lazy	!: boolean; //是否懒加载子节点数据

    @Prop({
      type: Boolean || String,
      default: false
    }) fixed	!: boolean | string; //列是否固定在左侧或者右侧，true 表示固定在左侧  true, left, right

    protected created() {

    }

    // 表格勾选事件
    handleSelectionChange(val: any) {
      this.$emit('selection-change',val)
      // console.log(val, '变了');
    }

  }
</script>
<style lang="scss" scoped>
  .el-table th>.cell {
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>