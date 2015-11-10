/*
 * 初始化exmobi事件
 * */
document.addEventListener("plusready", function() {
	//初始化JSON
	window.JSON = aJSON;
	
	//初始化cache
	A.cache.set = function(k, v){
		if(typeof v != 'object') return;
		try{
			CacheUtil.setCache(k, JSON.stringify(v));
			return true;
		}catch(e){
			return false;
		}
		
	};
	A.cache.get = function(k){
		try{
			return JSON.parse(CacheUtil.getCache(k));
		}catch(e){
			return null;
		}
	};
	A.cache.remove = function(k){
		CacheUtil.remove(k);
	};
},false);
document.addEventListener("backmonitor", function() {
	if(A.hasAsideMenuOpen){
        A.AsideMenu.hide();
    }else if(A.hasPopupOpen){
        A.closePopup();
    }else if(A.hasModalOpen){
    	A.Router.showModal('#'+$(A.hasModalOpen).attr('id'));
    }else{
    	if(A.Router.history().length<2){
    		$native.close();
    	}else{
    		window.history.go(-1);
    	}
    }
},false);
/*
 * 重置进度条
 * */
//A.showMask = function(fun){ $native.showMask(fun); };
//A.hideMask = function(fun){ $native.hideMask(fun); };
/*
 * 扩展Element
 */
//扩展file在ExMobi中调用本地能力
A.Element.addFormSelector('file','[data-role="file"]',function(el){
	var $el = $(el);
	var $label = $el.find('label');
	var $input = $el.find('input');
	var placeholder = $label.html();
	$el.tap(function(e){
		$native.openFileSelector(function(path){
			if(path&&($input.val()!=path)&&$el.data('change')){
				eval($el.data('change'));
			}
			var p = path.split('/');
			$label.html(path?p[p.length-1]:placeholder);
			$input.val(path);    
		});
	});	
	$label.html($input.val()||placeholder);
});
//扩展date和time在ExMobi中调用本地能力
A.Element.addFormSelector('datetime','[data-role="date"],[data-role="time"]',function(el){
	var $el = $(el);
	var $label = $el.find('label');
	var $input = $el.find('input');
	var placeholder = $label.html();
	$el.tap(function(e){
		$native.openDateTimeSelector($el.data('role'),$input.val(),function(str){
			if(str&&($input.val()!=str)&&$el.data('change')){
				eval($el.data('change'));
			}
			$label.html(str?str:placeholder);
			$input.val(str);
		});
	});
	$label.html($input.val()||placeholder);
});
//扩展barcode在ExMobi中调用本地能力
A.Element.addFormSelector('scanning','[data-role="barcode"],[data-role="qrcode"]',function(el){
	var $el = $(el);
	var $label = $el.find('label');
	var $input = $el.find('input');
	var placeholder = $label.html();
	$el.tap(function(e){
		$native.decode(function(encode){
			var result = encode?encode.result:'';
			if(result&&($input.val()!=result)&&$el.data('change')){
				eval($el.data('change'));
			}
			$label.html(result||placeholder);
			$input.val(result);
		});
	});
	$label.html($input.val()||placeholder);
});
/*
 * 扩展Router
*/
//扩展data-target="native"
A.Router.add('native', function(href, el){
	$native.openWebView(href, el);
});
//扩展data-target="exit"
A.Router.add('exit', function(){$native.exit('是否退出铜冠移动OA系统？');deltemfile();  });
//扩展data-target="close"
A.Router.add('close', function(){ $native.close(); });
//扩展data-target="exmobi"
A.Router.add('exmobi', function(href, el){
	$native.openExMobiPage(href, el);
});
//删除下载文件
function deltemfile()
		{
			try{
			var folder=new File("res:temp/",true);
		     var array =folder.listFiles(".*");/*根据过滤条件返回一个字符串数组*/ 
		     for(i=0;i<array.length;i++){
		     var file = array[i];
		     if(file.exists())
		     {
		       	file.deleteFile();
		     }
		     }
		     stopSangforVpn();
		    }
		    catch(e)
		    {
		    	//
		    }
		}
/*
 * 初始化默认ajax
 * */
//A.ajax = $util.server;