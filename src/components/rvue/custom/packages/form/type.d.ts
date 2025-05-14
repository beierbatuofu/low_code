declare interface TEvtData {
	parentFieldId: string;
	rowIdx: number;
}

declare interface TFieldValType {
	input: string;
	datetime: string;
	textarea: string;
	number: number;
	dept: string;
	user: string;
	userRadio: string;
	deptRadio: string;
	select: string;
	checkbox: string;
	address: string | Record<string, string>;
}

declare type TRelationItem = any;
declare interface TConvertValue {
	val: any;
	targetType: keyof RelationDefine.ConvertValue;
}

declare type TComp = (Vue & { mode: string; form: Record<string, any>; configList: Record<string, any>[]; oldStructure: Record<string, any>[] }) | null;

declare interface TRely {
	type: "formula" | "relation";
	relation: string;
}

declare class TFieldWatch {
	public type: string;
	public fieldId: string;
	public deps: TFieldWatch[];
	public count: number;
	public rely: TRely;
	public form: Record<string, any>;
	public addDeps: (opts: TFieldWatch) => void;
	public reset: () => TFieldWatch;
	public execute: (opts?: any) => any;
	public update: () => Promise<any>;
	public value: any;
	public addFilter: (TFieldWatch) => void;
	public filter: Record<string, TFieldWatch>;
	public isEvent: boolean;
	public tableId: string;
	public parent: Record<string, any>;
	public oldForm: Record<string, any>;
	public tableChildren: Record<string, any>[];
	public lazy: boolean;
}

declare interface TRelationCore {
	[key: string]: any;
}
