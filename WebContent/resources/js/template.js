/*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 * artTemplate-修改版!!!
 * 数据源名称:$data
 * template.cache 模版渲染函数缓存
 * template.get(filename); 获取模版渲染函数的缓存，如果不存在则会进行查找filename模版编译再返回
 * template(filename, content);根据模版名称和数据返回结果，content为字符串时，返回content模版数据的渲染函数
 * template.render(source, options);根据source模版数据返回渲染函数，options可选，可指定filename作为模版缓存名称
 * template.renderFile(filename, data);根据模版名称和数据返回结果
 * 
 */
 
!(function () {


/**
 * 模板引擎 -- 根据模版名称获取数据
 * @name    template
 * @param   {String}            模板名
 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
 */
var template = function (filename, content) {
	//如果content是字符串，则用作模版数据进行编译
    return typeof content === 'string'
    ?   compile(content, {
            filename: filename
        })
    :   renderFile(filename, content);
};


template.version = '3.0.0';


/**
 * 设置全局配置
 * @name    template.config
 * @param   {String}    名称
 * @param   {Any}       值
 */
template.config = function (name, value) {
    defaults[name] = value;
};


/**
 * 
 *默认配置
 *
 */
var defaults = template.defaults = {
    openTag: '<%',    // 逻辑语法开始标签
    closeTag: '%>',   // 逻辑语法结束标签
    escape: true,     // 是否编码输出变量的 HTML 字符
    cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false,  // 是否压缩输出
    parser: null,      // 自定义语法格式器 @see: template-syntax.js
    debug:true,
    showRunCode:function(code){
    	//nothing 显示运行的代码
    }
};

/**
 * 模版渲染函数的缓存
 * 
 */
var cacheStore = template.cache = {};

//可能出错的信息
var mabyError = {
	condition:[/^[^\"\']+\.{2,}[^\"\']*$/,/^\s*\d+[\D]+/,/^\s*\{/,/[\|\&]\s*$/],
	tag:{ifTag:0,eachTag:0,switchTag:0,caseTag:0},
	errors:[],
	getErrorInfo:function(){
		var msg = this.errors.toString();
		if(this.tag.ifTag != 0){
			msg += "\n\t缺失 if "+(this.tag.ifTag < 0 ? "'开始'" : "'结束'")+"标记";
		}
		if(this.tag.eachTag != 0){
			msg += "\n\t缺失 each "+(this.tag.eachTag < 0 ? "'开始'" : "'结束'")+"标记";
		}
		if(this.tag.switchTag != 0){
			msg += "\n\t缺失 switch "+(this.tag.switchTag < 0 ? "'开始'" : "'结束'")+"标记";
		}
		return msg;
	}
};

//清空错误
var clearError = function(){
	mabyError.errors.splice(0);
	mabyError.tag.ifTag = 0;
	mabyError.tag.eachTag = 0;
	mabyError.tag.switchTag = 0;
	mabyError.tag.caseTag = 0;
}

/**
 * 渲染模板
 * @name    template.render
 * @param   {String}    模板
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
template.render = function (source, options) {
	//根据模版数据返回渲染结果
    return compile(source, options);
};


/**
 * 渲染模板(根据模板名)
 * @name    template.render
 * @param   {String}    模板名
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
var renderFile = template.renderFile = function (filename, data) {
	//获取编译的模版
	var fn = template.get(filename);
    return data ? fn(data) : fn;
    
};


/**
 * 获取编译缓存（可由外部重写此方法）
 * @param   {String}    模板名
 * @param   {Function}  编译好的函数
 */
template.get = function (filename) {

    var cache = null;
    
    if (cacheStore[filename]) {
        // 使用内存缓存
        cache = cacheStore[filename];
    } else if (typeof document === 'object') {
        // 不存在缓存的渲染函数，加载模板并编译
        var elem = document.getElementById(filename);
        if (elem) {
            var source = (elem.value || elem.innerHTML)
            .replace(/^\s*|\s*$/g, '');
            cache = compile(source, {
                filename: filename
            });
        }else{
        	//抛出错误
        	 var error = {
         	        filename: filename,
         	        name: 'Render Error',
         	        message: '指定的模版‘'+filename+'’未找到'
         	};
        	throw error;
        }
    }

    return cache;
};

/**
 * 
 * 每一行的调试信息
 * 
 */
var debugInfo = function(msg, error){
	if(defaults.debug && typeof console == 'object'){
		//显示异常信息
		console.log('debug:' + msg, error ? error.message : '');
	}
};

/**
 * 断言数据是否为空
 */
var assertEmpty = function(value, name){
	if(value == null || value.replace(/^\s+|\s+$/g,'').length == 0 ){
		throw new Error(name + "的内容不允许是空的");
	}
};

/**
 * 创建指定范围的序列
 * 
 * 默认设置最大六位数字，防止循环卡死
 * 
 */
var createRangeSeq = function(start, end, transferToString){
	var defMax = 0xf423f;
	var seq = [];
	start = parseInt(start);
	end = parseInt(end);
	if(!isNaN(start) && !isNaN(end)){
		if(end > defMax){
			debugInfo('createRangeSeq 设置的数据过大：' + end);
		}else{
			do{
				seq.push(start);
				start++;
			}while(start < end);
		}
	}
	
	if(transferToString){
		return '[' + seq.toString() + ']';
	}
	
	return seq;
};


/**
 * 转换成字符串
 * 
 */
var toString = function (value, type) {
	
	//next
    if (typeof value !== 'string') {

        type = typeof value;
        if(value == null){
        	value = '';
        }else if (type === 'number' || type === 'boolean') {
        	value = value.toString();
        } else if (type === 'function') {
            value = toString(value.call(value));
        } else {
        	try{
        		value = JSON.stringify(value);
        	}catch(e){
        		value = '';
        		//nothing
        		debugInfo("对象转换失败",e);
        		
        	}
            
        }
    }

    return value;

};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};

//循环调用
var each = function (data, callback) {
    var i = 0, len = 0;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};

//所有工具
var utils = template.utils = {

	$helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each,
    
    $debugInfo:debugInfo,
    
    $assertEmpty:assertEmpty,
    
    $createRangeSeq:createRangeSeq
    
};/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
template.helper = function (name, helper) {
    helpers[name] = helper;
};

//辅助类，可添加全局变量
var helpers = template.helpers = utils.$helpers;




/**
 * 模板错误事件（可由外部重写此方法）
 * @name    template.onerror
 * @event
 */
template.onerror = function (e,source) {
    var message = 'Template Error\n\n';
    for (var name in e) {
    	message += '<' + name + '>\n\t' + e[name] + '\n\n';
    }
    
    if (typeof console === 'object') {
        console.error(message);
        console.error("可能导致错误的原因如下：" + mabyError.getErrorInfo());
        console.log("\n");
        //console.log("错误源：" + stringify(source));
    }
    //返回true表示抛出异常
    return true;
};


/**
 * 模板调试器
 * 直接抛出错误
 */
var showDebugInfo = function (e, source) {
    //打印异常信息
    var res = template.onerror(e, source);
    if(res !== false){
    	throw e;
    }
    
    return function () {
        return '{Template Error}';
    };
    
};


/**
 * 编译模板
 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
 * @name    template.compile
 * @param   {String}    模板字符串
 * @param   {Object}    编译选项
 *
 *      - openTag       {String}
 *      - closeTag      {String}
 *      - filename      {String}
 *      - escape        {Boolean}
 *      - compress      {Boolean}
 *      - debug         {Boolean}
 *      - cache         {Boolean}
 *      - parser        {Function}
 *
 * @return  {Function}  渲染方法
 */
var compile = template.compile = function (source, options) {
    clearError();
    // 合并默认配置!!!
    options = options || {};
    for (var name in defaults) {
        if (options[name] === undefined) {
            options[name] = defaults[name];
        }
    }

    //模版文件名称
    var filename = options.filename;
    //渲染函数
    var Render  = null;
    
    try {
        var startTime = new Date().getTime();
    	Render = compilerHandler(source, options);
        var endTime = new Date().getTime();
        debugInfo("编译模版‘"+filename+"’耗时：" + (endTime - startTime) + "ms");
    } catch (e) {
        e.filename = '模版名称：' +(filename || 'anonymous');
        e.name = 'Syntax Error';

        return showDebugInfo(e, source);
        
    }
    
    
    // 对编译结果进行一次包装

    function render (data) {
        try {
        	var startTime = new Date().getTime();
            var htmlContent = new Render(data, filename) + '';
            var endTime = new Date().getTime();
            debugInfo("渲染模版‘"+filename+"’耗时：" + (endTime - startTime) + "ms");
            return htmlContent;
        } catch (e) {
            // 运行时出错后自动开启调试模式重新编译
            if (!options.debug) {
                options.debug = true;
                return compile(source, options)(data);
            }
            //返回编译结果
            return showDebugInfo(e, data)();
            
        }
        
    }
    

    render.prototype = Render.prototype;
    render.toString = function () {
        return Render.toString();
    };

    
    //根据名称缓存了模版渲染函数，如果没有指定名称则不会缓存
    if (filename && options.cache) {
        cacheStore[filename] = render;
    }

    
    return render;

};




// 数组迭代
var forEach = utils.$each;


// 静态分析模板变量
var KEYWORDS =
    // 关键字
    'break,case,catch,continue,debugger,default,delete,do,else,false'
    + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
    + ',throw,true,try,typeof,var,void,while,with'

    // 保留字
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
    + ',final,float,goto,implements,import,int,interface,long,native'
    + ',package,private,protected,public,short,static,super,synchronized'
    + ',throws,transient,volatile'

    // ECMA 5 - use strict
    + ',arguments,let,yield'

    + ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
var SPLIT_RE = /[^\w$]+/g;
var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
var BOUNDARY_RE = /^,+|,+$/g;
var SPLIT2_RE = /^$|,+/;


// 获取变量
function getVariable (code) {
    return code
    .replace(REMOVE_RE, '')
    .replace(SPLIT_RE, ',')
    .replace(KEYWORDS_RE, '')
    .replace(NUMBER_RE, '')
    .replace(BOUNDARY_RE, '')
    .split(SPLIT2_RE);
};


// 字符串转义
function stringify (code) {
	if(code == null){
		return '';
	}
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}

/**
 * 实际编译调用，返回渲染的函数Render
 * 
 */
function compilerHandler (source, options) {
    
    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape;
    
    var line = 1;
    var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};
    
    var isNewEngine = ''.trim;// '__proto__' in {}
    //处理取值异常
    var errorReplaces = ["(function(){try{ return " , ";}catch(e){$debugInfo($line+'- ',e);} return '';})()"];
    //取值代码(修改版)
    var replaces = [];
    if(isNewEngine){
    	replaces = ["$out='';", "$out+=",";", "$out","$out+=" + errorReplaces[0], errorReplaces[1] + ";"];
    }else{
    	replaces = ["$out=[];", "$out.push(",");", "$out.join('')","$out.push(" + errorReplaces[0], errorReplaces[1] + ");"];
    }
    
    //系统内部函数，防止随便引用，因此以'$sys_'开头
    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";
    
    var $sys_print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var $sys_include = "function(filename,data){"
    +      "data=data||$data;"
    + 	   "$debugInfo('开始导入模版内容，模版名称：' + filename);"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    var headerCode = "\n\t 'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");
    
    var mainCode = replaces[0] + "\n";

    var footerCode = "\t return new String(" + replaces[3] + ");\n"
    
    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
        code = code.split(closeTag);
        
        var $0 = code[0];
        var $1 = code[1];
        
        // code: [html]
        if (code.length === 1) {
            
            mainCode += html($0);
         
        // code: [logic, html]
        } else {
            
            mainCode += logic($0);
            
            if ($1) {
                mainCode += html($1);
            }
        }
        

    });
    
    var code = headerCode + mainCode + footerCode;
    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){"
        +       "throw {"
        +           "filename:$filename,"
        +           "name:'Render Error',"
        +           "message:e.message,"
        +           "line:$line"
        +       "};"
        + "}";
    }
    
    
    
    try {
        if(options.showRunCode && typeof options.showRunCode == "function"){
        	options.showRunCode(code);
        }
        
        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils;
        
        //构建成功返回
        return Render;
        
    } catch (e) {
        e.temp = "模版编译失败：\nfunction anonymous($data,$filename) {\n" + code + "\n}\n";
        throw e;
    }



    
    // 处理 HTML 语句
    function html (code) {
        
        // 记录行号
        line += code.split(/\n/).length - 1;

        // 压缩多余空白与注释
        if (compress) {
            code = code
            .replace(/\s+/g, ' ')
            .replace(/<!--[\w\W]*?-->/g, '');
        }
        
        if (code) {
        	//不需要处理异常，使用1，2
            code = "\t" + replaces[1] + stringify(code) + replaces[2] + "\n";
        }

        return code;
    }
    
    
    // 处理逻辑语句
    function logic (code) {

        var thisLine = line;
       
        if (parser) {
        
             // 语法转换插件钩子
            code = parser(code, options);
            
        } else if (debug) {
        
            // 记录行号
            code = code.replace(/\n/g, function () {
                line ++;
                return "$line=" + line +  ";";
            });
            
        }
        
        
        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {

            var escapeSyntax = escape && !/^=[=#]/.test(code);

            code = code.replace(/^=[=#]?|[\s;]*$/g, '');

            // 对内容编码
            if (escapeSyntax) {

                var name = code.replace(/\s*\([^\)]+\)/, '');

                // 排除 utils.* | include | print
                //取消一些判断,模版中不应该直接调用系统方法： && !/^(include|print)$/.test(name)
                if (!utils[name]) {
                    code = "$escape(" + code + ")";
                }

            // 不编码
            } else {
                code = "$string(" + code + ")";
            }
            
            //输出变量
            code = "\t" + replaces[4] + code + replaces[5];
            //code = replaces[1] + code + replaces[2];

        }
        
        if (debug) {
            code = "\t$line=" + thisLine + ";" + code;
        }
        
        // 提取模板中的变量名
        forEach(getVariable(code), function (name) {
            
            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) {
                return;
            }

            var value;

            // 声明模板变量
            // 赋值优先级:
            // [include, print] > utils > helpers > data
            if (name === '$sys_print') {

                value = $sys_print;

            } else if (name === '$sys_include') {
                
                value = $sys_include;
                
            } else if (utils[name]) {

                value = "$utils." + name;

            } else if (helpers[name]) {

                value = "$helpers." + name;

            } else {

                value = "$data." + name;
            }
            
            headerCode += name + "=" + value + ",";
            uniq[name] = true;
            
            
        });
        
        return code + "\n";
    }
    
    
};



