export type Title = {
	[key: string]: string;
};

export type Field = {
	desc: string;
	edit: boolean;
	rely: {
		type: string;
		relation: string;
	};
	type: string;
	title: Title;
	width: string;
	defVal: unknown;
	fieldId: string;
	visible: boolean;
	required: boolean;
	textRange: {
		max: "undefined";
		min: "undefined";
		enable: boolean;
	};
	titleShow: boolean;
	scanQrCode: {
		editable: boolean;
		allowScan: boolean;
	};
	component?: string;
	children?: Field[];
	parent?: Field;
	dateFormat?: string;
	formDesignConf?: { dateFormat: string | undefined };
};

export type DatasetItem = {
	oldTitle: {
		zh: string;
	};
	oldType: string;
	type: string;
	title: {
		zh: string;
	};
	fieldIdAsName: string;
	fieldId: string;
	edit: boolean;
	defVal: string;
	component?: string;
	parent?: Field;
	formDesignConf?: { dateFormat: string | undefined };
	dateFormat?: string;
};

export type FieldValue = string | number | Record<string, any>;

export type Rules = {
	dataType: number;
	judgeValues: FieldValue[];
	method: string;
	targetFieldCode: string;
	type: string;
	id: string; //filter id
	parentSubFormTargetFieldCode?: string;
	sourceCode: string;
};

export interface FilterListItem {
	formCode: string;
	matchRules: Rules[];
}

export interface ReportListItem {
	reportCode: string;
	title: {
		en: string;
		zh: string;
	};
	sourceName: {
		en: string;
		zh: string;
	};
	configList: Array<Field>;
	sourceCode: string;
	sourceType?: string;
	datasetCode?: string;
	selectField: string;
}
