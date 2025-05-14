export type Field = {
	desc: string;
	edit: boolean;
	rely: {
		type: string;
		relation: string;
	};
	type: string;
	title: {
		en: string;
		zh: string;
	};
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
};
