<script lang="tsx">
	import { Component, Watch, Vue, Prop } from "vue-property-decorator";
	import { CreateElement } from "vue";
	import { VNode } from "vue";
	import FormsList from "./formsList.vue";
	import SqlEdit from "./sqlEdit.vue";
	import { refreshJump } from "@/utils/global";

	@Component({
		components: {
			"forms-list": FormsList,
			"sql-eidt": SqlEdit,
		},
	})
	export default class Sql extends Vue {
		private selectField: Object = {};
		private timestamp: number = 0;
		private childlist: TJson[] = [];
		private subFormCodes: TJson = {};

		private newDisplaySql: string = "";
		private oldDisplaySql: string = "";
		private get datasetCode() {
			return this.$route.params.datasetId;
		}

		private handleChangeField(field: TJson) {
			this.selectField = field;
			this.timestamp = new Date().getTime();
		}

		private handleChangeChildlist(childlist: TJson[], subFormCodes: TJson[]) {
			this.childlist = childlist;
			this.subFormCodes = Object.assign(this.subFormCodes, subFormCodes);
		}

		protected render(h: CreateElement) {
			return (
				<div class="sql-wrap">
					<forms-list class="left" on-changeChildlist={this.handleChangeChildlist} on-changeField={this.handleChangeField}></forms-list>
					<sql-eidt
						class="edit"
						on-old={(val: any) => {
							this.oldDisplaySql = val;
						}}
						on-close={() => {
							this.$emit("close");
						}}
						ref="sqlEdit"
						props={{
							childlist: this.childlist,
							subFormCodes: this.subFormCodes,
							selectField: this.selectField,
							timestamp: this.timestamp,
							datasetCode: this.datasetCode,
						}}
					></sql-eidt>
				</div>
			);
		}

		private beforeRouteLeave(to: any, from: any, next: any) {
			let oDisSql = this.oldDisplaySql;
			let nDisSql = (this.$refs as any).sqlEdit.codeMirror.getValue();

			if (nDisSql !== oDisSql) {
				let fullPath = this.$route.path;
				let supPath = fullPath.substr(0, fullPath.lastIndexOf("appd"));
				let jumpPath = supPath + "appd/" + this.$route.params.appCode + "/p/conf/dataset";

				refreshJump(fullPath, this, jumpPath);
				next();
			} else {
				next();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.sql-wrap {
		position: relative;
		height: calc(100vh - 45px);
		overflow: hidden;
		display: flex;
		.left {
			width: 300px;
			resize: horizontal;
		}
		.edit {
			z-index: 1;
			overflow: auto;
			flex: 1;
		}
	}
</style>
