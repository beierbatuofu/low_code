<!--
 * @Author: ben
 * @LastEditTime: 2022-01-18 11:07:21
-->
<template>
	<div class="rvue-form-group" @click="handleClick">
		<rvue-tabs ref="tab" v-model="activeName" @tab-click="selectTabIdx" type="border-card">
			<rvue-tab-pane v-for="(item, index) in filterConfigList" :key="index" :label="label(item.title)" :name="item.id">
				<div>
					<widget-form-tab
						v-if="mode == 'design'"
						:config="config"
						:ref="`widgetFormTab_${item.id}`"
						@changeSelect="handleSelect"
						@selectTableIdx="selectTableIdx"
						:select.sync="syncSelect"
						:configList.sync="item.configList"
						:tid="item.id"
					></widget-form-tab>
					<div v-else style="min-height: 50px; padding: 0 20px; border: 1px solid #e4e7ed; border-top: 0; overflow: hidden">
						<form-item
							:formType="formType"
							:customError="customError"
							:allReadonly="allReadonly"
							@change="handlerSetForm"
							:form="form"
							v-for="(conf, idx) in item.configList"
							:config="conf"
							:key="idx"
						>
						</form-item>
					</div>
				</div>
			</rvue-tab-pane>
		</rvue-tabs>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, PropSync, Watch } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfTab";
	import draggable from "vuedraggable";
	import WidgetFormTab from "../../../formDesign/WidgetFormTab.vue";
	import FormItem from "./_components/formItem";
	import RelationCore from "@/components/rvue/custom/packages/form/core/relationCore";
	import { FormModule } from "@/store/modules/form";
	@Component({
		components: {
			draggable,
			"widget-form-tab": WidgetFormTab,
			"form-item": FormItem,
		},
	})
	export default class RvueFieldTab extends WidgetField {
		@PropSync("select", { type: Object, default: () => ({}) }) syncSelect!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) rules!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) customError!: Record<string, string>;
		@Prop({ type: Object, default: () => ({}) }) tabClickMaps!: Record<string, any>;

		private activeName = "";
		private tabForm: Record<string, any> = {};
		private tabIdx = 0;

		private handleClick(evt: Event & { target: { className: string; getAttribute: (attr: string) => string } }) {
			if (evt.target.getAttribute("role") == "tab") {
				evt.stopPropagation();
			}
		}

		private handleSelect(tid: string, index: number) {
			this.$emit("selectTabIdx", this.config.fieldId, tid, index, this);
		}

		private selectTableIdx(tid: string, groupIdx: number, rowIdx: number, comp: Vue) {
			this.$emit("selectTabIdx", this.config.fieldId, tid, rowIdx, comp);
		}

		private label(title: TJson) {
			let lang = localStorage.getItem("lang") || "zh";
			return title[lang];
		}
		private selectTabIdx() {
			this.tabIdx = this.config.children.findIndex((item: Record<string, any>) => item.id == this.activeName);
			this.tabClickMaps[this.config.fieldId] = this.activeName;
		}

		private handlerSetForm(value: any, fieldId: string, type: string = "") {
           console.log(131);
			this.$set(this.form, fieldId, value);
         RelationCore.def.evtData = {
					parentFieldId: undefined,
					rowIdx: -1,
				};
			RelationCore.ins().onEvent(fieldId);
		}

		private get filterConfigList() {
			let children = this.config.children;
			if (this.mode == "design") return children;
			let list = children.filter((item: Record<string, any>) => item.configList.some((conf: Record<string, any>) => conf.visible));
			list.length == 0 && (this.config.visible = false);
			return list;
		}

		protected created() {
		
			if (this.mode !== "design") {
				let result = this.config.children.find((item: Record<string, any>) => item.configList.length);
				result && (this.activeName = result.id);
			}

			this.config.children &&
				this.config.children.forEach((item: Record<string, any>, tIdx: number) => {
					item?.configList &&
						item.configList.forEach((conf: Record<string, any>) => {
							let fieldId = conf.fieldId;
							let bool = fieldId && conf.visible;
							let filters = ["separator"];
							if (bool && !filters.includes(conf.type)) {
								let defVal: any;
								defVal = this.form[fieldId] || conf.defVal;
								if (defVal == "undefined") defVal = undefined;
								this.$set(this.form, fieldId, defVal);
							}
						});
				});
		}

		@Watch("widgetForm", { deep: true, immediate: true })
		watchWidgetForm(n: any, o: any) {
			this.activeName = this.tabClickMaps.hasOwnProperty(this.config.fieldId) ? this.tabClickMaps[this.config.fieldId] : this.config.children[this.tabIdx]?.id || this.config.children[0].id;
		}
	}
</script>
<style lang="scss" scoped>
	::v-deep {
		.el-tabs--border-card {
			box-shadow: none;
		}
		.el-form-item__error {
			position: relative;
		}
		.el-tab-pane {
			& > div {
				& > div {
					padding-bottom: 20px !important;
					border-top-style: solid !important;
					border-top-color: rgb(228, 231, 237) !important;
					border-width: 1px !important;
				}
			}
		}
		.widget-form-container {
			min-height: 100px;
		}
		.el-tabs__item.is-active {
			background: #fff;
			color:#6087FD;
		}
		.tablist .el-form-item {
			margin-bottom: 22px !important;
			padding: 0 20px !important;
		}
		.el-tabs__item {
			max-width: 150px !important;

			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.el-tabs__nav {
			height: 40px;
		}
	}
</style>
