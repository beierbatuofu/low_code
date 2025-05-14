<template>
	<div style="padding: 0px 1px 5px:cursor: move;">
		<draggable class="widget-form-tab" :list="syncConfigList" :group="group" ghost-class="ghost" :animation="200" @add="handleWidgetAdd" @end="$emit('change')" :move="onMove">
			<el-col
				v-for="(config, index) in syncConfigList"
				:key="index"
				style="position: relative; width: 100%; float: none"
				:style="{
					display: 'block',
					width: config.width,
				}"
			>
				<widget-form-item
					:class="[config.required ? 'required' : '', selectWidget.fieldId == config.fieldId ? 'active' : '', !whilelist.includes(config.type) ? 'widget-form-item' : 'widget-table-form']"
					@updateFieldConf="(conf) => getFielConf(conf, index)"
					@click.native="handleSelectWidget($event, index)"
					:config="config"
					:widgetForm="{ configList: syncConfigList }"
					:index="index"
					:select.sync="selectWidget"
					:ref="config.fieldId"
					:tab="fieldTabId"
					@selectTableIdx="selectTableIdx"
				></widget-form-item>
				<el-button title="删除" @click.stop="handleWidgetDelete(index)" class="widget-action-delete" v-if="selectWidget.fieldId == config.fieldId" circle plain size="small" type="danger">
					<i class="iconfont icon-delete"></i>
				</el-button>
				<el-button title="复制" @click.stop="handleWidgetClone(index)" class="widget-action-clone" v-if="selectWidget.fieldId == config.fieldId" circle plain size="small" type="primary">
					<i class="iconfont icon-copy"></i>
				</el-button>
			</el-col>
		</draggable>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop, PropSync, Watch } from "vue-property-decorator";
	import draggable from "vuedraggable";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import WidgetFormItem from "./WidgetFormItem";

	@Component({
		components: { draggable, "widget-form-item": WidgetFormItem },
	})
	export default class WidgetFormTab extends Vue {
		@PropSync("configList", { type: Array, default: () => [] }) syncConfigList!: Record<string, any>[];
		@Prop({ type: String, default: "" }) tid!: string;
		@PropSync("select", { type: Object, default: () => ({}) }) selectWidget!: Record<string, any>;
		@Prop({ type: Object, default: () => ({}) }) config!: Record<string, any>;
		@Prop({ type: String, default: "" }) tableProp!: string;

		private whilelist = ["table", "tab", "sn"];
		private selectIndex = 0;
		private group = { name: "form" };

		private get fieldTabId() {
			return this.config.fieldId + "," + this.tid;
		}

		private getFielConf(conf: Record<string, any>, index: number) {
			conf.tab = this.fieldTabId;
			this.syncConfigList[index] = conf;
		}

		private handleWidgetDelete(index: number) {
			this.syncConfigList.splice(index, 1);
			this.$nextTick(() => {
				this.handleSelectWidget(null, index - 1);
			});
		}

		private selectTableIdx(parentId: string, groupIdx: number, rowIdx: number, comp: Vue) {
			this.$emit("selectTableIdx", this.tid, 0, rowIdx, comp);
		}

		private handleWidgetClone(index: number) {
			let cloneConfig = RfieldCore.ins().copyFieldAttr(this.$utils.deepClone(this.syncConfigList[index]));
			this.syncConfigList.splice(index, 0, cloneConfig);
			this.$nextTick(() => {
				this.handleSelectWidget(null, index);
			});
		}

		private handleWidgetAdd(evt: Record<string, any>) {
			let activeIndex = evt.newIndex;

			if (evt.newItem && evt.newItem.type != "sn") {
				const item = evt.newItem;
				let config = (<Record<string, any>>RfieldCore.ins().createField(item)).config;
				if (activeIndex == -1) {
					this.syncConfigList.push(config);
					activeIndex = this.syncConfigList.length - 1;
				} else {
					this.syncConfigList.splice(activeIndex, 0, config);
					activeIndex = activeIndex;
				}
			}

			this.handleSelectWidget(null, activeIndex);
		}

		private handleSelectWidget(event: Event | null, index: number) {
			let item = this.syncConfigList[index];
			if (!item) return;
			// if (item.type == "tab" && item.tab) {
			// 	return this.syncConfigList.splice(index, 1);
			// }
			this.selectWidget = item;
			this.selectIndex = index;
			event && event.stopPropagation();

			this.$emit("changeSelect", this.tid, index);
		}
		private onMove(e: Record<string, any>, originalEvent: Record<string, any>) {
			// if (["table", "separator"].includes(e.draggedContext.element.type) && e.relatedContext.component.$el.className.indexOf("widget-form-table-content") > -1) {
			// 	return false;
			// }

			if (e.relatedContext.component.$el.className == "widget-form-list") {
				e.draggedContext.element.tab = "";
			}

			if (e.relatedContext.component.$el.className.indexOf("widget-form-table-content") > -1) {
				return false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.widget-form-tab {
		padding: 10px 5px;
		width: 100%;
		min-height: 103px;
		border: 1px solid #e4e7ed;
		//border-top: 0;
	}
</style>
