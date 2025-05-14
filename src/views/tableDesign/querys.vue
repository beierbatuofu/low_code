<!--
 * @Author: ben
 * @LastEditTime: 2022-05-19 09:25:59
-->
<template>
	<div class="TD-query">
		<slot name="top"></slot>
		<Draggable class="TD-queryList" @start="drag = true" @end="drag = false" animation="300" handle=".mover" chosenClass="chosen" v-model="getQueryList1">
			<div class="TD-queryItem mover" :class="[fieldId == item.fieldId ? 'TD-on' : '']" v-for="(item, index) in getQueryList1" :key="index" @click="handleSelectItem(item)">
				<div class="form-item">
					<label class="ql-label">{{ item | getLang }}</label>
					<component :is="getComponent(item)" v-bind="{ fieldId: item.fieldId }" :config="item"  orgin="queryDesign" />
				</div>
			</div>
		</Draggable>
	</div>
</template>
<script lang="ts">
	import { Component, Vue, Watch, Prop, Inject, Emit, PropSync } from "vue-property-decorator";
	import Draggable from "vuedraggable";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	@Component({
		components: {
			Draggable,
		},
	})
	export default class TDQuery extends Vue {
		@Inject("parent") readonly parent!: any;
		// @Prop({
		//   type: Array,
		//   default: () => [],
		// })
		// getQueryList!: any[];

		@PropSync("getQueryList", {
			type: Array,
			default: () => [],
		})
		getQueryList1!: any[];

		@Prop({
			type: String,
			default: "",
		})
		fieldId!: string;

		private handleSelectItem(conf: any) {
			this.parent.filterConfig(conf);
		}

		// 绑定选中的查询数组
		// private get newQueryList() {
		//   return this.getQueryList;
		// }
		// private set newQueryList(val: any) {
		//   this.$emit("newQueryList", val);
		// }

		private getComponent(setting: TJson) {
			let oFiled = (<any>RfieldCore.ins()).fieldConsMap[setting.type].fieldDef.ins();
			if (oFiled.queryComp) {
				return oFiled.queryComp;
			} else {
				return `Rfield-${setting.type}`;
			}
		}

		protected created() {}
	}
</script>

<style lang="scss" scoped>
	@import "./styles/index.scss";
	.ql-label {
		display: inline-block;
		font-size: 12px;
		max-width: 220px;
		@include ExtraNotDisplayed();
	}

	.TD-queryList {
		width: 100%;

		.TD-queryItem {
			margin-right: 3%;
			margin-bottom: 30px;
			position: relative;
			@include VertivalAlign(inline-block, text-bottom, 30%, null);

			.form-item {
				padding: 10px;
				box-sizing: border-box;
			}
			//遮罩 挡住时间
			&::before {
				content: "";
				cursor: pointer;
				@include PositionAbsoulte(0, 0, 0, 0);
				z-index: 2;
			}
		}
	}

	::v-deep .el-select {
		.el-el-input,
		.el-input--small,
		.el-input--suffix {
			.el-input__inner {
				height: 40px !important;
			}
		}
	}
	::v-deep .el-input__inner {
		text-align: center;
	}
	::v-deep .el-textarea__inner {
		text-align: center;
	}
</style>
