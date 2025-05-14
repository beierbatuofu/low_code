import { RCall } from "@/utils/RCall";
import { Utils } from "./utils";
import Base from "./base";
import QRCode from "qrcode2";
import JSZip from "jszip";
import saveAs from "file-saver";

interface TAttrs {
	visible: boolean;
	edit: boolean;
	width: string;
	titleShow: boolean;
	desc: string;
	defVal: string;
}

export default class QueryDesign extends Base {
	public static instance: QueryDesign | null = null;
	private [Utils.comp]: Record<string, any> | null = null;
	public configList: Record<string, any>[] = [];
	public form: Record<string, any> = {};
	public axios = RCall.newIns().request;
	private QRCode: any;

	public static ins() {
		if (!QueryDesign.instance) {
			QueryDesign.instance = new QueryDesign();
		}
		return QueryDesign.instance;
	}

	public int(opts: Record<"comp", any>) {
		this[Utils.comp] = opts.comp;

		return this;
	}

	// public searchForm() {
	// 	let formQuery = this[Utils.comp]?.option.query;
	// 	this[Utils.comp]?.option.query.bindSearchForm(formQuery.searchForm);
	// }

	public setQueryDefVal(fieldId: string, value: any) {
		let formQuery = this[Utils.comp]?.option.query;
		formQuery.searchForm[fieldId] = value;
		this[Utils.comp]?.$parent.formQueryData.forEach((item: Record<string, any>) => {
			if (item.fieldId == fieldId) {
				item.defVal = value;
			}
		});
	}

	public getCheckboxs(url: any, key: any) {
		//formcode:any
		var getSelectInfo = this[Utils.comp]?.option?.selects || [];
		var zip = new JSZip();
		for (var i = 0; i < getSelectInfo.length; i++) {
			var div = document.createElement("div");
			var code = new QRCode(div, {
				text: url + "/" + i,
				width: 500,
				height: 500,
				colorDark: "#000000",
				colorLight: "#ffffff",
			});

			var value; //获取指定健名需要的值
			for (let j in getSelectInfo[i]) {
				if (key == j) {
					value = getSelectInfo[i][j];
				}
			}

			let { tenantId, appCode, formCode } = this[Utils.comp]?.$route.params;
			code.makeCode(`https://codezerotestext.risen.com/#/${tenantId}/anonymousUser/${appCode}/form/${formCode}/${value}/${url}`);
			let canvas = code._el.querySelector("canvas");
			var dataURL = canvas.toDataURL("image/png");
			var imgData = dataURL.split("base64,")[1];
			zip.file("设备ID：" + value + ".png", imgData, { base64: true });
		}
		zip.generateAsync({ type: "blob" }).then(function (content) {
			saveAs(content, "二维码信息.zip");
		});
	}
}
