<template>
	<rvue-dialog :visible.sync="syncVisible" :title="titleTname"  width="500px" :destroy-on-close="true" @closed="handleCancel">
		<div slot="title" class="dialog-title">
			<div class="dialog-title-font">{{titleTname}}</div>
		</div>
		<div class="TD-dialog">
			<div class="drag-item">
				<span style="margin-left: 8px">{{ $t("global.selectAll") }}</span>
				<!-- 全选按钮 -->
				<el-checkbox class="checkbox" v-model="checkAll" @change="handleCheckAllChange"><span /></el-checkbox>
			</div>
			<el-checkbox-group v-model="selectList" class="checklist">
				<div v-for="(item, index) in allList" :key="index" class="drag-item">
					<i class="mover"></i>
					<span v-if="item">{{ item | getLang }} </span>
					<span v-else>{{ $t("tableDesign." + item.fieldId) }}</span>
					<el-checkbox :label="item.fieldId" class="checkbox" @change="handleCheckbox"><span /></el-checkbox>
				</div>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel" style="margin: 0 5px" size="mini">{{ $t("global.cancel") }}</el-button>
			<el-button type="primary" @click="handleConfirm" size="mini" style="margin: 0 5px">{{ $t("global.confirm") }}</el-button>
		</div>
	</rvue-dialog>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, PropSync, Inject } from "vue-property-decorator";

	@Component({})
	export default class TDDialog extends Vue {
		@PropSync("visible", {
			type: Boolean,
			default: false,
		})
		syncVisible!: boolean;
		@Prop({
			type: Array,
			default: () => [],
		})
	
		checkList!: TJson[]; //所选中的模块数组
		@Prop({
			type: Array,
			default: () => [],
		})
		allList!: TJson[]; //所有的模块数组
		@Prop({
			type: Array,
			default: () => [],
		})
		config!: TJson[];

		@Prop({
			type:String
		})
		titleName!:TJson
	
		private checkAll: boolean = false;
		private titleTname:string="";
		private selectList = [];
		private oldSelectList = [];

		private filter(list: any): [] {
			return (<any>this).allList.filter((item: any) => list.includes(item.fieldId));
		}

		private dataFilter(list: TJson[]): TJson[] {
			return list.map((item: TJson) => ({
				...item,
				// ...(<TJson>fieldsConfig)[item.type],
				//config 中包含选择字段 直接覆盖字
				...(this.config.find((ite: TJson) => ite.fieldId == item.fieldId) || {}),
			}));
		}

		// 取消
		private handleCancel() {
			this.syncVisible = false;
			this.selectList = this.oldSelectList;
			(<any>this).handleCheckbox();
		}
		// 確定
		private handleConfirm() {
			this.syncVisible = false;
			let selectList = this.filter(this.selectList);
			this.$emit("defineCheckList", {
				check: this.dataFilter(selectList),
				allList: this.allList,
			});
		}
		//全选
		private handleCheckAllChange(val: boolean) {
			(<any>this).selectList = val ? this.allList.map((item: TJson) => item.fieldId) : [];
		}
		// 全选反选
		private handleCheckbox(val: any) {
			this.checkAll = this.selectList.length == this.allList.length;
		}

		@Watch("allList", {
			immediate: true,
			deep: true,
		})
		private onChangeAllList(val: any) {
			(<any>this).selectList = this.checkList.map((item: TJson) => item.fieldId);
			(<any>this).handleCheckbox();
		}

		@Watch("checkList", {
			immediate: true,
			deep: true,
		})
		onChangeCheckList(val: any) {
			// console.log(this.allList,'allList');

			(<any>this).selectList = this.checkList.map((item: TJson) => item.fieldId);

			(<any>this).oldSelectList = this.checkList.map((item: TJson) => item.fieldId);
			(<any>this).handleCheckbox();
		}

		@Watch("titleName",{
			immediate: true,
			deep: true,
		})
		onName(val:any){
			//console.log(this.titleName);
			if(val=='addQueryCriteria'){
				this.titleTname='添加查询条件'
			}else{
				this.titleTname='添加操作按钮'
			}
		}

		protected created() {}
	}
</script>
<style lang="scss" scoped>
	.drag-item > span {
		@include ExtraNotDisplayed();
		@include VertivalAlign(inline-block, text-bottom, 80%, null);
	}
	.checklist {
		max-height: 400px;
		overflow-y: auto;
	}

	.checklist::-webkit-scrollbar {
		display: none;
	}
	.TD-dialog{
		padding: 5px 0px;
	}
</style>
