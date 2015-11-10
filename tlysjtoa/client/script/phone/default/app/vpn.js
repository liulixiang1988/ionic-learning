var progressbar = new ProgressBar();
function getProgressbar(){
	if(progressbar == null){
    	progressbar = new ProgressBar();
    }
}

function setSangfor(){
       var vpnInfo = new SangforInfo();
       vpnInfo.vpnIp ='218.22.191.77';
       vpnInfo.vpnPort='443';
       vpnInfo.authName='tgittest';
       vpnInfo.authPassword='tgittgit5861216';
       vpnInfo.certFile='';
       vpnInfo.certPassword='';
       SangforUtil.saveSangforInfo(vpnInfo);       
    }

function checknetwork(){
    if (SangforUtil.getSangforVpnStatus() == 0)
        return;
    var ajaxData = {};   
    ajaxData.method = "GET";        
    ajaxData.isBlock = true;
    ajaxData.url = 'http://172.16.216.55:8001/';
    ajaxData.successFunction = "successFunction";
    ajaxData.timeout=3000;
    ajaxData.failFunction = "failFunction";
    ajaxData.async=false;
    ajaxData.requestHeader = '{"User-Agent": "Mozilla/5.0 (Linux; U; Android 2.3.3; zh-cn; GT-I9100 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"}';
    ajaxData.reqCharset = "UTF-8";
    ajaxData.rspCharset = "UTF-8";
    var ajax = new DirectAjax(ajaxData);
    ajax.send();
}

function successFunction(ajax){ 
	//alert('network ok');
	}
function failFunction(ajax){
	//alert('try vpn');
	startSangforVpn();
}
function startSangforVpn(){
	//alert(SangforUtil.getSangforVpnStatus());
    //if(SangforUtil.getSangforVpnStatus()==0)
        //return;
	setSangfor();
	getProgressbar();
    progressbar.setMessage("VPN连接中...");
    progressbar.show();
    SangforUtil.startSangforVpn(testVpnCallBack);
}

function testVpnCallBack(result){
    progressbar.cancel();
	var str='';
    if(result == 0){
    	str='VPN服务器登录成功';
    	//ClientUtil.startClientUpdate(clientUpdateCallBack);
    	//$native.toast('VPN服务器登录成功!\n\n请重新点击“登陆”按钮进入系统');
       ExMobiWindow.alert('VPN服务器登录成功!\n\n请重新点击“登陆”按钮进入系统');
       return;
    }else if(result == 1){

       str="VPN初始化连接失败，请检查ip，port";

    }else if(result == 2){

       str="VPN认证失败，用户名或密码错误";
       

    }else if(result == 3){

       str="VPN认证失败，需附加短信验证";

    }else if(result == 4){

       str="VPN终端硬件特征码等待审批,请联系系统管理员。";

    }else{

        str="VPN连接状态码异常，为:"+result;

    }
    ExMobiWindow.alert("你的终端无法连接办公网络！\n\n" + str);
} 

function clientUpdateCallBack(code){
		if(code==0){
		        $native.toast('客户端连接成功，启用应用更新...');
				ClientUtil.startAppUpdate();				
			}
            else{
                $native.toast('客户端连接失败，VPN网络故障\n\\n' + SangforUtil.getSangforVpnStatus());
				}
	}

function stopSangforVpn(){
    if(SangforUtil.getSangforVpnStatus()!=0)
        return;
    SangforUtil.stopSangforVpn(stopVpnCallBack);

}

//vpn关闭回调函数

function stopVpnCallBack(result){

    if(result == 0){
        //alert("vpn服务器关闭连接成功");
    }else if(result == 1){
       //alert("vpn服务器关闭连接失败");
    } 
}

function doGetSangforVpnStatus(){

    var vpnStatus = SangforUtil.getSangforVpnStatus();

    if(vpnStatus == 0){

      alert("vpn服务器登录成功");

    }else if(vpnStatus == 1){

      alert("vpn服务器还未初始化");

    } else if(vpnStatus == 2){

      alert("vpn服务器初始化成功，但还未登录");

    }
}