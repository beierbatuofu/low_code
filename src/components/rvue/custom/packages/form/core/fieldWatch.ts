import Formula from "./Formula";
import Relation from "./Relation";

export default class FieldWatch implements TFieldWatch {
	public fieldId = "";
	private config = {};
	public deps: TFieldWatch[] = [];
	public parent: Record<string, any> = Object.create({});
	public count = 1;
	public isEvent: boolean = true;
	public rely: TRely = Object.create({});
	public form: Record<string, any> = {};
	public filter: Record<string, TFieldWatch> = Object.create({});
	public type: string = "";
	public tableId: string = "";
	public oldForm: Record<string, any> = {};
	public lazy: boolean = true;

	public get tableChildren() {
		let tableConf: Record<string, any> | undefined = this.parent.configList.find((c: Record<string, any>) => c.fieldId == this.fieldId);
		if (!tableConf) return [];
		return tableConf.children;
	}

	private get formData() {
		try {
			let form = this.form;
			let rowIdx = this.parent.tableRowIdx;

			rowIdx < 0 && (rowIdx = 0);
			if (this.tableId) form = form[this.tableId].data[rowIdx];
			return form;
		} catch (err) {
			return this.form;
		}
	}

	public get value() {
		return this.formData[this.fieldId];
	}

	public set value(v: any) {
		this.formData[this.fieldId] = v;
	}

	public addFilter(watcher: TFieldWatch) {
		if (!this.filter.hasOwnProperty(watcher.fieldId)) {
			this.filter[watcher.fieldId] = watcher;
		}
	}

	public constructor(config: Record<string, any>, parent: any) {
		this.setReadonly("fieldId", config.fieldId);
		this.setReadonly("config", config);
		this.setReadonly("rely", config.rely);
		this.type = config.type;
		this.parent = parent;
		this.tableId = config.pid;
		this.form = parent.constructor?.def.comp.form || {};
		this.oldForm = JSON.parse(JSON.stringify(this.form));
	}

	private setReadonly(key: string, value: any) {
		Object.defineProperty(this, key, {
			writable: false,
			value: value,
		});
	}

	public addDeps(deps: TFieldWatch) {
		if (this.deps.findIndex((d: any) => d.fieldId == deps.fieldId) < 0) {
			this.deps.push(deps);
		}
	}

	public reset() {
		this.count = 1;
		this.deps.forEach(function (w: TFieldWatch) {
			if (w.count != 1) {
				w.reset();
			}
		});

		return this;
	}

	public async execute() {
		if (!this.lazy) return this.update();
		this.deps.map(async (w: TFieldWatch) => await w.update());
	}

	public async update() {
		if (this.count > 2 || (this.parent.event == "event" && !this.isEvent)) return;

		this.count++;

		if (this.rely.type == "formula") {
			await this.executeFormula();
		}
		if (this.rely.type == "relation") {
			await this.executeRelation();
		}
		await this.execute();
	}

	private async executeFormula() {
		await Formula.ins().execute(this);
	}

	private async executeRelation() {
		await Relation.ins().execute(this);
	}
}
