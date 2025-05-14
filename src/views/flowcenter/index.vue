<template>
	<div class="flowcenter">
		<m-header>
			<template v-slot:bread>
				<i class="el-icon-arrow-right" style="margin: 0 10px"></i>
				<span>{{ $t("flow.processCenter") }}</span>
			</template>
			<template v-slot:center>
				<rvue-tabs :value="tabValue" @tab-click="handleClick">
					<rvue-tab-pane :label="$t('flow.mytodolist')" name="todo"> </rvue-tab-pane>
					<rvue-tab-pane :label="$t('flow.mylaunch')" name="create"> </rvue-tab-pane>
					<rvue-tab-pane :label="$t('flow.myhandle')" name="transactors"> </rvue-tab-pane>
					<rvue-tab-pane :label="$t('flow.carbonCopy')" name="ccUsers"> </rvue-tab-pane>
				</rvue-tabs>
			</template>
		</m-header>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
	import { Component, Vue, Watch } from "vue-property-decorator";
	import MHeader from "@/components/m-header/m-header.vue";

	@Component({
		name: "FlowCenter",
		components: {
			MHeader,
		},
	})
	export default class extends Vue {
		private get tabValue() {
			const type = this.$route.path.split("/").pop();
			return type;
		}

		private handleClick({ name }: TJson) {
			const { tenantId, appCode } = this.$route.params;
			this.$router.push({ path: `/${tenantId}/flow/${name}` });
		}
	}
</script>
