<template>
	<div v-if="loading">
		<draggable
			class="widget-form-table-content"
			:class="`widget-form-table-prop-${tableConfig.fieldId}`"
			:list="tableConfig.children"
			:group="{ name: 'form' }"
			ghost-class="ghost"
			:animation="200"
			handle=".widget-form-table-item"
			@add="handleWidgetTableAdd($event, tableConfig)"
			@end="$emit('change')"
			:move="onMove"
		>
			<template v-if="Array.isArray(tableConfig.children) && tableConfig.children.length > 0">
				<div
					v-for="(itemConfig, tableIndex) in tableConfig.children"
					:key="itemConfig.fieldId"
					class="widget-form-table-item"
					:class="{
						active: selectWidget.fieldId == itemConfig.fieldId,
					}"
					:style="{
						width: itemConfig.width ? `${itemConfig.width}px` : '33.3%',
						minWidth: '33.3%',
					}"
					@click.stop="handleWidgetTableSelect(itemConfig, tableIndex)"
				>
					<div class="table-title" :class="!itemConfig.titleShow ? 'hidden' : ''">{{ itemConfig | getLang }}</div>
					<div class="table-range">
						<widget-form-item
							:tableProp="tableConfig.fieldId"
							:columnIndex="0"
							@updateFieldConf="(conf) => getFielConf(conf, tableIndex)"
							:config="itemConfig"
							:widgetForm="widgetForm"
						></widget-form-item>
						<el-button
							title="删除"
							@click.stop="handleWidgetTableDelete(tableConfig, tableIndex)"
							class="widget-table-action-delete"
							v-if="selectWidget.fieldId == itemConfig.fieldId"
							circle
							plain
							size="small"
							type="danger"
						>
							<i class="iconfont icon-delete"></i>
						</el-button>
						<el-button
							title="复制"
							@click.stop="handleWidgetTableClone(tableConfig, tableIndex)"
							class="widget-table-action-clone"
							v-if="selectWidget.fieldId == itemConfig.fieldId"
							circle
							plain
							size="small"
							type="primary"
						>
							<i class="iconfont icon-copy"></i>
						</el-button>
					</div>
					<!-- <el-table class="design-table" :data="[itemConfig]" border height="162px">
						<el-table-column :prop="itemConfig.fieldId">
							<template #header>
								<div v-if="itemConfig.titleShow"><span v-if="itemConfig.required" style="color: red">*</span>{{ itemConfig | getLang }}</div>
							</template>
							<div class="table-range">
								<widget-form-item
									:tableConfig="{
										tableProp: tableConfig.fieldId,
										columnIndex: 0,
									}"
									@updateFieldConf="(conf) => getFielConf(conf, tableIndex)"
									:config="itemConfig"
									:widgetForm="widgetForm"
								></widget-form-item>
							</div>
							<el-button
								title="删除"
								@click.stop="handleWidgetTableDelete(tableConfig, tableIndex)"
								class="widget-table-action-delete"
								v-if="selectWidget.fieldId == itemConfig.fieldId"
								circle
								plain
								size="small"
								type="danger"
							>
								<i class="iconfont icon-delete"></i>
							</el-button>
							<el-button
								title="复制"
								@click.stop="handleWidgetTableClone(tableConfig, tableIndex)"
								class="widget-table-action-clone"
								v-if="selectWidget.fieldId == itemConfig.fieldId"
								circle
								plain
								size="small"
								type="primary"
							>
								<i class="iconfont icon-copy"></i>
							</el-button>
						</el-table-column>
					</el-table> -->
				</div>
			</template>
			<!-- <template v-else>
				<rvue-empty size="50" style="width: 100%" desc="拖拽字段至此"></rvue-empty>
			</template> -->
		</draggable>
	</div>
