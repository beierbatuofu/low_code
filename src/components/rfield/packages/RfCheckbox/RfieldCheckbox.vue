<template>
	<div class="rvue-form-group" :class="{ readonly: readonly }">
		<rvue-select
			:clearable="true"
			:readonly="readonly"
			:style="{ width: config.width - 20 + 'px' }"
			multiple
			v-model="select"
			@change="handleChanges"
			v-if="(tableProp && !isTableDetail) || selectMode"
			class="table-checkbox"
		>
			<template slot="prefix">
				<svg
					t="1630289227822"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="3231"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="128"
					height="128"
				>
					<path
						d="M731.682351 60.189847l-444.288852 0c-122.68725 0-222.144426 99.451036-222.144426 222.144426l0 444.288852c0 122.67497 99.457176 222.156706 222.144426 222.156706l444.288852 0c122.68111 0 222.144426-99.482759 222.144426-222.156706l0-444.288852C953.826777 159.640883 854.363462 60.189847 731.682351 60.189847zM532.137643 618.685811l0.002047 0.002047-77.109192 76.252685-77.109192-76.252685 0.001023-0.001023L255.639285 497.757624l77.116355-76.258825 122.275881 120.92921L686.358073 313.656653l77.109192 76.258825L532.137643 618.685811z"
						p-id="3232"
						fill="#6087FD"
					></path>
				</svg>
			</template>
			<rvue-option v-for="item in config.dicData" :label="item.label" :key="item.value" :value="item.label">
				<span class="circle" :class="select == item.label ? 'circle-active' : ''"> </span>
				<span style="float: left">{{ item.label }} </span>
			</rvue-option>
		</rvue-select>

		<rvue-checks v-else :readonly="readonly" :disabled="disabled" :options="config.dicData" :checkLayout="config.checkLayout" @change="handleChanges" v-model="select" :size="'mini'"></rvue-checks>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Watch, Prop } from "vue-property-decorator";
	import WidgetField from "../../core/WidgetField";
	import "./_core/RfCheckbox.ts";

	@Component
	export default class RvueFieldCheckbox extends WidgetField {
		@Prop({ type: Boolean, default: false }) selectMode!: boolean;
		private isIndeterminate: boolean = true;
		private selectAll: boolean = false;
		private get select() {
			let value = this.value || [];
			if (typeof value == "string") {
				value = JSON.parse(value);
			}
			return value;
		}

		private set select(n: any) {
			(<any>this).value = n;
		}

		private handleChanges(val: any) {
			this.select = val;
			this.handleUpdate(val);
		}

		private handleCheckAllChange(val: any) {
			this.select = val ? this.config.dicData : [];
			this.isIndeterminate = false;
		}
	}
</script>
<style lang="scss" scoped>
	.form-designer .table-checkbox {
		width: 100% !important;
	}
	::v-deep .table-checkbox {
		.el-dropdown {
			width: 100%;
			.el-dropdown-link {
				display: flex;
				width: 100%;
			}
		}
		.el-select__tags {
			white-space: nowrap;
			overflow: hidden;
			display: inline-block;
			vertical-align: top;
		}
	}
	::v-deep.table-checkbox-menu .el-checkbox-group {
		display: flex;
		flex-direction: column;
	}
	::v-deep.el-checkbox__inner {
		background-color: #6087fd !important;
		border-color: #6087fd !important;
	}
	.icon {
		width: 16px;
		height: 16px;
		margin-top: 12px;
		margin-left: 3px;
		margin-right: 5px;
		float: left;
	}
</style>
