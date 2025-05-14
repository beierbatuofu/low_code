/*
 * @Author: ben
 * @LastEditTime: 2021-06-30 11:22:52
 */
export const env = () => {
	switch (process.env.NODE_ENV) {
		case "development":
			return "http://47.100.71.23:9081";
		default:
			return "https://" + document.location.host;
	}
};
