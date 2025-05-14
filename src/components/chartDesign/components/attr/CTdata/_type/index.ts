//??
export interface FieldItem {
	[propName: string]: any;
}
export interface FormMapItem {
	appCode: string;
	childList: null;
	code: string;
	color: null;
	createTime: null | string;
	createUser: null;
	fieldList: null;
	icon: null;
	id: string | string;
	isDeleted: null;
	isLeaf: null;
	multiLanguage: { zh: string; en?: string };
	name: string;
	orderIndex: null;
	parentId: null;
	processList?: null;
	structure: null | Record<string, any>[];
	type: string;
	updateTime: null | string;
	versionState?: string;
}
export interface DatasetItem {
	oldTitle: Title;
	oldType: string;
	type: string;
	title: Title;
	fieldIdAsName: string;
	fieldId: string;
}
export interface DatasetMapItem {
	id: string;
	appCode: null | string;
	datasetCode: any;
	name: {
		zh: string;
		en?: string;
	};
	creater: null;
	updater: null;
	createTime: null | string;
	updateTime: null | string;
	type: string;
	datasetSql: string;
	displaySql: string;
	correspond: null;
	structure: DatasetItem[];
	isDeleted: null;
	status: boolean;
}

export interface IdRecursiveTreeItem {
	childList: FieldItem[];
	id: string;
}

export interface FormMap<T> {
	[key: string]: T;
}
