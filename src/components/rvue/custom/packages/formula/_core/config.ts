/*
 * @Author: ben
 * @LastEditTime: 2021-12-21 16:56:34
 */
export const FormulaList = [
	{
		title: "functions",
		name: "1",
		children: [
			{
				label: "SUM",
				value: "SUM",
				zh: `
                    语法<br />
                    SUM ( 数字，数字, .... )<br />
                    返回值：数值
                `,
			},
			{
				label: "AVERAGE",
				value: "AVERAGE",
				zh: `
                    语法<br />
                    AVERAGE(数字1,数字2,...)<br />
                    返回值：数值
                `,
			},
			{
				label: "CONCATENATE",
				value: "CONCATENATE",
				zh: `
                语法<br />
                CONCATENATE函数可以将多个文本合并成一个文本<br />
                格式:CONCAT(文本1,文本2,…)<br />
                返回值:文本<br />
                示例:CONCAT("今天","明天") 返回:"今天明天"
                `,
			},
			{
				label: "ROUND",
				value: "ROUND",
				zh: `
    
                    语法<br />
                    ROUND函数将数字四舍五入到指定的位数<br />
                    格式:ROUND(数字,位数)<br />
                    返回值:数字<br />
                    示例:ROUND(3.1415, 2) 返回:"3.14"
                `,
			},
			{
				label: "IF",
				value: "IF",
				zh: `
                    语法<br />
                    IF函数可以对值和期待值进行逻辑比较<br />
                    格式:IF(条件,正确返回值,错误返回值)<br />
                    返回值:逻辑值<br />
                    示例:IF(2>1,"TRUE","FALSE") 返回:TRUE
                `,
			},
			{
				label: "TODAY",
				value: "TODAY",
				zh: `
                    语法<br />
                    TODAY函数可以返回当前日期的日期序列<br />
                    格式:TODAY()<br />
                    返回值:文本<br />
                    示例:TODAY() 返回:"2021-01-01"
                `,
			},
			{
				label: "DATE",
				value: "DATE",
				zh: `
                    语法<br />
                    DATE函数可以返回表示特定日期的连续序列号<br />
                    格式:DATE(年,月,日)<br />
                    返回值:日期时间<br />
                    示例:DATE(2021,1,1) 返回: 2021-01-01
                `,
			},
			{
				label: "COUNT",
				value: "COUNT",
				zh: `
                    语法<br />
                    COUNT函数计算包含数字的单元格个数以及参数列表中数字的个数<br />
                    格式:COUNT(值,值,值)<br />
                    返回值:数字<br />
                    示例:COUNT("2021",1,1) 返回: 2
                `,
			},
			{
				label: "MAX",
				value: "MAX",
				zh: `
                语法<br />
                MAX函数可以获取一组数值的最大值<br />
                格式:MAX(值,值,值)<br />
                返回值:数字<br />
                示例:MAX(1,2,3) 返回: 3
            `,
			},
			{
				label: "MIN",
				value: "MIN",
				zh: `
                    语法<br />
                    MIN函数可以获取一组数值的最小值<br />
                    格式:MIN(值,值,值)<br />
                    返回值:数字<br />
                    示例:MIN(1,2,3) 返回: 1
                `,
			},
			{
				label: "INT",
				value: "INT",
				zh: `
                    语法<br />
                    INT函数可以获取一个数的整数部分<br />
                    格式:INT(值)<br />
                    返回值:数字<br />
                    示例:INT(3.14) 返回: 3
                `,
			},
			{
				label: "LEN",
				value: "LEN",
				zh: `
                    语法<br />
                    LEN函数可以获取文本中的字符个数<br />
                    格式:LEN(文本)<br />
                    返回值:数字<br />
                    示例:LEN("八千里路云和月") 返回: 7
                `,
			},
			{
				label: "DAY",
				value: "DAY",
				zh: `
                    语法<br />
                    DAY函数可以返回以日期序列表示的某日期的天数，介于1到31之间的整数<br />
                    格式:DAY(日期序列)<br />
                    返回值:数字<br />
                    示例:DAY("2021-1-31") 返回:31
                `,
			},
			{
				label: "DAYS",
				value: "DAYS",
				zh: `
                    语法<br />
                    DAYS函数可以返回两个日期之间相差的天数.到31之间的整数<br />
                    格式:DAYS(结束日期,开始日期)<br />
                    返回值:数字<br />
                    示例:DAYS("2021-3-15","2021-3-12") 返回:3
                `,
			},
			{
				label: "HOUR",
				value: "HOUR",
				zh: `
                    语法<br />
                    HOUR函数可以返回某时间的小时数值，介于0到23之间的整数<br />
                    格式:HOUR(日期序列)<br />
                    返回值:数字<br />
                    示例:HOUR("2021-3-15 10:09:08") 返回:10
                `,
			},
			{
				label: "MINUTE",
				value: "MINUTE",
				zh: `
                    语法<br />
                    MINUTE函数可以返回某时间的分钟数值，介于0到59之间的整数<br />
                    格式:MINUTE(日期序列)<br />
                    返回值:数字<br />
                    示例:MINUTER("2021-3-15 10:09:08") 返回:9
                `,
			},
			{
				label: "MONTH",
				value: "MONTH",
				zh: `
                    语法<br />
                    MONTH函数可以返回某时间的月份的数值，介于1到12之间的整数<br />
                    格式:MONTH(日期序列)<br />
                    返回值:数字<br />
                    示例:MONTH("2021-3-15 10:09:08") 返回:3
                `,
			},
			{
				label: "SECOND",
				value: "SECOND",
				zh: `
                    语法<br />
                    SECOND函数可以返回某时间的秒的数值，介于0到59之间的整数<br />
                    格式:SECOND(日期序列)<br />
                    返回值:数字<br />
                    示例:SECOND("2021-3-15 10:09:08") 返回:8
                `,
			},
			{
				label: "NOW",
				value: "NOW",
				zh: `
                    语法<br />
                    NOW函数可以返回当前日期和时间<br />
                    格式:NOW(日期序列)<br />
                    返回值:日期时间<br />
                    示例:NOW() 返回: 2021-12-21 10:09:08
                `,
			},
			{
				label: "YEAR",
				value: "YEAR",
				zh: `
                    语法<br />
                    YEAR函数可以返回某时间的年的数值<br />
                    格式:YEAR(日期序列)<br />
                    返回值:数字<br />
                    示例:YEAR("2021-3-15 10:09:08") 返回:2021<br />
                `,
			},
			{
				label: "TRUE",
				value: "TRUE",
				zh: `
                    语法<br />
                    TRUE函数返回布尔值true<br />
                    用法：TRUE()<br />
                    示例：略
                `,
			},
			{
				label: "FALSE",
				value: "FALSE",
				zh: `
                    语法<br />
                    FALSE函数返回布尔值false<br />
                    用法：FALSE()<br />
                    示例：略
                `,
			},
			{
				label: "NOT",
				value: "NOT",
				zh: `
                    语法<br />
                    NOT函数返回与逻辑表达式相反的布尔值。<br />
                    用法：NOT(逻辑表达式)<br />
                    示例：NOT(年龄>20),如果年龄大于20返回false，否则返回true
                `,
			},
			{
				label: "AND",
				value: "AND",
				zh: `
                    语法<br />
                    仅当所有表达式都为真时，AND函数返回布尔值true，否则返回布尔值false<br />
                    用法：AND(逻辑表达式1,逻辑表达式2,...)<br />
                    示例：AND(数学成绩>60,语文成绩>60)，如果两门课成绩都>60，返回true，否则返回false
                `,
			},
			{
				label: "OR",
				value: "OR",
				zh: `
                    语法<br />
                    当任意表达式为真时，OR 函数返回布尔值true；如果所有表达式都为假，返回布尔值false。<br />
                    用法：OR(逻辑表达式1,逻辑表达式2,...)<br />
                    示例：OR(数学成绩>60,语文成绩>60)，如果其中一门课成绩>60，返回true，否则返回false
                `,
			},
			{
				label: "XOR",
				value: "XOR",
				zh: `
                    语法<br />
                    XOR函数可以返回所有表达式的异或值<br />
                    用法：XOR(逻辑表达式1, 逻辑表达式2,...)<br />
                    示例：XOR(语文成绩>60,数学成绩>60)，如果两门成绩都>60或者都<60,返回false；如果其中一门>60，另外一门<60，返回true
                `,
			},
			{
				label: "TIMESTAMP",
				value: "TIMESTAMP",
				zh: `
                语法<br />
                TIMESTAMP函数可以将日期对象转换成时间戳。<br />
                用法：TIMESTAMP(日期)<br />
                示例：略
                `,
			},
		],
	},
];