</template>
<script>
	import WidgetFormItem from "./WidgetFormItem";
	import draggable from "vuedraggable";
	import lang from "./core/lang";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";

	export default {
		name: "widget-form-table",
		props: ["widgetForm", "tableConfig", "select", "index", "tab", "formType"],
		components: { WidgetFormItem, draggable },
		mixins: [lang],
		data() {
			return {
				selectWidget: this.select,
				loading: false,
				timer: null,
			};
		},
		methods: {
			getFielConf(config, cidx) {
				config.tab = this.tab;
				this.widgetForm.configList[this.index].children[cidx] = config;
			},
			handleSelectWidget(index) {
				this.selectWidget = this.widgetForm.configList[index];
				this.$emit("updateWidgetConfig", index);
				// this.selectWidget.isInTable = true
			},
			handleWidgetClear(index) {
				this.widgetForm.configList[index].children.configList = [];
				this.selectWidget = this.widgetForm.configList[index];
				this.$emit("change");
			},
			handleWidgetDelete(index) {
				if (this.widgetForm.configList.length - 1 === index) {
					if (index === 0) this.selectWidget = {};
					else this.handleSelectWidget(index - 1);
				} else this.handleSelectWidget(index + 1);

				this.$nextTick(() => {
					this.widgetForm.configList.splice(index, 1);
					this.$emit("change");
				});
			},
			handleWidgetCloneTable(index) {
				//TODO
				// let cloneData = this.$utils.deepClone(this.widgetForm.configList[index]);
				// debugger;
				// cloneData.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
				// cloneData.children.column.forEach((t) => {
				// 	t.prop = Date.now() + "_" + Math.ceil(Math.random() * 99999);
				// });
				// this.widgetForm.configList.splice(index, 0, cloneData);
				// this.$nextTick(() => {
				// 	this.handleSelectWidget(index + 1);
				// 	this.$emit("change");
				// });
			},
			handleWidgetTableClone(config, index) {
				const cloneConfig = RfieldCore.ins().copyFieldAttr(this.$utils.deepClone(config.children[index]));

				config.children.splice(index + 1, 0, cloneConfig);

				this.$nextTick(() => {
					//复制后的下一个
					this.selectWidget = config.children[index];
					this.$emit("change");
				});
			},
			//添加
			handleWidgetTableAdd(evt, column) {
				let activeIndex = evt.newIndex; //添加的是第几个
				// if (activeIndex == 1 && activeIndex > column.children.length - 1) activeIndex = 0; //是第二个并且

				if (evt.newItem) {
					const item = evt.newItem;
					let config = RfieldCore.ins().createField(item).config;
					//没有数据
					if (activeIndex == -1) {
						column.children.push(config);
						activeIndex = column.children.length - 1;
					} else {
						column.children.splice(activeIndex, 0, config);
						activeIndex = activeIndex;
					}
				}
				this.selectWidget = column.children[activeIndex];

				//this.$emit("change");
			},
			//选中
			handleWidgetTableSelect(data, colIdx) {
				this.selectWidget = data;
				this.$emit("selectTabField", data, colIdx);
				//this.selectWidget.isInTable = true;
			},

			handleWidgetTableDelete(column, index) {
				//优化 更清晰的方式
				if (column.children.length - 1 == index) {
					//最后一个
					if (index == 0) {
						this.selectWidget = column;
					} //是最后一个也是第一个
					else {
						this.selectWidget = column.children[index - 1]; //选中前一个
					}
				} else {
					this.selectWidget = column.children[index + 1];
				}
				this.$nextTick(() => {
					column.children.splice(index, 1);
					this.$emit("change");
				});
			},
			//拖拽不能拖出表格
			onMove(e) {
				console.log(this.tableConfig, e);
				if (e.to.className.indexOf(`widget-form-table-prop-${this.tableConfig.fieldId}`) < 0) {
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
			index: {
				immediate: true,
				handler() {
					clearTimeout(this.timer);
					this.time = setTimeout(() => {
						this.loading = true;
						this.timer = null;
					}, 100);
				},
			},
		},
	};
</script>
<style lang="scss" scoped>
	::v-deep.el-table__body-wrapper {
		.el-form-item__content {
			margin-left: 0 !important;
		}
	}
	::v-deep.widget-form-table-content {
		padding-bottom: 30px !important;
		.cell {
			@include JustityAndFlexWrap(flex, center, null, null);
			padding: 0px !important;

			> div {
				@include ExtraNotDisplayed();
			}
		}

		.table-range {
			height: 100px;
			overflow-x: hidden;
			overflow-y: hidden;
			display: flex;
			align-items: center;
			justify-content: center;

			.el-input--small .el-input__inner {
				height: 36px;
			}
			.el-form-item {
				width: 80%;
			}
		}
		.dept-chose {
			// min-width: 200px;
		}
		.uploadBtn {
			width: 100px;
		}
		.table-title {
			padding-left: 8px;
			padding-right: 8px;
			@include ExtraNotDisplayed();
			// border-bottom: 1px solid #666;
		}
	}
	::v-deep.widget-form-table {
		min-height: 100px;
		.widget-form-table-content {
			.el-table__body {
				height: 100px;
			}
		}
		.el-radio-group {
			@include JustityAndFlexWrap(flex, null, null, wrap);
		}
		.el-checkbox-group {
			@include JustityAndFlexWrap(flex, null, null, wrap);
		}
		.vertical {
			flex-direction: column;
		}
		.table-range {
			height: 110px;
			overflow-x: scroll;
			overflow-y: hidden;
			display: flex;
			align-items: center;
		}
		.el-checkbox {
			margin-right: 5px;
		}
		.el-radio {
			margin-right: 5px;
		}
	}
	.hidden {
		visibility: hidden;
	}
	::v-deep.widget-form-table-item {
		outline: 1px solid #eee;
		margin-right: 3px;
		.rvue-form-group {
			height: 36px !important;
		}
	}
	::-webkit-scrollbar,
	.form-designer .widget-form-container .widget-form-list .widget-form-table div::-webkit-scrollbar {
		height: 14px;
	}
</style>
