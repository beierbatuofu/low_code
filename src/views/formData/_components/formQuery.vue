<template>
	<div v-if="formQueryData.length" class="form-query">
		<div>
			<rvue-row type="flex" :gutter="6" style="flex-wrap: wrap">
				<rvue-col v-for="(item, index) in formQueryData" :key="item.fieldId" :span="8">
					<div :key="index" :fieldId="item.fieldId" class="form-item" :prop="item.fieldId" :class="isCollapse && index > 2 ? 'el-form-item-hidden' : ''">
						<label class="form-label"
							>{{ item | getLang }}
							<!-- <span style="font-size: 12px; color: #409eff">{{ transMethod[item.linkVal] }}</span> -->
						</label>

						<component
							v-if="['datetime', 'create_time', 'update_time'].indexOf(item.type) > -1"
							:align="(index + 1) % 3 === 0 ? 'right' : (index + 2) % 3 === 0 ? 'center' : 'left'"
							:is="getComponent(item)"
							v-bind="{ fieldId: item.fieldId }"
							:config="item"
							:form="searchForm"
							notSync
							@update="updateField"
							mode="query"
						/>
						<component mode="query" v-else :is="getComponent(item)" v-bind="{ fieldId: item.fieldId }" :config="item" :form="searchForm" notSync @update="updateField" />
					</div>
				</rvue-col>
			</rvue-row>
			<div class="search-form-btns">
				<div class="btns form-item">
					<rvue-button size="mini" type="primary" id="seachForm" @click="bindSearchForm()">{{ $t("global.search") }}</rvue-button>
					<rvue-button size="mini" @click="resetForm()">{{ $t("global.reset") }}</rvue-button>
				</div>
				<span v-if="formQueryData.length > 3" class="form-collapse-button" @click="collapse">
					{{ isCollapse ? $t("global.expand") : $t("global.collapse") }} <i class="el-icon-arrow-down" :style="{ transform: !isCollapse ? 'rotate(180deg)' : 'none' }"></i>
				</span>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop, Model, Inject } from "vue-property-decorator";
	import RfieldCore from "@/components/rfield/core/RfieldCore.ts";
	import { FormModule } from "@/store/modules/form";

	@Component
	export default class FormQuery extends Vue {
		@Inject() readonly formCode!: string;
		@Prop({ type: Array, default: () => [] }) formQueryData!: TJson[];

		private isCollapse: boolean = true;
		private searchForm: any = {};
		private transMethod = {
			undefined: "等于",
			eq: "等于",
			ne: "不等于",
			like: "包含",
			unlike: "不包含",
			contain_either: "多选包含任意一个",
			contain_multiple: "多选同时包含",
			empty: "空",
			not_empty: "不为空",
			between: "在a到b之间",
			prefix_like: "前缀固定包含",
			suffix_like: "结尾固定包含",
		};

		private collapse() {
			this.isCollapse = !this.isCollapse;
		}

		private resetKey = 1;

		private bindSearchForm(form: Record<string, any> = {}) {
			if (Object.keys(form).length) this.searchForm = form;
			FormModule.SET_QUERYFORM(this.searchForm);

			this.$emit("search", JSON.parse(JSON.stringify(this.searchForm)));
		}

		private updateField(a: any, v: any) {
			console.log("update", a, v);
		}

		private resetForm() {
			// 手动处理默认值

			this.formQueryData.forEach((item: any) => {
				this.searchForm[item.fieldId] = item.defVal;
			});
			FormModule.SET_QUERYFORM(this.searchForm);

			this.$emit("reset");
		}

		private getComponent(setting: TJson) {
			let oFiled = (<any>RfieldCore.ins()).fieldConsMap[setting.type].fieldDef.ins();
			if (oFiled?.queryComp) {
				return oFiled.queryComp;
			} else {
				return `Rfield-${setting.type}`;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.form-query {
		margin: 0 5px 5px;
		padding: 10px 10px 0;
		@include GlobalAvatar(null, null, 2px, #fff);
		.search-form-btns {
			position: relative;
			display: flex;
			justify-content: center;
			.form-collapse-button {
				@include PositionAbsoulte(10px, 0, null, null);
				margin-left: 10px;
				padding: 0 10px;
				color: #4c81ff;
				cursor: pointer;
				user-select: none;
				.el-icon-arrow-down {
					transition: transform 0.3s ease;
				}
			}
		}
		::v-deep .el-input__inner {
			height: 40px !important;
			line-height: 40px !important;
		}
		// ::v-deep .el-textarea__inner{
		// 	text-align: center;
		// }
		.form-item {
			line-height: 30px;
			margin-bottom: 22px;
		}
		.el-form-item-hidden {
			display: none;
		}
		.form-label {
			display: block;
			max-width: 95%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
