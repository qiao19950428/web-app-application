module.exports = {
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es6: true
	},
	extends: 'airbnb',
	// parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 6,
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	plugins: [
		'babel',
		'react',
		'promise',
		'markdown',
		'jsx-a11y'
	],
	rules: {
		'array-bracket-spacing': ['error', 'always'],	//强制属于元素和中括号之间有空格
		'arrow-spacing': ['error', { 'before': true, 'after': true } ],	//强制箭头函数的箭头之前之后有空格
		'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],  //强制在代码块中使用一致的大括号风格
		'block-spacing': ['error', 'always'],	//制在对象元素和花括号之间有空格
		'camelcase': ['error', { 'properties': 'never' }], //强制定义变量驼峰命名规则
		'class-methods-use-this': ['off'], // 允许非生命周期函数内不使用this
		'comma-dangle': ['off'],  //允许数组、对象字面量尾行有逗号
		'comma-spacing': ['error', {'before': false, 'after': true}],	//强制逗号前面不需要加空格，而逗号后面需要添加空格
		'comma-style': ['error', 'last'],	//强制逗号放在行尾
		'constructor-super': ['error'],	//强制class中添加super，若当前class是继承来的
		'consistent-return': ['off'], // 不强制方法末不使用 return
		'eqeqeq': ['error','allow-null'],	//强制使用===和!==
		'func-names': ['off'], // 以函数表达式定义函数时，不强制=后面的函数的方法名
		'indent': ['error', 4], //强制js语法缩进使用4个缩进
		'jsx-a11y/label-has-associated-control': ['off'],
        'jsx-a11y/label-has-for': ['off'],
        'jsx-a11y/alt-text': ['off'],	//允许img标签中不含alt属性，或对alt属性中的值不做要求
        'jsx-a11y/click-events-have-key-events': ['off'], // 不要求onClick伴随着onKeyUp/onKeyDown/onKeyPress
        'jsx-a11y/no-noninteractive-element-interactions': ['off'], //允许非交互式元素支持事件处理程序
		'jsx-a11y/no-static-element-interactions': ['off'], // 允许没有语义行为的DOM元素带有交互处理程序
		'keyword-spacing': ['error', {'before': true, 'after': true}],	//强制关键字前后必须有空格
		'key-spacing': ['error', {'beforeColon': false, 'afterColon': true}],	//冒号的前后空格
		'linebreak-style': ['off'], //关闭行位换行符检测
		'max-len': ['off'], // 不限制一行最大长度
		'new-cap': ['error'],	//强制构造函数首字母大写
		'no-console': ['off'], // 允许使用 console
		'no-dupe-keys': ['error'],  // 禁止字面量对象中出现重复的key
		'no-extend-native': ['off'],//禁止往原生对象的prototype上面添加属性
		'no-param-reassign': ['off'], // 允许函数内参数重定义或重新赋值
		'no-plusplus': ['off'], // 允许使用++、--等自加符号
		'no-unused-vars': ['error'],  //禁止定义无用变量
		'no-var': ['error'],	//禁止使用var定义变量
		'operator-linebreak': ['error', 'after'], //强制换行时把换行符放在操作符后面
		'quotes': ['error', 'single'],  //强制js字符串变量使用单引号定义
		'radix': ['error', 'as-needed'],	//使用praseInt时不强制加入基数
		'react/forbid-prop-types': ['error', { forbid: ['any'] }], // 当PropTypes类型为any时，进行报错
		'jsx-quotes': ['error', 'prefer-single'], //强制jsx属性值使用单引号定义
		'react/jsx-closing-bracket-location': ['error'],	// 强制jsx元素中关闭标签的位置
		'react/jsx-filename-extension': ['off'], // 允许其他文件使用jsx语法
		'react/jsx-indent': ['error', 4], // 强制jsx语法缩进使用4个空格
		'react/jsx-indent-props': ['error', 4], // 强制jsx的属性缩进为4个空格时
		'react/jsx-pascal-case': ['error'],	//强制引入的组件名必须为大驼峰
		'react/no-array-index-key': ['off'],// 允许使用数组下标作为list的key值
		'react/no-multi-comp': ['off'],    // 允许一个jsx文件中包含多个component
		'react/prefer-stateless-function': ['off'],	//允许无状态组件使用class定义
		'react/global-require': ['off'],
		'semi': ['error', 'always'],  //强制在语句末尾使用分号
		
	},
};
