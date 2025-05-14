import { RelationDefine } from "./relationDef";
import FieldWatch from "./fieldWatch";

class RelationCore {
	public static def = RelationDefine;
	public static instance: RelationCore | null = null;
	private relationList: TFieldWatch[] = [];
	private configList: any = [];
	private watchers: Record<string, TFieldWatch> = {};
	// init 执行所有watcher , event 没有关联字段不执行
	public event = "init";

	public get tableRowIdx() {
		return RelationDefine.evtData.rowIdx;
	}

	public getTab() {
		return RelationDefine.evtData;
	}

	public static ins() {
		if (!(RelationCore.instance instanceof RelationCore)) {
			RelationCore.instance = new RelationCore();
		}
		return RelationCore.instance;
	}

	public flatConfigList(list: Record<string, any>[]) {
		let result: Record<string, any>[] = [];
		list.forEach((field: Record<string, any>) => {
			if (field.type == "tab") {
				let { children, ...attrs } = field;
				let child: Record<string, any>[] = [];
				children.forEach((item: Record<string, any>) => {
					let { id, title, configList } = item;
					child.push({ id, title });
					result.push(...configList);
				});

				result.push({
					...attrs,
					children: child,
				});
			} else if (field.type == "table") {
				let { children, ...attrs } = field;
				children.forEach((item: Record<string, any>) => {
					item.pid = attrs.fieldId;
					item.parent = attrs;
					result.push(item);
				});
				result.push(field);
			} else {
				result.push(field);
			}
		});

		return result;
	}

	private setEvent(ev: "init" | "event" = "init") {
		this.event = ev;
	}

	public init(comp: any, isStart: boolean = true) {
		RelationDefine.initUid();
		RelationDefine.comp = comp;
		RelationDefine.oldForm = RelationDefine.comp?.$utils.clone(RelationDefine.comp?.form);
		this.watchers = this.filterNotDeps((this.configList = this.flatConfigList(RelationDefine.comp?.configList || [])));

		if (Object.keys(this.watchers).length == 0 || !isStart) return;
		console.log(this.watchers);

		this.setEvent();
		Object.values(this.watchers).forEach((w: TFieldWatch) => w.execute());
	}

	private filterNotDeps(configlist: Record<string, any>[], pid: string | undefined = undefined): Record<string, TFieldWatch> {
		let watchers = configlist.reduce(this.createFieldWatch.bind(this), []);

		return watchers.reduce((o: Record<string, TFieldWatch>, w: TFieldWatch) => {
			if (w.deps.length) {
				o[w.fieldId] = w;
			}
			return o;
		}, {});
	}

	private createFieldWatch(watchers: any[], widgetConfig: Record<string, any>) {
		if (["formula", "relation"].includes(widgetConfig?.rely?.type || "")) {
			let fieldWatcher = watchers.find((w: TFieldWatch) => w.fieldId == widgetConfig.fieldId);

			if (!fieldWatcher) {
				fieldWatcher = new FieldWatch(widgetConfig, this);
				watchers.push(fieldWatcher);
			}

			this.getRelationFieldsId(widgetConfig.rely, fieldWatcher, watchers);
		}
		return watchers;
	}

	private createNewWatch(watchers: TFieldWatch[], fid: string): TFieldWatch | undefined {
		let createWatcher: TFieldWatch | undefined;
		if ((createWatcher = watchers.find((o: TFieldWatch) => o.fieldId == fid))) return createWatcher;
		let conf = this.configList.find((w: any) => w.fieldId == fid);
		if (!conf) return undefined;
		createWatcher = new FieldWatch(conf, this);
		watchers.push(createWatcher);
		return createWatcher;
	}

	private getRelationFieldsId(relyData: Record<string, any>, fieldWatcher: TFieldWatch, watchers: TFieldWatch[]) {
		let { relation: data, type: relationType } = relyData;
		const addWathcer = (fid: string) => {
			let createWatcher: TFieldWatch | undefined = this.createNewWatch(watchers, fid);
			if (createWatcher) {
				createWatcher.addDeps(fieldWatcher);
				fieldWatcher.addFilter(createWatcher);
			}
		};

		if (relationType == "formula") {
			let result: any;
			let isPush = false;
			while ((result = RelationDefine.reg.exec(JSON.stringify(data))) != null) {
				addWathcer(result[1]);
				isPush = true;
			}

			if (!isPush && !data) {
				fieldWatcher.lazy = fieldWatcher.isEvent = false;
				fieldWatcher.addDeps(fieldWatcher);
				fieldWatcher.addFilter(fieldWatcher);
			}
		}

		if (relationType == "relation" && data.matchRules) {
			data.matchRules.forEach((arr: any[]) => {
				arr.forEach((rule) => {
					if (rule.dataType == 1) {
						addWathcer(rule.judgeValues[0]);
					}
				});
			});

			if (data.subFieldMap) {
				for (let fid in data.subFieldMap) {
					if (data.subFieldMap[fid]) {
						let subWatcher: TFieldWatch | undefined = this.createNewWatch(watchers, fid);
						subWatcher && fieldWatcher.addDeps(subWatcher);
					}
				}
			}
		}
	}

	public onEvent(fieldId: string) {
		if (this.watchers.hasOwnProperty(fieldId)) {
			this.setEvent("event");
			this.watchers[fieldId].reset().execute();
		}
	}
}

export default RelationCore;
