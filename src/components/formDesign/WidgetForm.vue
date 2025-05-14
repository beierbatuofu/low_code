<template>
	<div class="widget-form-container">
		<el-form ref="widgetForm" size="small">
			<el-row>
				<draggable class="widget-form-list" :list="widgetForm.configList" :group="group" ghost-class="ghost" :animation="300" @add="handleWidgetAdd" @end="$emit('change')" :move="onMove">
					<!-- 给拖拽加唯一标志 -->

					<el-col
						v-for="(config, index) in widgetForm.configList"
						:key="index"
						style="position: relative; width: 100%; float: none"
						:style="{
							display: 'block',
							width: config.width,
						}"
					>
						<!--
						 分组
					 -->
						<!--<div
							class="widget-form-group"
							v-else-if="column.type == 'group'"
							:key="column.prop"
							:class="{
								active: selectWidget.prop == column.prop,
							}"
							@click="handleSelectWidget(index)"
						>
                  
							 <widget-form-group
								:data="data"
								:column="column"
								:index="index"
								:select.sync="selectWidget"
								@change="$emit('change')"
							> 
							</widget-form-group>
						</div>-->

						<el-col :key="index" :xs="24" :offset="config.offset || 0">
							<widget-form-item
								:class="[
									config.required ? 'required' : '',
									selectWidget.fieldId == config.fieldId ? 'active' : '',
									!whilelist.includes(config.type) ? 'widget-form-item' : 'widget-table-form',
								]"
								@updateFieldConf="(conf) => getFielConf(conf, index)"
								@click.native="handleSelectWidget(index)"
								:config="config"
								:widgetForm="widgetForm"
								:isInTable="false"
								:index="index"
								:selectWidget="selectWidget"
								:select.sync="selectWidget"
								:ref="config.fieldId"
								@selectBoxIdx="selectBoxIdx"
								:tabClickMaps="tabClickMaps"
							></widget-form-item>
						</el-col>
						<!--
						 子表单
					 -->
						<!-- <div
							class="widget-form-table"
							v-if="config.type == 'table'"
							:key="config.fieldId"
							:class="{
								active: selectWidget.fieldId == config.fieldId,
							}"
							@click="handleSelectWidget(index)"
						>
							<widget-form-table :widgetForm="widgetForm" :tableConfig="config" :children="config.children" :index="index" :select.sync="selectWidget"></widget-form-table>
						</div> -->

						<el-button
							title="删除"
							@click.stop="handleWidgetDelete(index)"
							class="widget-action-delete"
							v-if="selectWidget.fieldId == config.fieldId"
							circle
							plain
							size="small"
							type="danger"
						>
							<i class="iconfont icon-delete"></i>
						</el-button>
						<el-button
							title="清空"
							@click.stop="handleWidgetClear(index)"
							class="widget-action-clear"
							v-if="selectWidget.fieldId == config.fieldId && selectWidget.type == 'table'"
							circle
							plain
							size="small"
							type="warning"
						>
							<i class="iconfont icon-clear"></i>
						</el-button>
						<el-button
							title="复制"
							@click.stop="handleWidgetClone(index)"
							class="widget-action-clone"
							v-if="selectWidget.fieldId == config.fieldId && selectWidget.type != 'tab'"
							circle
							plain
							size="small"
							type="primary"
						>
							<i class="iconfont icon-copy"></i>
						</el-button>
					</el-col>
				</draggable>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import WidgetFormItem from "./WidgetFormItem";

	import Draggable from "vuedraggable";
	import lang from "./core/lang";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	export default {
		mixins: [lang],
		name: "widget-form",
		components: { Draggable, WidgetFormItem },
		props: ["widgetForm", "select", "value", "fieldUi"],
		data() {
			return {
				selectWidget: this.select,
				selectIndex: 0,
				whilelist: ["table", "tab", "sn"],
				group: { name: "form" },
				tabClickMaps: {},
			};
		},
		methods: {
			getFielConf(conf, index) {
				this.widgetForm.configList[index] = conf;
			},
			selectBoxIdx(parentId, groupIdx, rowIdx, comp) {
				this.$emit("selectBoxIdx", { parentId, groupIdx, rowIdx, comp });
			},
			handleSelectWidget(index) {
				this.selectWidget = this.widgetForm.configList[index];
				this.selectIndex = index + 1;
				this.$emit("updateWidgetConfig", index);
				this.$emit("selectBoxIdx", {});
			},
			handleWidgetClear(index) {
				this.widgetForm.configList[index].children = [];
				this.selectWidget = this.widgetForm.configList[index];

				this.$emit("change");
			},
			handleWidgetAdd(evt) {
				let activeIndex = evt.newIndex;
				if (evt.newItem) {
					const item = evt.newItem;
					let config = RfieldCore.ins().createField(item).config;
					if (activeIndex == -1) {
						this.widgetForm.configList.push(config);
						activeIndex = this.widgetForm.configList.length - 1;
					} else {
						this.widgetForm.configList.splice(activeIndex, 0, config);
						activeIndex = activeIndex;
					}
				}
				this.handleSelectWidget(activeIndex);
			},
			handleWidgetDelete(index) {
				if (this.widgetForm.configList.length - 1 === index) {
					if (index === 0) {
						this.selectWidget = {};
						this.$emit("updateWidgetConfig", -1);
					} else this.handleSelectWidget(index - 1);
				} else this.handleSelectWidget(index + 1);

				this.$nextTick(() => {
					this.widgetForm.configList.splice(index, 1);
					this.$emit("change");
				});
			},
			handleWidgetClone(index) {
				let cloneConfig = RfieldCore.ins().copyFieldAttr(this.$utils.deepClone(this.widgetForm.configList[index]));

				this.widgetForm.configList.splice(index + 1, 0, cloneConfig);

				this.$nextTick(() => {
					this.handleSelectWidget(index);
					this.$emit("change");
				});
			},
			onMove(e, originalEvent) {
				if (["tab", "sn"].includes(e.draggedContext.element.type) && e.relatedContext.component.$el.className == "widget-form-tab") {
					return false;
				}

				if (e.to.className.indexOf("widget-form-table-content") > -1) {
					return false;
				}
			},
		},
		watch: {
			select(val) {
				this.selectWidget = val;
			},
			selectWidget: {
				handler(val) {
					this.$emit("update:select", val);
				},
				deep: true,
			},
		},
	};
</script>
