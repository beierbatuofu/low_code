<template>
	<div>
  	<rvue-label :label="'显示字段'" />
    <div class="header-filter">
      <el-radio v-model="config.headerFilter" label="no" @change="radioHandler">不筛选</el-radio>
			<el-radio v-model="config.headerFilter" label="yes" @change="radioHandler">自定义筛选
        <span v-if="config.headerFilter=='yes'" class="add" @click="addFilter"> +</span>
      </el-radio>
    </div>

    <div class="sortList" v-show="config.headerFilter=='yes'">
      <Draggable @start="drag=true" @end="drag= false" animation="300" handle=".mover" chosenClass="chosen" v-model="newFields">
         <div v-for="(item,index) in newFields" :key="index" class="drag-item">
          <i class="el-icon-s-operation mover"></i>
          <span v-if="item.title">{{item | getLang }} </span>
          <span v-else>{{$t('tableDesign.'+item.fieldId)}}</span>
        </div>
      </Draggable>
    </div>

		<rvue-label :label="'默认排序'" />
		<div class="sequence">
			<el-select class="sequence-left" v-model="tabSelect" :size="size" :multiple="multiple" :placeholder="$t('global.pleaseChoose')" style="width: 50%">
				<el-option v-for="item in config.sortOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
			</el-select>
			<div class="sequence-right">
				<el-radio v-model="config.sortOrder" label="asc" @change="radioHandler">升序</el-radio>
				<el-radio v-model="config.sortOrder" label="desc" @change="radioHandler">降序</el-radio>
			</div>
		</div>
		<rvue-label :label="'每页条数'" />
		<el-select v-model="pageSelect" :size="size" :multiple="multiplePage" :placeholder="$t('global.pleaseChoose')" style="width: 50%" @change="pageSelectChange">
			<el-option v-for="item in config.pageOptios" :key="item.value" :label="item.label" :value="item.value"> </el-option>
		</el-select>
	</div>
</template>
<script lang="ts">
	import { Component, Watch, Prop, Inject, InjectReactive } from "vue-property-decorator";
	import BaseAttr from "../../core/BaseAttr";
  import Draggable from "vuedraggable";

	@Component({
		components: {
			Draggable,
		},
	})
	export default class TDtableSet extends BaseAttr {
		@Inject("parent") readonly parent!: any;

    @Prop({
			type: Array,
			default: () => [],
		})
		getTabTitleList!: any[];

    private newFields =[]
		private checkList: any = [];

		private data = [];
		private total = 0;
		private sizes: number = 20;
		private list: any[] = [];

    @Watch('config.headerFilter')
    onChangeFilter(val:string){
      if(val=='no'){
        this.parent.resetTitleList()
      }
    }

    @Watch('getTabTitleList',{
      immediate:true,
      deep:true
    })
    onChangegetTabTitleList(val:any){
      this.newFields = val
    }

    @Watch('newFields',{
      immediate:true,
      deep:true
    })
    onChangenewFields(val:any){
       this.parent.setTableTitleList(val)
    }

		private get tabSelect() {
			return (<any>this).config.sortCondition;
		}

  //默认排序条件
		private set tabSelect(val: any) {
			(<any>this).config.sortCondition = val;
      this.$emit('confChange',this.config)
		}

		private get multiple() {
			return Array.isArray((<any>this).config.sortCondition);
		}

		private get pageSelect() {
			return (<any>this).config.pageSize;
		}
    // 每页条数
		private set pageSelect(val: any) {
			(<any>this).config.pageSize = val;
       this.$emit('confChange',this.config)
		}

		private get tabRadio() {
			return (<any>this).config.sortOrder;
		}
     //排序顺序
		private set tabRadio(val: any) {
			(<any>this).config.sortOrder = val;
       this.$emit('confChange',this.config)
		}
    private radioHandler(){
      this.$emit('confChange',this.config)
    }

		private get multiplePage() {
			return Array.isArray((<any>this).config.pageSize);
		}


    private addFilter(){
      this.parent.handleAddTable()
    }

  //切换排序条件
		private pageSelectChange() {
			this.$emit("pageSelectChange", this.config.pageSelect);
		}
		protected created() {
     
    }
	}
</script>

<style lang="scss" scoped>
	.sequence {
		width: 100%;
		overflow: hidden;

		.sequence-left {
			display: inline-block;
			width: 45%;
			margin-right: 12px;
		}

		.sequence-right {
			display: inline-block;
			width: 45%;

			.el-radio:first-child {
				margin-right: 10px;
			}
		}
	}
  .header-filter{
    // display: inline-block;
    height: 46px;
    .el-radio{
      display:block;
      margin-top: 10px;;
      .add{
        font-size: 20px;
        vertical-align: baseline;
        margin-left:10px;
      }
    }
  }
  .sortList{
    margin:20px 0;
    .drag-item{
      height: 24px;
      line-height: 24px;
      margin-top: 5px;
      i{
         vertical-align: middle;
      }
    }
    .drag-item>span {
      @include ExtraNotDisplayed();
      text-indent: 10px;
      margin-left: 10px;
      @include VertivalAlign(inline-block,middle,80%,null);
      border: 1px solid #ccc;
    }
  }


</style>
