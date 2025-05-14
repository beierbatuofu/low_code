<template>
	<div class="flowcenter">
		<FlowTable :title="$t('flow.myhandle')" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import FlowTable from "./_components/flowTable.vue";

	@Component({
		name: "Transactors",
		components: {
			FlowTable,
		},
	})
	export default class extends Vue {
		public mounted() {
			console.log(this.$route);
		}
	}
</script>