// 定义模板引擎的语法


defaults.openTag = '{{';
defaults.closeTag = '}}';

//返回辅助方法调用的命令
var filtered = function (js, filter) {
    var parts = filter.split(':');
    var name = parts.shift();
    var args = parts.join(':') || '';

    if (args) {
        args = ', ' + args;
    }

    return '$helpers.' + name + '(' + js + args + ')';
};

//修复参数问题,引号内部的空格不作参数分割,source 可选
var checkAndRepair = function(paramsList, source){
	var pattern = /[\"\']/;
	if(source != null && !pattern.test(source)){
		return paramsList;
	}
	//存在引号，继续处理
	var newParam = [];
	var res = null;
	for(var i = 0; i < paramsList.length;i++){
		var param = paramsList[i];
		if(res == null){
			res = pattern.exec(param);
			newParam.push(param);
		}else{
			newParam[newParam.length - 1] = newParam[newParam.length - 1].concat(' ' + param);
			var current = pattern.exec(param);
			if(current != null && current[0] == res[0]){
				res = null;
			}
			
		}
	}
	return newParam;
};

/**
 * 备注：语法解析器，可自定义
 * 
 * 表达式以‘=’ 或者 ‘#’开头的不会进行html编码
 * 
 * 
 */
defaults.parser = function (code, options) {

    var originCode = code;
    code = code.replace(/^\s+/, '');//忽略开头的多个空格
    code = code.replace(/[;\s]+$/,'');//忽略结尾多个分号和空格
    //var split = code.split(' ');//不友好的写法，出现多个空格就会有问题,而“\s+”则无法避免字符串中的空格
    var paramsList = code.split(/\s+/);//分解参数，需要排除字符串
    paramsList = checkAndRepair(paramsList, originCode);//修复参数截取错误的问题
    var key = paramsList.shift();
    var args = paramsList.join(' ');

    switch (key) {

        case 'if':
        	
        	mabyError.tag.ifTag++;
        	assertEmpty(args, "if标签");
            code = 'if(' + args + '){';
            break;

        case 'else':
            
            if (paramsList.shift() === 'if') {
            	paramsList = ' if(' + paramsList.join(' ') + ')';//添加条件
            } else {
            	paramsList = '';//忽略条件
            }

            code = '}else' + paramsList + '{';
            break;
        case 'elseif':
        	
        	code = '}else if(' + args + '){';
        	break;
        case '/if':
        	
        	mabyError.tag.ifTag--;
            code = '}';
            break;

        case 'each':
        	
        	mabyError.tag.eachTag++;
            //默认迭代根数据源 
            var object = paramsList[0] || '$data';
            var as     = paramsList[1] || 'as';
            var value  = paramsList[2] || '$value';
            var index  = paramsList[3] || '$index';
            var param   = value + ',' + index;
            
            if (as !== 'as') {
            	throw new Error("each 指令错误，需要‘as’ 关键字: " + code);
                //object = '[]';
            }
            //扩展连续序列的语法“1..n”
            var rangePattern = /\s*(\d+)\.\.(\d+)\s*/;
            var rangeValues = rangePattern.exec(object);
            if(rangeValues != null){
            	object = createRangeSeq(rangeValues[1],rangeValues[2], true);
            }
            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

        	mabyError.tag.eachTag--;
            code = '});';
            break;
        case 'switch':

        	mabyError.tag.switchTag++;
        	assertEmpty(args, "switch标签");
        	code = 'switch('+args+'){\n\t case undefined:';
        	break;
        case 'case':
        	
        	var	beforeBreak = "break;\n\t";
        	mabyError.tag.caseTag++;
        	code = beforeBreak + 'case ' + args + ":";
        	break;
        case 'default':
        	
        	var	beforeBreak = "break;\n\t";
        	code = beforeBreak + 'default:';
        	break;
        case '/switch':
        	
        	mabyError.tag.switchTag--;
        	mabyError.tag.caseTag = 0;
        	code = '}';
        	break;
        case 'echo':

            code = '$sys_print(' + args + ');';
            break;

        case 'print':
        case 'include':
        	//变量名与指令名称重复时，可用该指令替代
            code = "$sys_" + key + '(' + paramsList.join(',') + ');';
            break;
        case 'set':
        	//设置变量，不输出
        	code = '(' + args + ');';
        	break;
        default:

            // 过滤器（辅助方法）-修改为忽略空格
            // {{value | filterA:'abcd' | filterB}} --old:/^\s*\|\s*[\w\$]/.test(args) 
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^[\.\w\$\s]*\|[\w\$\s]/.test(code)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {
                
                code = '=#' + key + '(' + paramsList.join(',') + ');';
            
            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }
    
    //check mabyError
    each(mabyError.condition,function(pattern){
    	var flag = pattern.test(originCode);
    	if(flag){
    		mabyError.errors.push("\n\t" + originCode);
    	}
    });
    
    return code;
};



// RequireJS && SeaJS
if (typeof define === 'function') {
    define(function() {
        return template;
    });

// NodeJS
} else if (typeof exports !== 'undefined') {
    module.exports = template;
} else {
    this.template = template;
}

})();