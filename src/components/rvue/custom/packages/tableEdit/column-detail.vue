<template>
	<div>
		<el-drawer title="" class="titleDrawer" :append-to-body="true" :visible="visible" :before-close="handleClose" :size="bMobile ? '100%' : '60%'">
			<i class="el-icon-close close-btn" @click="closeHandler"></i>

			<div class="drawer-title">{{ tableTitle }}-{{ privateIndex + 1 }}</div>

			<template v-for="(column, cindex) in configList">
				<el-col style="padding: 0 25px; font-weight: 700" v-if="column.visible && column.type" :key="cindex" :span="setWidth(column)" :md="setWidth(column)" :offset="column.offset || 0">
					<div style="font-size: 14px; color: #606266; margin-bottom: 10px">
						<span style="color: red" v-if="column.required && !allReadonly">*</span>
						{{ column | getLang }}
					</div>
					<div class="widget-config-desc" v-html="column.desc" />
					<!-- 因为要套在rvue-form用同一套验证所以 -->
					<el-form-item :error="customError[column.fieldId + `_$${rowIdx}`]" :rules="column.rule">
						<component
							:ref="setTableProp(column.fieldId)"
							:is="`rfield-${column.type}`"
							:config="column"
							:form="form"
							:tableProp="tableProp"
							:columnIndex="privateIndex"
							:fieldId="column.fieldId"
							:allReadonly="allReadonly"
							:isTableDetail="true"
							mode="normal"
							@input="(value) => handleUpdate(column.fieldId)"
							@update="(value) => handleUpdate(column.fieldId)"
							@change="(value) => handleUpdate(column.fieldId)"
						>
						</component>
					</el-form-item>
				</el-col>
			</template>
			<div class="btn-list" v-if="Object.prototype.toString.call(isMobile) !== '[object Null]'">
				<rvue-button class="delete" @click="delRow">删除此行</rvue-button>
				<rvue-button type="primary" @click="visible = false">确定</rvue-button>
			</div>
		</el-drawer>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop } from "vue-property-decorator";
	import formTemp from "../../components/formTemp.vue";
	import RelationCore from "@/components/rvue/custom/packages/form/core/relationCore";

	@Component({
		components: {
			formTemp,
		},
	})
	export default class ColumnDetail extends Vue {
		@Prop({ type: Array, default: () => [] }) configList!: any;
		@Prop({ type: Object, default: () => {} }) form!: any;
		@Prop({ type: Array, default: () => [] }) tableList!: any;
		@Prop({ type: String, default: "" }) tableProp!: string;
		@Prop({ type: String, default: "" }) tableTitle!: string;
		@Prop({ type: Boolean, default: false }) allReadonly!: boolean; //是否可编辑
		@Prop({ type: Array, default: () => [] }) isMobile!: any;
		@Prop({ type: Number, default: 0 }) rowIdx!: number;
		@Prop({ type: Object, default: () => ({}) }) customError!: Record<string, any>;
		private visible: boolean = false;
		private privateIndex: number = 0;

		private initRow: any = {};

		private bMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
		private setTableProp(fieldId: string) {
			return this.tableProp + ".data" + "." + this.privateIndex + "." + fieldId;
		}

		private handleUpdate(fieldId: string) {
			RelationCore.ins().onEvent(fieldId);
		}

		private visibleHandler(index: number) {
			//清空
			this.privateIndex = index;
			this.visible = true;
			this.initRow = this.$utils.deepClone(this.form[this.tableProp]["data"][this.privateIndex]);
		}
		private setWidth(column: TJson) {
			let width: any = String(column.width);

			// return column.width ? (width.replace("%", "") / 100) * 24 : 24;
			return 24;
		}
		private handleClose(done: () => {}) {
			//清空抽屉内表单
			// this.config.column.forEach((element: any) => {
			// 	if ((<any>this).$refs[element.fieldId]) {
			// 		(<any>this).$refs[element.fieldId][0].$refs.temp.value = "";
			// 	}
			// });
			//手动清空表格内验证

			this.visible = false;
		}

		private setFormDefaultValue() {
			// //form赋值 响应内部抽屉初始化
			// let tempList = (<any>this).$utils.deepClone(this.tableList);
			// this.$set(this.form, this.tableProp, []);
			// this.config.column.forEach((item: TJson) => {
			// 	this.$set(this.form, item.prop + this.privateIndex, this.getDefaultValue(item));
			// 	if (item.prop === "_index") {
			// 		return;
			// 	} else {
			// 		this.$set(this.form, item.prop + this.privateIndex, this.getDefaultValue(item));
			// 	}
			// });
		}

		// private getDefaultValue(item: TJson) {
		// 	let { language } = this.$store.state.lang;
		// 	let key: string = Object.keys(item).find((k) => /^default.+/.test(k)) || "";
		// 	if (item.hasOwnProperty("defaultValue")) return item.defaultValue.custom[language];
		// 	if (item.hasOwnProperty(key)) return item[key];
		// 	return "";
		// }

		private delRow() {
			//编辑--修改状态  新增--直接删除

			if (this.form[this.tableProp]["data"][this.privateIndex]["id"]) {
				this.$set(this.form[this.tableProp]["data"][this.privateIndex], "status", "D");
			} else {
				this.form[this.tableProp]["data"].splice(this.privateIndex, 1);
			}
			this.visible = false;
		}

		private closeHandler() {
			//初始化当前form
			this.$set(this.form[this.tableProp]["data"], this.privateIndex, this.initRow);
			this.visible = false;
		}
		// protected created() {
		// 	this.$nextTick(() => {
		// 		this.setFormDefaultValue();
		// 	});
		// }
	}
</script>
<style lang="scss" scoped>
	.titleDrawer {
		.drawer-title {
			font-weight: 700;
			padding: 25px;
			padding-top: 0;
		}
	}
	.btn-list {
		display: flex;
		width: 100%;
		justify-content: center;
		.delete {
			margin-right: 5px;
		}
	}
	.close-btn {
		position: absolute;
		top: 20px;
		right: 20px;
		cursor: pointer;
	}
	::v-deep .el-drawer__close-btn {
		display: none;
	}
</style>
