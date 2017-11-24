这是一个freemarker测试文件：
我的名字是：${name} 和年龄${age!!}
列出列表：
<#list list as li>
	${list?seq_index_of(li)}.数据信息-${li}
</#list>

<#-- 定义一个数据  -->
<#assign  convert="$" + "{name}">
显示变量name:<#noparse>${convert }</#noparse>
显示变量name:<@tempVar?interpret/>
boolean类型：${aa???string("aa存在","aa不存在-" + age)}

<#macro hh  kk>
	模版输出内容--${kk}
</#macro>

调用宏：<@hh "哈哈哈哈哈哈哈哈"/>
当前时间：${.now} --${.now?date} -- ${.now?datetime}，使用版本${.version}，当前模版${.template_name}
可支持的后缀：

  <#assign suffixList=suffix?split(",")>

<#if otherList?? && (otherList?size > 0) >
      需要提示头：
	<#list otherList as su>
		on--${su!!}
	
	</#list>
</#if>

输出连续的序列值：
<#list 1..3 as a>
	out:${a}
</#list>




