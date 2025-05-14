<template>
	<div>
		<!-- 动态列 -->
		<template v-for="(column, columnIndex) in configList">
			<template>
				<el-table-column v-if="columnIndex == 0" prop="index_" width="100" :key="columnIndex">
					<template slot="header" slot-scope="scope">
						<el-button v-if="!allReadonly" @click="addRow()" type="primary" size="mini" icon="el-icon-plus" circle></el-button>
					</template>
					<template slot-scope="scope">
						<div class="table-button" :style="{ 'pointer-events': allReadonly ? 'none' : 'auto' }">
							<div class="table-edit-btn">
								<el-button @click="delRow(scope.row['index_'])" class="delete-table-btn" size="mini" icon="el-icon-delete" circle></el-button>
								<el-button @click="expandRow(scope.$index)" size="mini" icon="el-icon-edit-outline" circle></el-button>
							</div>
							<div class="table-edit-btn-text">
								{{ scope.$index + 1 }}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
					v-if="column.visible"
					:key="columnIndex + 1"
					:prop="column.fieldId"
					:render-header="column.renderHeader"
					:align="column.align || configList.align"
					header-align="center"
					:width="column.width"
					min-width="200"
				>
					<template slot="header" slot-scope="scope">
						<div v-if="column.titleShow">
							<span style="color: red" v-if="column.required && !allReadonly">*</span>
							{{ column | getLang }}
						</div>
					</template>
					<template slot-scope="{ row, $index }">
						<!-- 第一列操作按钮 -->

						<!-- <slot :row="row" :index="$index" :name="column.fieldId"> </slot> -->

						<template>
							<el-form-item
								:error="row['isSameError_' + column.fieldId] ? $t('global.errNoSameVal') : ''"
								v-if="column.fieldId !== 'index_'"
								class="widget-form-item"
								:prop="setTableProp(column.fieldId, $index)"
								:rules="getRules(column, row[column.fieldId])"
							>
								<div :style="{ 'pointer-events': allReadonly ? 'none' : 'auto' }">
									<!-- <form-temp
										ref="temp"
										v-if="column.type && column.visible"
										:config="column"
										:form="form"
										:fieldId="column.fieldId"
										:tableConfig="{
											tableProp,
											columnIndex: row.index_,
										}"
										@validB="(value, fieldId) => handleValide(fieldId, value, $index)"
										:allReadonly="allReadonly"
										:mode="mode"
									>
									</form-temp> -->
									{{ $index }}
									<component
										:is="`rfield-${column.type}`"
										:config="column"
										ref="temp"
										:form="form"
										:fieldId="column.fieldId"
										:mode="mode"
										:columnIndex="$index"
										:tableProp="tableProp"
										@validB="(value, fieldId) => handleValide(fieldId, value, $index)"
										:allReadonly="allReadonly"
									>
									</component>
								</div>
							</el-form-item>
						</template>
					</template>
				</el-table-column>
			</template>
		</template>
	</div>
</template>

<script lang="ts">
	import formTemp from "../../components/formTemp";
	import RuleConfig from "../../../rvue/custom/packages/form/RuleConfig";
	import { Vue, Component, Prop, Watch } from "vue-property-decorator";

	@Component({
		components: {
			formTemp,
		},
	})
	export default class Column extends Vue {
		@Prop({ type: Array, default: () => [] }) configList!: any;
		@Prop({ type: Array, default: () => [] }) tableList!: any;
		@Prop({ type: Object, default: () => ({}) }) form!: any;
		@Prop({ type: String, default: "" }) tableProp!: string;
		@Prop({ type: String, default: "" }) mode!: string;
		@Prop({ type: Boolean, default: false }) allReadonly!: boolean; //是否可编辑

		private setTableProp(fieldId: string, index: string | number) {
			return this.tableProp + ".data" + "." + index + "." + fieldId;
		}

		private handleValide(fieldId: string, value: any, columnIndex: number = 0) {
			this.$emit("validB", fieldId, value, columnIndex);
		}

		// private getRules(column: TJson, cellVal: TJson) {
		// 	//实时当前值 添加规则
		// 	column.noSameVal && column.rule.push(new RuleConfig().fieldInTableNosame(this.tableList, column.fieldId, cellVal));
		// 	return column.rule;
		// }

		private delRow(index: number) {
			this.$emit("delRow", index);
		}
		private expandRow(index: number) {
			this.$emit("expandRow", index);
		}

		private addRow() {
			this.$emit("addRow");
		}
	}
</script>
