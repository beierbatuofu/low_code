import FormDesign from "./_core/formDesign";
import QueryDesign from "./_core/queryDesign";

export interface TJsmap {
	form: FormDesign;
	query: QueryDesign;
}

const jsmap: TJsmap = {
	form: FormDesign.ins(),
	query: QueryDesign.ins(),
};

export default jsmap;
