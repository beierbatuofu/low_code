export default {
  
  input:[//单行文本
      {
        label: "empty",
        value: "empty",
      },{
        label: "not_empty",
        value: "not_empty",
      },{
        label: "eq",
        value: "eq",
      },{
        label: "ne",
        value: "ne",
      },{
        label: "contain",
        value: "contain",
      },{
        label: "not_contain",
        value: "not_contain",
      },
    ],

  textarea:[//多行文本
    {
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    },{
      label: "eq",
      value: "eq",
    },{
      label: "ne",
      value: "ne",
    },{
      label: "contain",
      value: "contain",
    },{
      label: "not_contain",
      value: "not_contain",
    },
  ],

  select:[//下拉单选框
    {
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    },{
      label: "eq",
      value: "eq",
    },{
      label: "ne",
      value: "ne",
    }
  ],

  radio:[ //单选按钮组
    {
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    },{
      label: "eq",
      value: "eq",
    },{
      label: "ne",
      value: "ne",
    }
  ],

  number:[ //数字
    {
      label:'eq',
      value:'eq'
    },{
      label:'ne',
      value:'ne'
    },{
      label:'gt',
      value:'gt'
    },{
      label:'ge',
      value:'ge'
    },{
      label:'lt',
      value:'lt'
    },{
      label:'le',
      value:'le'
    },{
      label:'between',
      value:'between'
    }

  ],

  datetime:[//日期时间
    {
      label:'eq',
      value:'eq'
    },{
      label:'ne',
      value:'ne'
    },{
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    }
  ],

  userRadio:[//成员单选
    {
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    },{
      label: "eq",
      value: "eq",
    },{
      label: "ne",
      value: "ne",
    }

  ],
  deptRadio:[//部门单选
    {
      label: "empty",
      value: "empty",
    },{
      label: "not_empty",
      value: "not_empty",
    },{
      label: "eq",
      value: "eq",
    },{
      label: "ne",
      value: "ne",
    }
  ],
  user:[//成员多选
    {
			label: "contain_one",
			value: "contain_one",
		},{
			label: "contain_all",
			value: "contain_all",
		},{
			label: "eq_all",
			value: "eq_all",
		},{
			label: "empty",
			value: "empty",
		},{
			label: "not_empty",
			value: "not_empty",
		}
  ],
  dept:[//部门多选
    {
			label: "contain_one",
			value: "contain_one",
		},{
			label: "contain_all",
			value: "contain_all",
		},{
			label: "eq_all",
			value: "eq_all",
		},{
			label: "empty",
			value: "empty",
		},{
			label: "not_empty",
			value: "not_empty",
		}
  ],
  selectMulti:[//下拉复选
    {
			label: "contain_one",
			value: "contain_one",
		},{
			label: "contain_all",
			value: "contain_all",
		},{
			label: "eq_all",
			value: "eq_all",
		},{
			label: "empty",
			value: "empty",
		},{
			label: "not_empty",
			value: "not_empty",
		}
  ],
  checkbox:[//复选按钮组
    {
			label: "contain_one",
			value: "contain_one",
		},{
			label: "contain_all",
			value: "contain_all",
		},{
			label: "eq_all",
			value: "eq_all",
		},{
			label: "empty",
			value: "empty",
		},{
			label: "not_empty",
			value: "not_empty",
		}
  ],
  // uploadFile:[

  // ]
}