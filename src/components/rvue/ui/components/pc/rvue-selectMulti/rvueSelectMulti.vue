<!--- 下拉单选框 --->
<template>
	<div class="rvue-form-group1">
		<rvue-select
			style="width: 100%"
			:disabled="disabled"
			filterable
			clearable
			multiple
			v-model="selectValue"
			class="cus-select-tag"
			:collapse-tags="collapseTags"
			:reserve-keyword="reserveKeyword"
			:multiple-limit="multipleLimit"
			:autocomplete="autocomplete"
			:allow-create="allowCreate"
			:popper-class="popperClass"
			v-if="!readonly"
			:placeholder="placeholder"
		>
			<!-- <div>
				<el-checkbox style="margin-left: 12px; width: 90%" v-model="checkAll" @change="handleAllCheck"> {{ $t("global.selectAll") }}</el-checkbox>
			</div> -->
			<rvue-option v-for="item in setOptions" :key="item.value" :value="item.label" :label="item.label" class="cus-select-opt">
				{{ item.label }}
			</rvue-option>
		</rvue-select>

		<div v-if="readonly" class="widget-readonly">{{ String(selectValue) }}</div>
	</div>
</template>

<script lang="ts">
	import { Component, Watch, Vue, Prop, Model } from "vue-property-decorator";
	import Mixins from "../../../core/mixins";

	@Component({
		mixins: [Mixins],
		name: "rvueSelectMulti",
	})
	class rvueSelectMulti extends Vue {
		public static install: (param: Vue) => any;
		private checkAll: boolean = false;
		public static compName = "rvue-selectMulti";
		@Model("change", { type: [Array, String] }) value!: any[];
		@Prop({ type: Array, default: () => [] }) options!: any[]; //options选项设置
		@Prop({ type: Boolean, default: false }) collapseTags!: Boolean; //多选时是否将选中值按文字的形式展示
		@Prop({ type: Boolean, default: false }) reserveKeyword!: Boolean; //多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
		@Prop({ type: Number, default: 0 }) multipleLimit!: number; //  多选时用户最多可以选择的项目数，为 0 则不限制
		@Prop({ type: String, default: "" }) autocomplete!: string; //select input 的 autocomplete 属性
		@Prop({ type: Boolean, default: false }) allowCreate!: Boolean; //是否允许用户创建新条目，需配合 filterable 使用
		@Prop({ type: String, default: "cus-select-popper" }) popperClass!: string; //select input 的 autocomplete 属性
		@Prop({ type: Boolean, default: true }) popperAppendToBody!: Boolean; //是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
		@Prop({ type: String, default: "请选择" }) placeholder!: String; //placeholder
		private get selectValue() {
			// this.checkAll = (<any>this).value.length == this.options.length ? true : false;
			return (<any>this).value;
		}

		private set selectValue(n: any) {
			// this.checkAll = n.length == this.options.length ? true : false;
			this.$emit("change", n);
		}

		private get setOptions() {
			return (<any>this).options;
		}

		private handleAllCheck() {
			if (this.checkAll) {
				(<any>this).selectValue = [];
				for (let item in this.setOptions) {
					!this.selectValue.includes(this.setOptions[item].label) && (<any>this).selectValue.push(this.setOptions[item].label);
				}
			} else {
				(<any>this).selectValue = [];
			}
			//更新全选按钮的el-checkbox状态，使其为不确定状态
			//this.isIndeterminate = false;
		}
	}
	rvueSelectMulti.install = function (Vue: any) {
		Vue.component(rvueSelectMulti.compName, rvueSelectMulti);
	};

	export default rvueSelectMulti;
</script>
<style lang="scss" scoped>
	.single-line-thin {
		border-bottom: 1px solid #cbcbcb;
	}

	::v-deep .el-select-dropdown {
		//min-width: 30% !important;
		z-index: 10001 !important;
	}

	// 如何解决el-option的长度和el-select保持一致，目前内容超长会
	::v-deep .cus-select-opt {
		display: inline-grid;
		width: 100%;
		max-width: 100%;
		white-space: nowrap;
	}

	// 修改el-select 中tag的样式， 防止其文字过长导致超出组件边界
	::v-deep .cus-select-tag {
		.el-select__tags-text {
			display: inline-block;
			max-width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.el-select .el-tag__close .el-icon-close {
			top: -7px;
		}

		.el-tag {
			height: auto;
			// max-width: 94%;
		}
	}

	::v-deep .el-select__tags {
		max-width: 94%;
		overflow: hidden;
		// text-overflow: ellipsis;
		display: inline-block;
		white-space: nowrap;
		margin: 0 7px;
	}

	//修改el-select 下拉框 dropdown的样式
	.cus-select-popper {
		.el-select-dropdown__item {
			padding-left: 30px !important;
		}

		.el-select-dropdown__item span {
			overflow: hidden;
			text-overflow: ellipsis;
			margin-left: 10px;
		}

		.el-select-dropdown__item.selected::after {
			visibility: hidden; // 选中选项后， 隐藏在后面显示的对号
		}

		// 选中选项后， 在选项前显示对号
		.el-select-dropdown__item.selected::before {
			@include PositionAbsoulte(null, null, null, 8px);
			margin-left: 4px;
			font-family: element-icons;
			content: "\e6da";
			font-size: 12px;
			font-weight: 700;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			color: #0b0;
		}
	}
	::v-deep .el-select {
		overflow: hidden;
	}
</style>

<style>
	/* .rvue-form-group1 {
		min-height: 44px;
	} */
</style>
