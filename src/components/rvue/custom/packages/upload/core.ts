interface TXhr {
	objectName: string;
	xhr: XMLHttpRequest;
}

export default class Xhrs<T extends TXhr> {
	public static instance: Xhrs<TXhr> | null = null;

	public static ins() {
		if (!Xhrs.instance) {
			Xhrs.instance = new Xhrs();
		}
		return Xhrs.instance;
	}

	public constructor(private list: T[] = []) {}

	public add(el: T) {
		this.list.push(el);
	}

	public del(objName: string) {
		this.list = this.list.filter((item: T) => item.objectName != objName);
		console.log(this.list, "this.listthis.list");
	}

	public getList() {
		return this.list;
	}

	public clear() {
		this.list = [];
	}

	public abort() {
		this.list.forEach((item: T) => {
			item.xhr.abort();
		});
		this.clear();
	}
}
