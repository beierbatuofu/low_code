import ErrorCode from "./ErrorCode";
import { Message } from "element-ui";
class CustomError extends Error {
	constructor(error: Error) {
		super(error.stack);
	}
	//处理错误
	print() {
		ErrorCode.debounce(
			() => console.log(String(this.stack))
			// Message({
			// 	type: "warning",
			// 	message: ,
			// })
		);
	}
}

export class AppError extends CustomError {
	constructor(error: Error) {
		super(error);
		super.print();
	}
	private static instance: AppError | null = null;
	public static ins(error: Error) {
		if (!AppError.instance) {
			AppError.instance = new AppError(error);
		}
		return AppError.instance;
	}
}
