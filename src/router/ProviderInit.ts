interface ProviderParam {
	to: any;
	from: any;
	next: any;
}

interface Provider {
	/**
	 * 策略判断
	 * @param param
	 */
	support(param: ProviderParam): boolean;
	/**
	 * 执行代码
	 * @param param
	 */
	excute(param: ProviderParam): void;
}

const linkProviders = new Array<Provider>();

function addProviders(provider: Provider) {
	linkProviders.push(provider);
}

function getProviders() {
	return linkProviders;
}

export { Provider, ProviderParam, addProviders, getProviders };
