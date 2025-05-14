type i18n = {
	[key: string]: string;
};
export interface Dimensions {
	readonly code: string;
	readonly dataTypeEnum: string;
	tagCode: string;
	fieldIdAsName: string;
	sort: string;
	title: i18n;
	subCode?: string;
	dateTimeSummary?: string;
	method?: string;
	tableFieldId?: string;
}
export interface Indicators extends Dimensions {
	method: string;
}
