export default class Echart {
	public static ins(): Echart {
		Echart.instance = new Echart();
		return Echart.instance;
	}
	public static instance: Echart | null = null;
	private vm: Record<string, any> = new Object(null);
	public init(vm: Record<string, any> & Vue) {
		this.vm = vm;
		return this;
	}
	public create(_id: string) {
		let id = (<any>this.vm).data.config.uid;
		return document.getElementById(`main-${id}`);
	}
}
