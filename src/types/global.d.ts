/*
 * @Author: ben
 * @LastEditTime: 2022-05-31 14:06:12
 */

declare enum EFlowStatus {
	"1" = "start",
	"9" = "end",
	"8" = "over",
}

declare type TFlowStatus = keyof typeof EFlowStatus;
declare namespace TRfieldDef {
	export class TComCof {
		public title: TJson;
		public desc: string;
		public visible: boolean;
		public edit: boolean;
		public required: boolean;
		public type: string;
		public titleShow: boolean;
		public fieldId: string;
		public tab: string;
	}

	export class TRfBaseCof extends TComCof {
		public defVal: any;
		public width: string;
		public rely: {
			type: string;
			relation: any;
		};
	}
}

declare interface TRfDef {
	type: string;
	ins: () => any;
	formDefValComp?: string;
}

declare interface TResponse {
	code: string | number;
	data?: any;
	extra?: any;
	msg: string;
	path?: string;
	timestamp?: number;
}

declare interface TUser {
	userId?: string | number;
	userName?: string;
	avatar?: string;
	stateCode?: string | number;
	mobile?: number;
	jobNumber?: number;
	email?: string;
	orgEmail?: string;
	id?: string;
	stateCode?: string;
	dtUserId?: string;
}

declare interface TJson {
	[key: string]: any;
}

declare interface TFJson<T> {
	[key: string]: T;
}
declare type TFormType = "form" | "query" | "formTable";

declare namespace NFormulaEdit {
	interface TField {
		dictData: string | null;
		formCode: null | string;
		id: string;
		isDeleted: null;
		label: string;
		fieldId: string;
		description?: string;
		type?: string;
		timestamp?: number;
		title?: Record<string, any> | undefined;
		parentTitle?: Record<string, any> | undefined;
	}

	interface TFieldConfig {
		title: string;
		list: TField[];
	}

	interface TCodeMirrorCurosor {
		line: number;
		ch: number;
		sticky?: string;
	}

	interface TMarkTextOpts {
		className?: string;
		inclusiveLeft?: boolean;
		inclusiveRight?: boolean;
		selectLeft?: boolean;
		selectRight?: boolean;
		atomic?: boolean;
		collapsed?: boolean;
		clearOnEnter?: boolean;
		clearWhenEmpty?: boolean;
		replacedWith?: any;
		handleMouseEvents?: boolean;
		readOnly?: boolean;
		addToHistory?: boolean;
		startStyle?: string;
		endStyle?: string;
		css?: string;
		attributes?: any;
		shared?: boolean;
	}

	interface TCodeMirrorChangeObj {
		from: TCodeMirrorCurosor;
		to: TCodeMirrorCurosor;
		text: string;
		removed?: string[];
		key?: string;
	}

	interface TCodeMirror {
		state: any;
		on: (event: string, cb: (instance: any, changeObj: any, event?: any) => void) => void;
		lineCount: () => any;
		getCursor: () => TCodeMirrorCurosor;
		replaceRange: (replacement: string, from: TCodeMirrorCurosor, origin?: string) => void;
		markText: (from: TCodeMirrorCurosor, to: TCodeMirrorCurosor, options?: TMarkTextOpts) => void;
		setCursor: (line: number, ch?: number, options?: object) => void;
		focus: () => void;
		getValue: () => string;
		getAllMarks: () => any;
		setValue: (content: string) => void;
		setOption: (option: string, value: any) => void;
		getLine: (n: number) => string;
		Pos: (line: number, ch?: number, sticky?: string) => void;
		getTokenAt: (pos: TCodeMirrorCurosor) => any;
		showHint: any;
		display: TJson;
	}

	interface TFormulaOpts {
		label: string;
		value: string | number;
		zh: string;
	}

	interface TFormulaList {
		title: string;
		name: string | number;
		children: Array<TFormulaOpts>;
	}
}

declare interface Title {
	[key: string]: string | null;
}
