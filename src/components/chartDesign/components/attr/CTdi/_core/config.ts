/*
 * @Author: ben
 * @LastEditTime: 2021-05-27 13:39:13
 */
export const FormulaList = [
	{
		title: "functions",
		name: "1",
		children: [
			{
				label: "SUM",
				value: "SUM",
				rule: `

                    语法<br />
                    SUM ( 数字，数字, .... )<br />
                    返回值：数值
                `,
			},
			{
				label: "AVERAGE",
				value: "AVERAGE",
				rule: `
   
                语法<br />
                AVERAGE(数字1,数字2,...)<br />
                返回值：数值
                `,
			},
			{
				label: "CONCATENATE",
				value: "CONCATENATE",
				rule: `
        
                语法<br />
                CONCAT(文本1, 文本2,…)<br />
                返回值：字符串
                `,
			},
			{
				label: "ROUND",
				value: "ROUND",
				rule: `
    
                    语法<br />
                    ROUND ( 数字,保留位数 )<br />
                    返回值：数值
                `,
			},
			{
				label: "IF",
				value: "IF",
				rule: `
                    语法<br />
                    IF(条件, value)<br />
                    返回值： 条件参数成立返回value,否则没有值<br/>
                    语法<br />
                    IF(条件, okvalue, ngvalue)<br />
                    返回值： 条件参数成立返回okvalue，否则返回ngvalue
                `,
			},
			{
				label: "TODAY",
				value: "TODAY",
				rule: `
                    语法<br />
                    TODAY()<br />
                    返回值：  一个日期时间格式的值，参数有字段返回值依赖参数字段value是否存在
                `,
			},
		],
	},
];
