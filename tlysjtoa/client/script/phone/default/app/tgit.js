/*
*	ExMobi4.x+ JS
*	Version	: 1.0.0
*	Author	: qinsncn
*	Email	: 
*	Weibo	: 
*	Copyright 2015 (c) 
*/

function sucessFun(path)
{
	//ExMobiWindow.alert(path);
 NativeUtil.open(path);
}
function errorFun(path)
{
	//ExMobiWindow.alert(path);
if(path=="")
{
ExMobiWindow.alert("文件超过10M，下载失败");
}
else
{
ExMobiWindow.alert("文件下载失败,请确认下载路径"+path);
}
}
function openfile(url,filename)
{
	var dspath="res:temp/"+filename;
	//ExMobiWindow.alert(dspath);
	ClientUtil.download(url,dspath, sucessFun,null,true);
}
//请求数据出错
function errormsg(msg)
{
	if(NetworkUtil.getConnectionType()==0)
	{
		errorconfirm("请检查您的手机是否接入网络！");
	}
	else
	{
		ExMobiWindow.alert(msg);
	}
	
}
//网络或会话出错
function errorconfirm(msg)
{
	ExMobiWindow.confirm(msg+',需要重新登录吗？',main,null);
}
function main()
{
	$native.openWebView("index.html");
}
