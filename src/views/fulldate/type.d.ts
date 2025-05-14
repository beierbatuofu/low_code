declare interface THeaderToolbar<T> {
	[key: "left" | "right" | "center"]: T;
}

declare interface TFullDateOpts {
	headerToolbar: THeaderToolba<string>;
}

declare interface TFullDateStatus {
	codes: string[];
	styles: Record<string, any>;
}

declare type TSourceType = "form" | "dataset" | "";

declare interface TFullDateData {
	options: TFullDateOpts;
	sourceType: TSourceType;
	sourceCode: string;
	status: TFullDateStatus;
	dimensions: string[];
	indicators: string[];
	matchRules: any[];
}

declare interface TFullDataEvent {
	allDay: boolean;
	title: string;
	start: string;
	type: TSourceType;
	end: string;
	route: string;
	classNames: string[];
}
