<template>
	<div>
		<rvue-input v-model="searchField" placeholder="搜索变量"></rvue-input>
		<ul v-for="item in formList" :key="item.fieldId">
			<li class="flex space-between">
				<span>
					{{ item.title[lang] }}
				</span>
				<span>
					{{ item.fieldId }}
				</span>
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
	import { Vue, Component, Prop, Watch, Model } from "vue-property-decorator";
	import BaseAttr from "../../../core/BaseAttr";

	@Component({
		components: {},
	})
	export default class AssistLeft extends BaseAttr {
		@Model("change", { type: Object }) readonly fieldJson!: TJson;
		@Prop({ default: () => [], type: Array }) formList!: TJson;

		private searchField: string = "";
	}
</script>
<style lang="scss" scoped>
	.flex {
		display: flex;
	}
	.space-between {
		justify-content: space-between;
	}
</style>
