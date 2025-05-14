/*
 * @Author: ben
 * @LastEditTime: 2022-06-09 16:38:45
 */
import { VuexModule, Module, Action, Mutation, getModule } from "vuex-module-decorators";
import store from "@/store";
import { getAllApp, getCurrApp, queryRecursiveTree } from "@/api/form";
import { getDataset } from "@/api/dataset";

export interface FormState {
	appList: Array<object>;
	app: BaseApp;
	formList: Array<object>;
	form: BaseForm;
	apps: TJson[];
	curApp: TJson;
	curTabId: string;
	queryForm: Record<string, any>;
	formsTree: Record<string, any>;
}

interface BaseApp {
	id?: string;
	name?: string;
	code?: string;
	isApp?: boolean;
	parentId?: string;
	children?: Array<object>;
	effectNow?: number;
}

interface BaseForm {
	appCode?: string;
	formCode?: string;
	name?: string; // 表单名称
	options?: Record<string, any>; // 表单structure
	tableListData?: Array<object>;
	type?: string; // 表单类型
	curFormType?: string;
}

@Module({ dynamic: true, store, name: "form" })
class Form extends VuexModule implements FormState {
	public appList = [];
	public app: BaseApp = {};
	public formList = [];
	public form: BaseForm = {};
	public apps: TJson[] = [];
	public curApp: TJson = {};
	public curTabId = "";
	public queryForm: Record<string, any> = {};
	public formsTree: Record<string, any> = {};

	@Mutation
	public SET_QUERYFORM(rules: any[]) {
		this.queryForm = JSON.parse(JSON.stringify(rules));
	}

	@Mutation
	public GET_CURAPP(appInfo: Record<string, any>) {
		this.curApp = appInfo;
	}

	@Mutation
	private SET_APPLIST(value: any) {
		this.appList = value;
	}
	@Mutation
	private SET_APP(value: any) {
		this.app = Object.assign({}, this.app, value);
	}
	@Mutation
	private SET_FORMLIST(value: any) {
		this.formList = value;
	}
	@Mutation
	private SET_FORM(value: any) {
		this.form = Object.assign({}, this.form, value);
	}

	@Mutation
	private SET_ALLAPPS(value: TJson[]) {
		this.apps = value;
	}

	@Mutation
	private SET_FORMSTREE(data: Record<string, any>) {
		this.formsTree = data;
	}

	@Action
	public queryFormsTree(appCode: string) {
		if (!appCode) return Promise.resolve(null);
		return new Promise((resolve, reject) => {
			queryRecursiveTree(appCode).then((resp: TResponse) => {
				let { idRecursiveTree, formMap } = resp.data;
				let ret: Record<string, any>[] = [];
				this.SET_FORMSTREE(resp.data);
				if (!idRecursiveTree) {
					resolve(ret);
					return;
				}

				function createForm(id: string) {
					return {
						id: id,
						label: formMap[id].name,
						...formMap[id],
					};
				}

				for (let i = 0; i < idRecursiveTree.length; i++) {
					const id = idRecursiveTree[i].id;

					if (formMap[id] && !formMap[id].parentId) {
						if (formMap[id] && formMap[id].type === "S") {
							ret.push(
								(function (item: Record<string, any>) {
									return {
										id: item.id,
										type: "S",
										name: formMap[item.id].name || "文件夹",
										label: formMap[item.id].name || "文件夹",
										code: formMap[item.id].code,
										children: item.childList.filter((v: any) => formMap[v.id]).map((v: any) => createForm(v.id)),
									};
								})(idRecursiveTree[i])
							);
						} else if (formMap[id] && formMap[id].type) {
							ret.push(createForm(id));
						}
					}
				}

				resolve(ret);
			});
		});
	}

	@Action
	public async queryDataset(appCode: string) {
		try {
			let resp = await getDataset(appCode);
			return resp.data || [];
		} catch (err) {
			return [];
		}
	}

	@Action
	public getAppInfo(appCode: string): Promise<Record<string, any>> {
		return new Promise((resolve, reject) => {
			getCurrApp(appCode).then((res: Record<string, any>) => {
				this.GET_CURAPP(res.data);
				resolve(res.data);
			});
		});
	}

	@Mutation
	public SET_CURTABID(tid: string) {
		this.curTabId = tid;
	}

	@Action
	public async getAllApps() {
		let res = await getAllApp();
		this.SET_ALLAPPS(res.data.permApps);
	}

	@Action
	public async setAppList(appList: any) {
		this.SET_APPLIST(appList);
	}
	@Action
	public setApp(app: BaseApp) {
		this.SET_APP(app);
	}
	@Action
	public setFormList(list: any) {
		this.SET_FORMLIST(list);
	}
	@Action
	public setForm(form: BaseForm) {
		this.SET_FORM(form);
	}

	get curAppCode() {
		return this.app.code;
	}
	get curAppName() {
		return this.app.name;
	}
	get curFormCode() {
		return this.form.formCode;
	}
	get curFormName() {
		return this.form.name;
	}
	get curFormType() {
		return this.form.type;
	}
}

export const FormModule = getModule(Form);
