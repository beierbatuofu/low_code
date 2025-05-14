import { Component, Vue } from "vue-property-decorator";
import { getCenterList, changeFlowState } from "@/api/flowcenter";
import { getFormSingle, saveData } from "@/api/form";

@Component({
	name: "Launch",
	components: {},
})
export default class extends Vue {
	private list: any[] = [];
	private dialogVisible = false;
	private dialogTitle = "";
	private formData: { [key: string]: any } = {};
	private structure: { [key: string]: any } = {};
	private appCode = "";
	private formCode = "";
	private message = "";

	private async openDialog(d: any) {
		({ appCode: this.appCode, fromCode: this.formCode } = d);
		try {
			let { data } = await getFormSingle(this.appCode, this.formCode);
			({ name: this.dialogTitle, structure: this.structure } = data);
			this.dialogVisible = true;
			this.structure["emptyBtn"] = false;
			this.structure["submitBtn"] = false;
		} catch (err) {}
	}

	private *generator(
		appCode: string,
		formCode: string,
		data: { [key: string]: any },
		message: string = ""
	) {
		let dataId =  yield saveData(appCode, formCode, data);
		yield changeFlowState({ formCode, message, dataId, status: -1 });
	}
	private async bindSubmit() {
		
       (<any>this.$refs.rvueForm).submit().then((form:TJson)=>{
            let message = this.message;
            let appCode = this.appCode;
            let formCode = this.formCode;
            let data = form;
            let postSave = this.generator(appCode, formCode, data, message);


            postSave
			.next()
			.value.then((res: any) => {
				return postSave.next(res.data).value;
			})
			.then((res: any) => {
				this.$message({
					type: "success",
					message: "提交成功",
				});
				this.dialogVisible = false;
			});
       })
       
	}
	private bindSave(type: string) {
		let appCode = this.appCode;
		let formCode = this.formCode;
		let data = this.formData;
		let postSave = this.generator(appCode, formCode, data);

		postSave.next().value.then((res: any) => {
			this.$message({
				type: "success",
				message: "保存成功",
			});
			this.dialogVisible = false;
		});
	}

	protected async created() {
		try {
			let res: TResponse = await getCenterList();
			({ data: this.list } = res);
		} catch (err) {}
	}
}
