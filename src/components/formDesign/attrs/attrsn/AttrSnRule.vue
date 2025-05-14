<template>
	<div class="widget-config-group el-form-item">
		<rvue-label :label="t('global.snRule')" :tip="t('widgetConfig.snRuleTip')"></rvue-label>
		<draggable v-model="data.rules" handle=".mover" animation="300">
			<transition-group>
				<template v-for="(item, index) in data.rules" v-bind="{ value: item.type }">
					<div :key="index" class="group" v-if="hasText(item)">
						<div style="width: 100%; display: flex; align-items: center; padding-right: 20px">
							<div slot="item" class="mover el-icon-s-operation" style="margin-right: 5px"></div>
							<div class="label">{{ $t(`snrule.${item.type}`) }}</div>
							<component :is="`sn-${item.type}`" :textList="textList" :configList="configList" :conf="item" style="flex: 1"></component>
						</div>
						<div>
							<rvue-checkbox class="checkbox" v-model="item.check" v-if="item.type != 'count'"></rvue-checkbox>
						</div>
					</div>
				</template>
			</transition-group>
		</draggable>
	</div>
</template>
<script>
	import { create } from "../../utils/create";
	import draggable from "vuedraggable";
	import ruleComps from "./_components";

	const name = "AttrSnRule";

	export default create({
		data() {
			return { textList: ["input", "select", "number", "radio"] };
		},
		name,
		components: {
			draggable,
			...ruleComps,
		},
		methods: {
			hasText(item) {
				if (item.type == "field") {
					let idx = this.configList.findIndex((item) => this.textList.includes(item.type));

					return idx >= 0;
				}

				return true;
			},
		},
		computed: {
			rules: {
				get() {
					return this.data.rules || [];
				},
				set(v) {
					this.data.rules = v;
				},
			},
		},
	});
</script>
<style lang="scss" scoped>
	.group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px 0px;

		.mover {
			cursor: move;
		}
		.label {
			font-size: 12px;
			padding-right: 5px;
			color: $color;
		}
	}
</style>
