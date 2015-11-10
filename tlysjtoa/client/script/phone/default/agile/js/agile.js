var Agile = A = {
    version : '3.0.0',
    $ : window.Zepto||jQuery,
    //参数设置
    settings : {
        //page默认动画效果
        transitionType : 'slide',
        //自定义动画时的默认动画时间(非page转场动画时间)
        transitionTime : 250,
        //自定义动画时的默认动画函数(非page转场动画函数)
        transitionTimingFunc : 'ease-in',
        //toast 持续时间,默认为3s
        toastDuration : 3000,
        //加载page模板时，是否显示遮罩
        showPageLoading : false,
        //page模板默认的相对位置，主要用于开发hybrid应用，实现page的自动装载
        basePagePath : './',
        basePageSuffix : '.html',
        //ajax跨域请求默认处理函数，可以使用其他跨平台方法避免原生ajax的jsonp麻烦
        crossDomainHandler : null,
        //是否默认渲染模板
        isAutoRender : false,
        //滑动例外
        slidingException : '.sliding_container',
        //懒人加载默认图片
        lazyloadPlaceholder : ''
    },
    //手机或者平板
    mode : window.innerWidth < 800 ? "phone" : "tablet",
    hasTouch : 'ontouchstart' in window,
    //是否启动完成
    launchCompleted : false,
    //是否有打开的侧边菜单
    hasAsideMenuOpen : false,
    //是否有打开的弹出框
    hasPopupOpen : false,
    //是否打开模态框
    hasModalOpen : false,
    /**
     * 启动
     * @param opts {object}
     */
    launch : function(opts){
        $.extend(this.settings,opts);
        this.Element.init();
        this.Router.init();
        this.AsideMenu.init();
        
        this.launchCompleted = true;
    }
};

/**
 * 初始化页面组件元素
 */
A.Element = (function($){

    /**
     * 初始化容器内组件
     * @param {String} 父元素的css选择器
     * @param {Object} 父元素或者父元素的zepto实例
     */
    var init = function(selector){
        if(selector){
        	_initFormElement(selector);
        	_init_scroll(selector.parents('article[data-scroll="true"]'));
        	_init_lazyload(selector);
        }else{
        	_init_section();
            _init_article();
            _init_modal();
        }
    };
    
    /**
     * 初始化表单元素
     * @param {String} 父元素的css选择器
     * @param {Object} 父元素或者父元素的zepto实例
     */
    var _initFormElement = function(selector){
    	
    	var $el = $(selector || 'body');
        if($el.length == 0)return;
        
        for(var k in FORM_SELECTOR){
        	$.map(_getMatchElements($el,FORM_SELECTOR[k].selector),function(el){
        		var $obj = $(el);
        		if($obj.attr('__form_element_init__')) return;
        		FORM_SELECTOR[k].handler(el);
        		$obj.attr('__form_element_init__', true);
        	});
        }
        
        $el = null;
    };
    

    /**
     * 自身与子集相结合
     */
    var _getMatchElements = function($el,selector){
        return $el.find(selector).add($el.filter(selector));
    };
    
    /**
     * 初始化section
     */
    var _init_section = function(){  
    	
    	//初始化data-pageload事件
    	$(document).on('pageload','section',function(e){
    		var $el = $(this);
    		$el.data('__pageload_tag__',true);
        	var func = $el.data('pageload');
        	if(func) eval(func);
        	//初始化inject
        	if(A.settings.isAutoRender) _init_inject($el);
        	
        	//初始化section下的article左右滑动切换
        	if($el.data('article-slider')==true){

        		var isSwipe = true;
        		$el.on('touchstart', 'article', function(e){
                	isSwipe = true;
                	if($(e.target).parents(A.settings.slidingException).length>0){
                		isSwipe = false;
                	}
                });
        		$el.on('swipeRight', 'article', function(){
        			var currentArticle = $(this);
        			if(isSwipe) A.Transition.transArticle($el, currentArticle, currentArticle.prev('article'));       			
        		});
        		$el.on('swipeLeft', 'article', function(atcObj){
        			var currentArticle = $(this);
        			if(isSwipe) A.Transition.transArticle($el, currentArticle, currentArticle.next('article'));
        		});

        	}
        	//初始化横向滚动 
        	_init_scroll_orientation($el);
        });
    	//初始化data-pageshow事件
    	$(document).on('pageshow','section',function(e){
    		var $el = $(this);
    		if(!$el.data('__pageload_tag__')) $el.trigger('pageload');
        	var func = $el.data('pageshow');
        	if(func) eval(func);
        });
    	//初始化data-pagehide事件
    	$(document).on('pagehide','section',function(e){
    		var $el = $(this);
        	var func = $el.data('pagehide');
        	if(func) eval(func);
        	if($el.data('cache')==false){
        		$el.remove();
        	}
        });
    };
    
    /**
     * 初始化article
     */
    var _init_article = function(){
    	//初始化article的滚动组件
    	$(document).on('articleshow','article[data-scroll="true"]',function(){
        	A.Element.scroll(this);           
        });
    	
    	//初始化data-articleload事件
    	$(document).on('articleload','article',function(e){   		
    		var $el = $(this);
    		$el.data('__articleload_tag__',true);
    		_initFormElement($el);
    		_init_scroll_orientation($el);
        	var func = $el.data('articleload');
        	if(func) eval(func);
        	if($el.data('slider-page')){   
        		var key = A.cache._index++;
        		$el.attr('__slider_page__', key);
        		var slider = A.cache['__slider_page__'+key] = new A.Slider({
        	        selector : $el,
        	        container : $el,
        	        siliders : $el.find('[data-slider-page]'),
        	        showDots : false,
        	        onBeforeSlide : function(){
        	        	slider.flush({slides:$el.find('[data-role="slider-page"]')});
        	        	return true;
        	        },
        	        onAfterSlide : function(i){
        	        	var $target = $el.find('[data-role="slider-page"]:eq('+i+')').addClass('active').trigger('sliderpageshow');
        	        	$target.siblings('.active').removeClass('active').trigger('sliderpagehide');
        	        	var $section = $target.parents('section');
        	        	var $refer = $section.find('[data-target="sliderPage"][href="#'+$target.attr('id')+'"]').addClass('active');
        	        	$refer.siblings('.active').removeClass('active');
        	        	
        	        	A.Element.initScrollOrientation($refer.parents('[data-scroll-orientation="horizontal"]'), $refer);
        	        	
        	        }
        	    });
        	}
        });
    	//初始化data-articleshow事件
    	$(document).on('articleshow','article',function(e){
    		var $el = $(this);
    		//处理title
    		if($el.data('title')){
    			$el.parents('section').first().find('header .title').first().html(A.Util.script($el.data('title')));
    		}
    		_init_lazyload($el);
    		if(!$el.data('__articleload_tag__')) $el.trigger('articleload');
        	var func = $el.data('articleshow');
        	if(func) eval(func);
        });
    	//初始化data-articlehide事件
    	$(document).on('articlehide','article',function(e){
    		var $el = $(this);
        	var func = $el.data('articlehide');
        	if(func) eval(func);
        	if($el.data('cache')==false){        		
        		$el.remove();
        	}
        });
    };
    
    /**
     * 初始化modal
     */
    var _init_modal = function(){
    	//初始化data-modalload事件
    	$(document).on('modalload','.modal',function(e){   		
    		var $el = $(this);
        	var func = $el.data('modalload');
        	if(func) eval(func);  
        });
    	//初始化data-modalshow事件
    	$(document).on('modalshow','.modal',function(e){
    		var $el = $(this);
    		var showTag = $el.data('__modalshow_tag__');
    		if(!showTag){
    			$el.trigger('modalload');
    			$el.data('__modalshow_tag__',true);
    		}
        	var func = $el.data('modalshow');
        	if(func) eval(func);
        });
    	//初始化data-modalhide事件
    	$(document).on('modalhide','.modal',function(e){
    		var $el = $(this);
        	var func = $el.data('modalhide');
        	if(func) eval(func);
        	if($el.data('cache')==false){        		
        		$el.remove();
        	}
        });
    };
    
    /**
     * 初始化iscroll组件或容器内iscroll组件
     */
    var _init_scroll = function(selector){
        $.map(_getMatchElements($(selector),SELECTOR.scroll.selector),SELECTOR.scroll.handler);
    };
    
    /**
     * 初始化滚动组件
     */
    var _init_scroll_orientation = function(el, targetObj){
    	var $el = $(el);
    	var orientation = $el.data('scroll-orientation');
    	
    	if(!orientation){
    		$.map(_getMatchElements($el,SELECTOR.scrollOrientation.selector),SELECTOR.scrollOrientation.handler);
    	}else if(orientation=='horizontal'){
    		setTimeout(function(){
    			var scroller = A.Scroll($el,{hScroll:true,hScrollbar : false}).scroller;
        		if(targetObj.length>0) scroller.scrollToElement(targetObj[0]);
    		},1);   		
    	}else if(orientation=='vertical'){
    		SELECTOR.scroll.handler(el);
    	}
    };
    
    /**
     * 初始化数据注入组件
     */
    var _init_inject = function(el){
    	var $el = $(el);
    	
    	if(!$el.data('inject')){
    		$.map(_getMatchElements($el,SELECTOR.inject.selector),SELECTOR.inject.handler);
        	return;
    	} 	
    	var tag = '#'+$el.attr('id'); 	
    	if($el.attr('__inject_cache__')){
    		return;
    	}
    	$el.render();
    };
    
    /**
     * 初始化懒人加载组件
     */
    var _init_lazyload = function(el){
    	var $el = $(el);
    	var source = A.Util.script($el.data('source'));
    	if(!source){
    		$.map(_getMatchElements($el,SELECTOR.lazyload.selector),SELECTOR.lazyload.handler);
        	return;
    	}
    	var placeholder = $el.attr('placeholder')||A.settings.lazyloadPlaceholder;
    	if(!$el.attr('src')&&placeholder) $el.attr('src', placeholder);
    	
    	var eTop = $el.offset().top;//元素的位置
    	var validateDistance = 100;
    	var winHeight = $(window).height()+validateDistance;
    	if(eTop<0||eTop>winHeight) return;    	
    	
    	var _injectImg = function(data){
    		if(!$el.data('source')) return;
    		A.anim($el,'fadeOut', 200, function(){
    			$el.css('visibility', 'hidden');
    			$el.attr('src', data);
    			$el.removeAttr('data-source');
    			$el[0].onload = function(){
    				//_init_scroll($('section.active article[data-scroll]'));
    				A.anim($el,'fadeIn', 200, function(){
    					$el.css('visibility', 'visible');
    				});
        		};    			
    			
    		});			
    	};
    	
    	var type = $el.data('type');    	
    	if(type=='base64'){
    		A.ajax({
    			url : source,
    			success : function(data){
    				_injectImg(data);
    			},
    			isBlock : false
    		});
    	}else{
    		var img = new Image();
    		img.src = source;
    		if(img.complete) {
    			_injectImg(source);
    			img = null;
    	    }else{
    	    	img.onload = function(){
    				_injectImg(source);	
    				img = null;
        		}; 
    	    	
    	    }
    	}
    };
    

    /**
     * 构造toggle切换组件
     */
    var _init_toggle = function(el){
        var $el = $(el);
        if($el.find('div.toggle-handle').length>0){//已经初始化
            return;
        }
        var name = $el.attr('name');
        var onValue = $el.data('on-value');
        onValue = typeof onValue=='undefined'?'':onValue;
        var offValue = $el.data('off-value');
        offValue = typeof offValue=='undefined'?'':offValue;
        //添加隐藏域，方便获取值
        if(name){
            $el.append('<input type="hidden" name="'+name+'" value="'+($el.hasClass('active')?onValue:offValue)+'"/>');
        }
        $el.append('<div class="toggle-handle"></div>');
        $el.tap(function(){
            var $t = $(this),v = $t.hasClass('active')?offValue:onValue;
            $t.toggleClass('active').trigger('toggle',[v]);//定义toggle事件
            $t.find('input').val(v);
        });
        
    };
 
    /**
     * 构造checkbox和radio组件
     */
    var _init_checkbox = _init_radio = function(el){
    	$(el).tap(function(e){
    		try{
    			var $el = $(this);
        		var checkObj = $el.find('input')[0];
        		checkObj.checked = !checkObj.checked;
    		}catch(e){}
    		return false;
    	});
    };
    
    var SELECTOR = {
    		section : {selector:'section', handler:_init_section},
    		article : {selector:'article', handler:_init_article},
    		scroll : {selector:'[data-scroll="true"]', handler:function(el){
    				var zoom = $(el).data('zoom');
    				var tag = zoom==true?true:false;
    				setTimeout(function(){
    					A.Scroll(el,{
        					zoom:tag,
        					hScroll:tag,
        					onScrollEnd: function(){
        						_init_lazyload(el);
        					}
        				});
    				}, 1);	
    			}
    		},
    		inject : {selector:'[data-inject="true"]', handler:_init_inject},
    		lazyload : {selector:'img[data-source]', handler:_init_lazyload},
    		scrollOrientation : {selector:'[data-scroll-orientation]', handler:_init_scroll_orientation}
    		
    };
    var FORM_SELECTOR = {
    		toggle : {selector:'.toggle', handler:_init_toggle},
    		checkbox : {selector:'[data-role="checkbox"]', handler:_init_checkbox},
    		radio : {selector:'[data-role="radio"]', handler:_init_radio}
    };
    
    var _addFormSelector = function(type,selector,handler){
    	FORM_SELECTOR[type] = {selector:selector, handler:handler};
    };

    return {
        init : init,
        initForm : _initFormElement,
        scroll : _init_scroll,
        addFormSelector : _addFormSelector,
        initInject : _init_inject,
        initLazyload : _init_lazyload,
        initScrollOrientation : _init_scroll_orientation
    };
})(A.$);


/**
 * 侧边菜单
 */
A.AsideMenu = (function($){
    var $asideContainer,$sectionContainer,$sectionMask;
    var init = function(){
        $asideContainer = $('#aside_container');
        $sectionContainer = $('#section_container');
        if($('#section_container_mask').length==0) $sectionMask = $('<div id="section_container_mask"></div>').appendTo('#section_container');
        //添加各种关闭事件
        $sectionMask.on('tap',hideAsideMenu);

        var start,deltaX,gestureStarted;
        
        var  _touchStart = function(event) {
            var e = event.touches[0];
            start = {
                pageX: e.pageX,
                pageY: e.pageY,
                time: Number(new Date())
            };
            deltaX = 0;
            gestureStarted = true;
        };

        var _touchMove = function(event) {
            if(!gestureStarted) return;
            var e = event.touches[0];
            deltaX = e.pageX - start.pageX;
        };

        var _touchEnd = function(event) {
        	if(!gestureStarted) return;
        	if(Math.abs(deltaX)<6) return;
            var direction = deltaX>0?'right':'left';
            var $activeAside = $('#aside_container aside.active');
        	if($activeAside.data('position') == direction){
                hideAsideMenu();
            }
            gestureStarted = false;
        };
        
        $sectionMask.on({
        	'touchstart' : _touchStart,
        	'touchmove' : _touchMove,
        	'touchend' : _touchEnd,
        	'touchcancel' : _touchEnd
        });

        $asideContainer.on('tap','.agile-aside-close',hideAsideMenu);
        var isSwipe = true;
        $(document).on('touchstart','section.active[data-aside-left],section.active[data-aside-right]',function(e){
        	isSwipe = true;
        	if($(e.target).parents(A.settings.slidingException).length>0){
        		isSwipe = false;
        	}
        });
        $(document).on('swipeRight','section.active[data-aside-left]',function(e){
        	if(!isSwipe) return;
        	showAsideMenu($(this).data('aside-left'));
        });
        $(document).on('swipeLeft','section.active[data-aside-right]',function(e){
        	if(!isSwipe) return;
        	showAsideMenu($(this).data('aside-right'));
        });
        
    };
    /**
     * 打开侧边菜单
     * @param selector css选择器或element实例
     */
    var showAsideMenu = function(selector){
        var $aside = $(selector).addClass('active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            showClose = $aside.data('show-close'),
            width = $aside.width(),
            translateX = position == 'left'?width+'px':'-'+width+'px';
        if(showClose && $aside.find('div.agile-aside-close').length == 0){
            $aside.append('<div class="agile-aside-close"></div>');
        }

        //aside中可能需要scroll组件
        A.Element.scroll($aside);

        if(transition == 'overlay'){
            A.anim($aside,{translateX : '0%'});
        }else if(transition == 'reveal'){
            A.anim($sectionContainer,{translateX : translateX});
        }else{//默认为push
            A.anim($aside,{translateX : '0%'});
            A.anim($sectionContainer,{translateX : translateX});
        }
        $('#section_container_mask').show();
        A.hasAsideMenuOpen = true;
    };
    /**
     * 关闭侧边菜单
     * @param duration {int} 动画持续时间
     * @param callback 动画完毕回调函数
     */
    var hideAsideMenu = function(duration,callback){
        var $aside = $('#aside_container aside.active'),
            transition = $aside.data('transition'),// push overlay  reveal
            position = $aside.data('position') || 'left',
            translateX = position == 'left'?'-100%':'100%';

        var _finishTransition = function(){
            $aside.removeClass('active');
            A.hasAsideMenuOpen = false;
            callback && callback.call(this);
        };

        if(transition == 'overlay'){
            A.anim($aside,{translateX : translateX},duration,_finishTransition);
        }else if(transition == 'reveal'){
            A.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }else{//默认为push
            A.anim($aside,{translateX : translateX},duration);
            A.anim($sectionContainer,{translateX : '0'},duration,_finishTransition);
        }

        $('#section_container_mask').hide();
    };
    return {
        init : init,
        show : showAsideMenu,
        hide : hideAsideMenu
    };
})(A.$);
/**
 * section 页面远程加载
 */
A.Page = (function($){
	
	var _formatURL = function(url){
		url = url?url:'';
		if(url.indexOf('#')==0){
    		url = A.settings.basePagePath+url.replace('#','')+A.settings.basePageSuffix;
    	}
    	
		return url;
	};
	
	
    var _formatHash = function(hash){
        return hash.indexOf('#') == 0 ? hash.substr(1) : hash;
    };
    

    /**
     * 加载文档片段
     * @param url
     */
    var loadContent = function(hashObj,callback){   	
    	if(typeof hashObj=='string'){
    		hashObj = A.Util.parseHash(hashObj);
    	}
    	
    	if(!hashObj||!hashObj.url){
    		callback&&callback(null);
    		return;
    	}
    	
    	var url = _formatURL(hashObj.url);

    	var opts = {
                url : url,
                timeout : 20000,
                type : 'GET',
                success : function(html){    
                    callback && callback(html);
                },
                error : function(html){
                	callback && callback('');
                },
                isBlock : false
           };

    	return A.ajax(opts);
    };
    
    return {
        loadContent : loadContent,
        formatURL : _formatURL
    };
})(A.$);
/**
 * 路由控制器
 */
A.Router = (function($){
    var _history = [];
    /**
     * 初始化events、state
     */
    var init = function(){
        $(window).on('popstate', _popstateHandler);
        //阻止含data-target或者href以'#'开头的的a元素的默认行为
        $(document).on('click','a',function(e){
            var target = $(this).data('target'),          
                href = $(this).attr('href');
            if(!href ||  href.match(/^#/) || target){
                e.preventDefault();
                return false;
            }
        });
        $(document).on('tap','[data-target]',_targetHandler);
        _initIndex();

    };

    //处理app页面初始化
    var _initIndex = function(){
        //取页面中第一个section作为app的起始页
        var $section = $('#section_container section').first();
        var indexHash = '#'+$section.attr('id'); 
        _showSection(indexHash);//跳转到指定的页面
    };

    /**
     * 处理浏览器的后退事件
     * 前进事件不做处理
     * @private
     */
    var _popstateHandler = function(e){
        if(e.state && e.state.hash){
            var hash = e.state.hash;
            if(_history[1] && hash === _history[1].hash){//存在历史记录，证明是后退事件
                A.hasAsideMenuOpen && A.AsideMenu.hide();//关闭当前页面的菜单
                A.hasPopupOpen && A.Popup.close();//关闭当前页面的弹出窗口
                back();
            }else{//其他认为是非法后退或者前进
                return;
            }
        }else{
            return;
        }

    };   
    
    
    var _targetHandler = function(){
        var _this = $(this),
            target = _this.data('target'),
            href = _this.attr('href');
        if(ROUTER[target]) ROUTER[target](href,_this);
    };

    /**
     * 跳转到新页面
     * @param hash 新href的'#id'
     */
    var _showSection  = function(href){
    	 	
    	//读取hash信息
        var hashObj = A.Util.parseHash(href);   

    	href = hashObj.tag;
    	
    	var hash = hashObj.hash;
    	
        if(A.hasAsideMenuOpen){//关闭菜单后再转场
            A.AsideMenu.hide(200,function(){
                _showSection(hash);
            });
            return;
        }

        var _commonHandle = function(){
        	
        	var sameSection = true;
        	
        	if(_history.length==0){
        		//初始化section
        		$section.trigger('pageinit').trigger('pageshow').data('init',true).find('article.active').trigger('articleshow');	  
        	}else{
        		var current = _history[0];
	            //同一个页面,则不重新加载
	            if(current.hash === hashObj.hash){
	                return;
	            }
	            sameSection = (current.tag == hashObj.tag);

	            if(sameSection){//相同页面，触发相关事件
	            	$section.trigger('pageshow').find('article.active').trigger('articlehide');
	            }else{//不同卡片页跳转动画
	            	_changePage(current.tag,hashObj.tag);
	            }
        	}
        	_add2History(hash, sameSection);

        };
        
        var $section = $(href);
        if($section.length==0){
        	if (A.settings.showPageLoading) A.showMask();
        	A.Page.loadContent(hashObj,function(html){
        		var source = $('<div>'+html+'</div>').find(href).data('source');
            	A.Page.loadContent(source,function(data){
            		if (A.settings.showPageLoading) A.hideMask();
            		if(source){
            			data = A.Util.formatJSON(data);
                		var render = template.compile(html);
                    	html = render(data);
            		}
            		if($(href).length==0) $('#section_container').append(html);
            		$section = $(href);
                	_commonHandle();
                });
        	});
        }else{
        	_commonHandle();
        }


    };
    /**
     * 后退
     */
    var back = function(){    
    	var current = _history.shift().tag;
    	var target = _history[0].tag;
        _changePage(current,target,true);
    };
    var _changePage = function(current,target,isBack){
        A.Transition.run(current,target,isBack);
    };
    /**
     * 缓存访问记录
     */
    var _add2History = function(hash,noState){
    	var hashObj = A.Util.parseHash(hash);
    	if(_history.length>0&&$(_history[0].tag).data('cache')==false){
    		noState = true;
    	}
        if(noState){//不添加浏览器历史记录
            _history.shift(hashObj);
            window.history.replaceState(hashObj,'',hash);
        }else{       	
            window.history.pushState(hashObj,'',hash);
        }
        _history.unshift(hashObj);
    };

    /**
     * 激活href对应的article
     * @param href #id
     * @param el 当前锚点
     */
    var _showArticle = function(href,el){

		$el = $(el||'section.active:first');
		
    	//读取hash信息
        var hashObj = A.Util.parseHash(href);
    	
    	href = hashObj.tag;
    	
    	var _section = $el.is('section')?$el:$el.parents('section').first();
    	
    	var article = _section.find(href);
    	
    	var _commonHandle = function(){
	        if(article.hasClass('active'))return;
	        
	      	//相应的按钮设置为active
	    	var id = article.attr('id');
	    	if(id){
	    		_section.find('a[data-target="article"]').each(function(i){
		    		$refer = $(this);
		    		var referHashObj = A.Util.parseHash($refer.attr('href'));
		    		if(referHashObj.tag=='#'+id){
		    			$refer.addClass('active');
		    		}else{
		    			$refer.removeClass('active');
		    		}	    		
		    	});
	    	}else{
	    		$el.addClass('active').siblings('.active').removeClass('active');
	    	}
	    	
	    	
	    	//动画展示
	    	var targetObj = article;
	    	var currentObj = article.addClass('active').siblings('.active');
	    	if(_section.data('article-slider')){
	    		A.Transition.transArticle(_section, currentObj, targetObj);
	    	}else{
	    		A.Transition.change({
		    		target : targetObj,
		    		current : currentObj,
		    		trigger : 'article'
		    	});
	    	}
	    	
	    	
       };
    	
        if(article.length==0){
        	if (A.settings.showPageLoading) A.showMask();
        	A.Page.loadContent(hashObj,function(html){
        		var source = $('<div>'+html+'</div>').find(href).data('source');
            	A.Page.loadContent(source,function(data){   
            		if (A.settings.showPageLoading) A.hideMask();
            		if(source){
	            		data = A.Util.formatJSON(data);
	            		var render = template.compile(html);
	                	html = render(data);
            		}
            		if(_section.find(href).length==0) _section.append(html);
                	article = _section.find(href);
                	_commonHandle();
                });
        	});

        }else{
        	_commonHandle();
        }

    };

    var _toggleAsideMenu = function(hash){
        A.hasAsideMenuOpen?A.AsideMenu.hide():A.AsideMenu.show(hash);
    };
    
    
    var _showModal = function(href){
    	//读取hash信息
        var hashObj = A.Util.parseHash(href);
    	
    	href = hashObj.tag;

    	var _doToggle = function(href){
    		var $el = $(href);
    		if($el.hasClass('active')){
    			A.hasModalOpen = false;
    			$el.removeClass('active').trigger('modalhide').find('article').trigger('articleshow');
    		}else{
    			A.hasModalOpen = $el;
    			$el.addClass('active').trigger('modalshow').find('article').trigger('articlehide');
    		}
    	};
    	
    	if($(href).length==0){
    		if (A.settings.showPageLoading) A.showMask();
    		A.Page.loadContent(hashObj,function(html){
    			var source = $('<div>'+html+'</div>').find(href).data('source');
            	A.Page.loadContent(source,function(data){   
            		if (A.settings.showPageLoading) A.hideMask();
            		if(source){
	            		data = A.Util.formatJSON(data);
	            		var render = template.compile(html);
	                	html = render(data);
            		}
                	$('body').append(html);
        			_doToggle(href);
                });
    		});		    		       	
    	}else{
    		_doToggle(href);
    	}

    };
    
    var _showSliderPage = function(href){
    	var currentSliderPage = $(href);
    	if(currentSliderPage.length==0) return;
    	var parentArticle = currentSliderPage.parents('article');
    	var key = parentArticle.attr('__slider_page__');
    	var slider = A.cache['__slider_page__'+key];
		if(slider){
			slider.flush({slides:parentArticle.find('[data-role="slider-page"]')});
			slider.index(currentSliderPage.index());
		}
    };
    
    var ROUTER = {
    		section : _showSection,
    		article : _showArticle,
    		aside : _toggleAsideMenu,
    		back : function(){ window.history.go(-1); },   		
    		modal : _showModal,
    		sliderPage : _showSliderPage
    };
    
    var _addRouter = function(type, handler){
    	ROUTER[type] = handler;
    };

    return {
        init : init,
        goTo : _showSection,
        showArticle : _showArticle,
        back : back,
        showModal :_showModal,
        add : _addRouter,
        history : function(){
        	return _history;
        },
        showSliderPage : _showSliderPage
    };
})(A.$);
/**
 * 提供一些简单的模板，及artTemplate的渲染
 */
A.Template = (function($){
    /**
     * 背景模板
     * @param el  selector
     * @param title  显示文本
     * @param icon   图标
     */
    var background = function(el,title,className){
        var markup = '<div class="agile-back-mask"><div class="agile-icon '+className+'"></div><div>'+title+'</div></div>';
        $(el).html(markup);
    };
    /**
     * 无记录背景模板
     * @param el
     */
    var no_result = function(el){
        background(el,'没有找到相关数据','agile-drawer');
    };
    /**
     * 加载等待背景模板
     * @param el
     */
    var loading = function(el){
        background(el,'加载中...','agile-cloud-download');
    };

    /**
     * 借助artTemplate模板来渲染页面
     * @param containerSelector 目标容器
     * @param templateId  artTemplate模板ID
     * @param data 模板数据
     * @param type replace|add 渲染好的文档片段是替换还是添加到目标容器中
     */
    var render = function(containerSelector,templateId,data,type){
        var el =  $(containerSelector),
            type = type || 'replace';//replace  add
        if($.type(data) == 'array' && data.length == 0 ){
            no_result(el);
        }else{
            var html = $(template(templateId,data));
            if(type == 'replace'){
                el.html(html);
            }else{
                el.append(html);
            }
            A.Element.init(html);
        }
    };
    
    return {
        render : render,
        background : background,
        loading : loading,
        no_result : no_result
    };
})(A.$);
/**
 *  消息组件
 */
A.Toast = (function($){
    var toast_type = 'toast',_toast,timer,
        //定义模板
        TEMPLATE = {
            toast : '<a href="#">{value}</a>',
            success : '<a href="#"><i class="agile-toast-success"></i>{value}</a>',
            error : '<a href="#"><i class="agile-toast-error"></i>{value}</a></div>',
            info : '<a href="#"><i class="agile-toast-info"></i>{value}</a>'
        };

    var _init = function(){
        //全局只有一个实例
        $('body').append('<div id="agile_toast"></div>');
        _toast = $('#agile_toast');
        _subscribeCloseTag();
    };

    /**
     * 关闭消息提示
     */
    var hide = function(){
        A.anim(_toast,'scaleOut',function(){
            _toast.hide();
           _toast.empty();
        });
    };
    /**
     * 显示消息提示
     * @param type 类型  toast|success|error|info  空格 + class name 可以实现自定义样式
     * @param text 文字内容
     * @param duration 持续时间 为0则不自动关闭,默认为3000ms
     */
    var show = function(type,text,duration){
        if(timer) clearTimeout(timer);
        var classname = type.split(/\s/);
        toast_type = classname[0];
        _toast.attr('class',type).html(TEMPLATE[toast_type].replace('{value}',text)).show();
        A.anim(_toast,'scaleIn');
        if(duration !== 0){//为0 不自动关闭
            timer = setTimeout(hide,duration || A.settings.toastDuration);
        }
    };
    var _subscribeCloseTag = function(){
        _toast.on('tap','[data-target="close"]',function(){
            hide();
        });
    };
    _init();
    return {
        show : show,
        hide : hide
    };
})(A.$);
/**
 * page转场动画
 * 可自定义css动画
 */
A.Transition = (function($){
    var isBack,$current,$target,transitionName,
        animationClass = {
        //[[currentOut,targetIn],[currentOut,targetIn]]
        empty : [['','empty'],['empty','']],
        slide : [['slideLeftOut','slideLeftIn'],['slideRightOut','slideRightIn']],
        cover : [['','slideLeftIn'],['slideRightOut','']],
        slideUp : [['','slideUpIn'],['slideDownOut','']],
        slideDown : [['','slideDownIn'],['slideUpOut','']],
        popup : [['','scaleIn'],['scaleOut','']],
        flip : [['slideLeftOut','flipOut'],['slideRightOut','flipIn']]
        };
    var _doTransition = function(){
        //触发 beforepagehide 事件
        $current.trigger('beforepagehide',[isBack]);
        //触发 beforepageshow 事件
        $target.trigger('beforepageshow',[isBack]);
        var c_class = 'anim '+(transitionName[0]||'empty') ,t_class = 'anim animating '+(transitionName[1]||'empty');
        $current.bind('webkitAnimationEnd', function() { _finishTransition(c_class, t_class); }).addClass(c_class);
        $target.addClass(t_class);
    };
    var _finishTransition = function(c_class, t_class) {
        $current.off('webkitAnimationEnd');
        $target.off('webkitAnimationEnd');
        //reset class
        $current.removeClass(c_class).removeClass('active');
        $target.removeClass(t_class).addClass('active');
        //add custom events
        !$target.data('init') && $target.trigger('pageinit').data('init',true);
        !$current.data('init') && $current.trigger('pageinit').data('init',true);
        //触发pagehide事件
        $current.trigger('pagehide',[isBack]);
        //触发pageshow事件
        $target.trigger('pageshow',[isBack]);

        $current.find('article.active').trigger('articlehide');
        $target.find('article.active').trigger('articleshow');
        $current = $target = null;//释放
    };

    /**
     * 执行转场动画，动画类型取决于目标page上动画配置(返回时取决于当前page)
     * @param current 当前page
     * @param target  目标page
     * @param back  是否为后退
     */
    var run = function(current,target,back){
        //关闭键盘
        $(':focus').trigger('blur');
        isBack = back;
        $current = $(current);
        $target = $(target);
        var type = isBack?$current.attr('data-transition'):$target.attr('data-transition');
        type = type|| A.settings.transitionType||'empty';
        //后退时取相反的动画效果组
        transitionName  = isBack ? animationClass[type][1] : animationClass[type][0];
        _doTransition();
    };

    /**
     * 添加自定义转场动画效果
     * @param name  动画名称
     * @param currentOut 正常情况下当前页面退去的动画class
     * @param targetIn   正常情况下目标页面进入的动画class
     * @param backCurrentOut 后退情况下当前页面退去的动画class
     * @param backCurrentIn 后退情况下目标页面进入的动画class
     */
    var addAnimation = function(name,currentOut,targetIn,backCurrentOut,backCurrentIn){
        if(animationClass[name]){
            console.error('该转场动画已经存在，请检查你自定义的动画名称(名称不能重复)');
            return;
        }
        animationClass[name] = [[currentOut,targetIn],[backCurrentOut,backCurrentIn]];
    };
    
    var change = function(opts){
    	var targetObj = $(opts.target);
    	var currentObj = $(opts.current);
    	var targetAnimType = targetObj.data('transition');
    	var currentAnimType = targetObj.data('transition');
    	targetAnimType = animationClass[targetAnimType]?animationClass[targetAnimType][0][1]:'empty';
    	currentAnimType = animationClass[currentAnimType]?animationClass[currentAnimType][0][0]:'empty';
    	
    	A.anim(targetObj, targetAnimType, function(){
    		targetObj.addClass('active');
    		if(opts.trigger){    			
    			targetObj.trigger(opts.trigger+'show');
    		}
    	});
    	
    	A.anim(currentObj, currentAnimType, function(){
    		currentObj.removeClass('active');
    		if(opts.trigger){
    			currentObj.trigger(opts.trigger+'hide');
    		}
    	});
    	
    };
    
    var _trans_article = function(currentSection, currentArticle, targetArticle){
    	if(!targetArticle||targetArticle.length==0) return;
    	var type,location;   	
    	location = currentArticle.index()<targetArticle.index()?'left':'right';
    	type = location=='left'?'Left':'Right';

		A.anim(currentArticle, 'slide'+type+'Out', function(){
			currentArticle.removeClass('active').trigger('articlehide');
		});
		A.anim(targetArticle, 'slide'+type+'In', function(){
			targetArticle.addClass('active').trigger('articleshow');
			var targetArticleId = targetArticle.attr('id');
			if(!targetArticleId) return;
			currentSection.find('a[data-target="article"]').each(function(i){
	    		var $refer = $(this);
	    		var referHashObj = A.Util.parseHash($refer.attr('href'));
	    		if(referHashObj.tag=='#'+targetArticleId){
	    			$refer.addClass('active');
	    			A.Element.initScrollOrientation($refer.parents('[data-scroll-orientation="horizontal"]'), $refer);
	    		}else{
	    			$refer.removeClass('active');
	    		}	    		
	    	});
		});
		
    };
    
    return {
        run : run,
        add : addAnimation,
        change : change,
        transArticle : _trans_article
    };

})(A.$);
/**
 * 常用工具类
 */
A.Util = (function($){
	var parseHash = function(hash){
		var url = hash;
		url = _script(url);
        var tag,query,param={};
        var arr = hash.split('?');
        tag = arr[0];
        if(arr.length>1){
            var seg,s;
            query = arr[1];
            seg = query.split('&');
            for(var i=0;i<seg.length;i++){
                s = seg[i].split('=');
                param[s[0]] = s[1];
            }
        }
        
        if(tag.indexOf('#')!=0){
        	var p = A.Util.parseURL(url);
        	if(p.getFragment()){
        		tag = "#"+p.getFragment();
        	}else{
        		var tags = tag.split('/');
    			tag = tags[tags.length-1];
    			tag = '#'+tag.split('.')[0];
        	}
			
			hash = tag + (arr.length>1?'?'+arr[1]:'');
			
			url = url.replace(new RegExp(tag,'g'),'');
		}
        

        return {
        	url : url,
            hash : hash,
            tag : tag,
            query : query,
            param : param
        }
    };
    
    var _formatJSON = function(data){
    	return data?(typeof data=='string'?eval('('+data+')'):data):{};
    };

    /**
     * 格式化date
     * @param date
     * @param format
     */
    var formatDate = function(date,format){
        var o =
        {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(),    //day
            "h+" : date.getHours(),   //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
            "S" : date.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format))
            format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    };
    
    
    var URLParser = function(url) {  

	    this._fields = {  
	        'Username' : 4,   //用户
	        'Password' : 5,   //密码
	        'Port' : 7,       //端口
	        'Protocol' : 2,   //协议
	        'Host' : 6,       //主机
	        'Pathname' : 8,   //路径
	        'URL' : 0,   
	        'Querystring' : 9,//查询字符串
	        'Fragment' : 10   //锚点
	    };  
	
	    this._values = {};  
	    this._regex = null;  
	    this.version = 0.1;  
	    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;  
	    for(var f in this._fields)  
	    {  
	        this['get' + f] = this._makeGetter(f);  
	    }  
	
	    if (typeof url != 'undefined')  
	    {  
	        this._parse(url);  
	    }  
	};
	URLParser.prototype.setURL = function(url) {  
	    this._parse(url);  
	};
	
	URLParser.prototype._initValues = function() {  
	    for(var f in this._fields)  
	    {  
	        this._values[f] = '';  
	    }  
	};
	
	URLParser.prototype._parse = function(url) {  
	    this._initValues(); 
	    var r = this._regex.exec(url);  
	    
	    if (!r) throw "DPURLParser::_parse -> Invalid URL";  
	
	    for(var f in this._fields) if (typeof r[this._fields[f]] != 'undefined')  
	    {  
	        this._values[f] = r[this._fields[f]];  
	    }
	};
	URLParser.prototype._makeGetter = function(field) {  
	    return function() {  
	        return this._values[field];  
	    };
	};
	
	var _isCrossDomain = function(url){
    	if(!url||url.indexOf(':')<0) return false;

    	var urlOpts = A.Util.parseURL(url);
    	
    	if(!urlOpts.getProtocol()) return false;
    	
    	return !((location.protocol.replace(':','')+location.host)==(urlOpts.getProtocol()+urlOpts.getHost()+':'+urlOpts.getPort()));
    };
    
    var _script = function(str){
    	return str?str.trim().replace(/\$\{([^\}]*)\}/g, function(s, s1){
    		try{
    			return eval(s1.trim());
    		}catch(e){
    			return '';
    		}
    		
    	}):'';
    };
    
    var checkBoolean = function(){
    	var result = false;
    	for(var i=0;i<arguments.length;i++){
    		if(typeof arguments[i]=='boolean'){
    			return arguments[i];
    		}
    	}
    	return result;
    };
    
    var _eval = function(str){
    	str = (str||'').trim();
    	var obj = {};   	
    	str.replace(/\$\{(.*]*)\}/g, function(s, s1){    		
    		obj = eval('('+s1.trim()+')');    		
    		return '';
    	});
    	return obj;
    };
    
    /*
     * $.ajax函数封装，判断是否有跨域，并且设置跨域处理函数
     * @param ajax json对象，进行简单统一处理，如果需要完整功能请使用$.ajax
     * */
    var _ajax = function(opts){
    	if(!opts||!opts.url) return;
    	opts.url = _script(opts.url);
    	
    	var random = '__ajax_random__='+Math.random();
    	opts.url += (opts.url.split(/\?|&/i).length==1?'?':'&')+random;
    	
    	var _isBlock = A.Util.checkBoolean(opts.isBlock,A.settings.showPageLoading);
    	
    	var ajaxData = {
                url : opts.url,
                timeout : 20000,
                type : opts.type||'get',
                dataType : opts.dataType||'text',
                success : function(html){
                    opts.success && opts.success(html);
                    if(_isBlock) A.hideMask();
                },
                error : function(html){
                	opts.error && opts.error(null);
                	if(_isBlock) A.hideMask();
                }
           };

    	var isCross = _isCrossDomain(opts.url);

    	var handler = $.ajax;
    	
    	if(isCross){
    		ajaxData.dataType = 'jsonp';
    		handler = A.settings.crossDomainHandler||handler;
    	}
    	if(ajaxData.dataType.toLowerCase()=='jsonp'){
    		ajaxData.jsonp = opts.jsonp||'__jsonpcallback';
    	}
    	
    	if(_isBlock) A.showMask();
    	
    	handler(ajaxData);
    };
    
    

    return {
        parseHash : parseHash,
        formatDate : formatDate,
        formatJSON : _formatJSON,
        parseURL : function(url){
        	return new URLParser(url);
        },
        isCrossDomain : _isCrossDomain,
        script :　_script,
        eval :　_eval,
        ajax : _ajax,
        checkBoolean : checkBoolean
    };

})(A.$);
/*
 * cache操作
 * */
(function(){
	//通用缓存
	A.cache = {};
	A.cache._index = 0;
	A.cache.set = function(k, v){
		window.localStorage.setItem(k, JSON.stringify(v));
	};
	A.cache.get = function(k){
		return JSON.parse(window.localStorage.getItem(k));
	};
	A.cache.remove = function(k){
		window.localStorage.removeItem(k);
	};

})();
(function($){
    /*
     * alias func
     * 简化一些常用方法的写法
     ** /
    /**
     * 完善zepto的动画函数,让参数变为可选
     */
    A.anim  =  function(el,animName,duration,ease,callback){
        var d, e,c;
        var len = arguments.length;
        for(var i = 2;i<len;i++){
            var a = arguments[i];
            var t = $.type(a);
            t == 'number'?(d=a):(t=='string'?(e=a):(t=='function')?(c=a):null);
        }
        $(el).animate(animName,d|| A.settings.transitionTime,e||A.settings.transitionTimingFunc,c);
    };
    
    /**
     * 显示loading框
     * @param text
     */
    A.showMask = function(text, closeCallback){
    	if(typeof text=='function'){
    		closeCallback = text;
    		text = '';
    	}
        A.Popup.loading(text, closeCallback);
    };
    /**
     * 关闭loading框
     */
    A.hideMask = function(){
        A.Popup.close(true);
    };
    /**
     *  显示消息
     * @param text
     * @param type toast|success|error|info
     * @param duration 持续时间，为0则不自动关闭
     */
    A.showToast = function(text,type,duration){
        type = type || 'toast';
        A.Toast.show(type,text,duration);
    };
    /**
     * 关闭消息提示
     */
    A.hideToast = function(){
        A.Toast.hide();
    };
    A.alert = function(title,content){
        A.Popup.alert(title,content);
    };
    A.confirm = function(title,content,okCall,cancelCall){
        A.Popup.confirm(title,content,okCall,cancelCall);
    };
    /**
     * 弹出窗口
     * @param options
     */
    A.popup = function(options){
        A.Popup.show(options);
    };
    /**
     * 关闭窗口
     */
    A.closePopup = function(){
        A.Popup.close();
    };
    /**
     * 带箭头的弹出框
     * @param html [可选]
     * @param pos [可选]  位置
     * @param arrowDirection [可选] 箭头方向
     * @param onShow [可选] 显示之前执行
     */
    A.popover = function(html,pos,arrowDirection,onShow){
        A.Popup.popover(html,pos,arrowDirection,onShow);
    };
    /**
     * 自动渲染模板并填充到页面
     * @param containerSelector 欲填充的容器
     * @param templateId 模板ID
     * @param data 数据源
     * @param type [可选] add|replace
     */
    A.tmpl = function(containerSelector,templateId,data,type){
        A.Template.render(containerSelector,templateId,data,type);
    };
    /*
     * 简版ajax函数写法
     * @param ajax json对象，进行简单统一处理，如果需要完整功能请使用$.ajax
     * */
    A.ajax = A.Util.ajax;
    
    /*
     * 数据注入增强版，opts为选择项 tmpl、tmplSource、tmplId必有一个，data、dataSource必有一个
     * @param container   显示注入数据的容器#id，或者不写，如果不写，则必须在模板的script标签增加data-replace="container"、data-after="container"、data-before="container"，以注明要在哪个容器替换或者添加注入的数据
     * @param tmpl        模板的html片段，包含script本身，若不包含script，则必须指明container
     * @param tmplSource  能够请求道模板文件的url地址
     * @param tmplId      模板的id
     * @param data        要注入的json数据，支持自定义表达式如${data.list}，但是如果是自定义表达式则必须为字符串
     * @param dataSource  能够请求道要注入的json数据的url地址
     * @param type        注入的类型，在显示注入的容器中是直接覆盖（replace）、尾部追加（after）还是顶部追加（before）数据
     * @param callback    回调函数，当找不到container的时候最终渲染后的html片段会通过callbacl传回 
     * */
    A.render = function(opts){
    	var options = {
    			container : null,
    			tmpl : null,
    			tmplSource : null,
    			tmplId : null,
    			data : null,
    			dataSource : null,
    			type : 'after',//replace|after|before
    			callback : function(){}
    			
    	};    	
    	$.extend(options,opts);
    	
    	var handleHTML = function(opts,callback){
    		
    		if(opts.tmpl){
    			callback(opts.tmpl);
    		}else{
    			var url = opts.tmplId||opts.tmplSource;
    			if(!url){
    				callback('');
    				return;
    			}
    			var html = '';
    			var hashObj = A.Util.parseHash(url);
        		var $script = $(hashObj.tag);
        		var scriptKey = '__TEMPLATE_'+hashObj.tag+'__';
        		if(A.cache[scriptKey]){
        			callback(A.cache[scriptKey]);
        		}else if($script.length==0){       			
                	A.Page.loadContent(hashObj,function(h){
                		html = h||'';
                		callback(html);
                		A.cache[scriptKey] = html;
                	});                	
                }else if($script.html().trim()==''&&$script.attr('src')){
                	A.Page.loadContent($script.attr('src'),function(h){
                		html = h||'';
                		$script.text(html);
                		callback($script);
                		A.cache[scriptKey] = $script;
                	});
                }else{     
                	html = $script;
                	callback(html);
                	A.cache[scriptKey] = html;
                }
    		}
    	};
    	
    	var handleData = function(opts,callback){
    		if(opts.data){
    			callback(typeof opts.data=='string'?A.Util.eval(opts.data):opts.data);
    		}else if(opts.dataSource){   	
    			var hashObj = A.Util.parseHash(opts.dataSource);
    			A.Page.loadContent(hashObj,function(data){   
            		data = A.Util.formatJSON(data);
            		callback(data);
            	});
    		}else{
    			callback({});
    		}
    	};
    	
    	handleHTML(options, function(html){
    		var $target,type = options.type||'after'; 
    		var $html = $(html);
    		if(!$html.is('script')){
    			options.container = $html;
    			$html = $('<script type="text/html"></script>').append($html.html()); 	
    		}
    		var typeMap = {
    				replace : 'html' ,
    				after : 'append',
    				before : 'prepend'
    		};
    		if(options.container&&options.container.length>0){
    			var $target = $(options.container);
    		}else{
    			for(var k in typeMap){
    				var container = $html.data(k);
        			if(container){   				
        				$target = $(container);
        				type = k;
        				break;
        			}
        		}
    		}
    		
    		var _isShowBlock = false;
    		_isShowBlock = A.Util.checkBoolean($html.data('loading')||_isShowBlock);
    		if(_isShowBlock) A.showMask();
    		handleData(options, function(o){
    			if(!o||o=={}||o==[]){
    				options.callback('', null);
    				return;
    			}
    			try{
    				html = $(template.compile($html.html())(o));
    			}catch(e){
    				html = '';
    			}
    			if($target&&$target.length>0){    	
    				$target[typeMap[type]](html);
    				A.Element.init(html);
    			}
    			options.callback(html, o);
    			if(_isShowBlock) A.hideMask();
    		});
    	});
    	
    };
    
})(A.$);
/**
 * 弹出框组件
 */
A.Popup = (function($){
    var _popup,_mask,transition,clickMask2close,
        POSITION = {
            'top':{
                top:0,
                left:0,
                right:0
            },
            'top-second':{
                top:'44px',
                left:0,
                right:0
            },
            'center':{
                top:'50%',
                left:'5%',
                right:'5%',
                'border-radius' : '3px'
            },
            'bottom' : {
                bottom:0,
                left:0,
                right:0
            },
            'bottom-second':{
                bottom : '51px',
                left:0,
                right:0
            }
        },
        ANIM = {
            top : ['slideDownIn','slideUpOut'],
            bottom : ['slideUpIn','slideDownOut'],
            defaultAnim : ['bounceIn','bounceOut']
        },
        TEMPLATE = {
            alert : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a data-target="closePopup" class="agile-icon agile-popup-alert-ok">{ok}</a></div>',
            confirm : '<div class="popup-title">{title}</div><div class="popup-content">{content}</div><div id="popup_btn_container"><a class="cancel agile-icon agile-popup-alert-cancel">{cancel}</a><a class="agile-icon agile-popup-alert-ok">{ok}</a></div>',
            loading : '<i class="agile-icon agile-popup-spinner spinner"></i><p>{title}</p>'
        };

    /**
     * 全局只有一个popup实例
     * @private
     */
    var _init = function(){
        $('body').append('<div id="agile_popup"></div><div id="agile_popup_mask"></div>');
        _mask = $('#agile_popup_mask');
        _popup = $('#agile_popup');
        _subscribeEvents();
    };

    var show = function(options){
        var settings = {
            height : undefined,//高度
            width : undefined,//宽度
            opacity : 0.3,//透明度
            url : null,//远程加载url
            tplId : null,//加载模板ID
            tplData : {},//模板数据，配合tplId使用
            html : '',//popup内容
            pos : 'center',//位置 {@String top|top-second|center|bottom|bottom-second}   {@object  css样式}
            clickMask2Close : true,// 是否点击外层遮罩关闭popup
            showCloseBtn : true,// 是否显示关闭按钮
            arrowDirection : undefined,//popover的箭头指向
            animation : true,//是否显示动画
            timingFunc : 'linear',
            duration : 200,//动画执行时间
            onShow : undefined, //@event 在popup内容加载完毕，动画开始前触发
            onHide : undefined, //@event 在popup隐藏后触发
            onClose : undefined //@event 在popup被手动关闭后触发
        };
        $.extend(settings,options);
        clickMask2close = settings.clickMask2Close;
        _mask.css('opacity',settings.opacity);
        //rest position and class
        _popup.attr({'style':'','class':''});
        settings.width && _popup.width(settings.width);
        settings.height && _popup.height(settings.height);
        var pos_type = $.type(settings.pos);
        if(pos_type == 'object'){// style
            _popup.css(settings.pos);
            transition = ANIM['defaultAnim'];
        }else if(pos_type == 'string'){
            if(POSITION[settings.pos]){ //已经默认的样式
                _popup.css(POSITION[settings.pos]);
                var trans_key = settings.pos.indexOf('top')>-1?'top':(settings.pos.indexOf('bottom')>-1?'bottom':'defaultAnim');
                transition = ANIM[trans_key];
            }else{// pos 为 class
                _popup.addClass(settings.pos);
                transition = ANIM['defaultAnim'];
            }
        }else{
            return;
        }
        _mask.show();
        var html;
        if(settings.html){
            html = settings.html;
        }else if(settings.url){//远程加载
            html = A.Page.loadContent(settings.url);
        }else if(settings.tplId){//加载模板       	
            html = template(settings.tplId,settings.tplData);          
        }

        //是否显示关闭按钮
        if(settings.showCloseBtn){
            html += '<div id="tag_close_popup" data-target="closePopup" class="agile-icon agile-popup-close"></div>';
        }
        //popover 箭头方向
        if(settings.arrowDirection){
            _popup.addClass('arrow '+settings.arrowDirection);
            _popup.css('padding','8px');
            if(settings.arrowDirection=='top'||settings.arrowDirection=='bottom'){
                transition = ANIM[settings.arrowDirection];
            }
        }

        _popup.html(html).show();
        A.Element.init(_popup);
        //执行onShow事件，可以动态添加内容
        settings.onShow && settings.onShow.call(_popup);
        $(document).trigger('popupshow', [_popup]);
        settings.onHide && $(document).on('popuphide',function(){
        	settings.onHide();
        	settings.onHide = undefined;
        });
        settings.onClose && $(document).on('popupclose',function(){
        	settings.onClose();
        	settings.onClose = undefined;
        });
        //显示获取容器高度，调整至垂直居中
        if(settings.pos == 'center'){
            var height = _popup.height();
            _popup.css('margin-top','-'+height/2+'px');
        }
        if(settings.animation){
            A.anim(_popup,transition[0],settings.duration,settings.timingFunc);
        }
        A.hasPopupOpen = true;
    };

    /**
     * 关闭弹出框
     * @param noTransition 立即关闭，无动画
     */
    var hide = function(noTransition){
        _mask.hide();
        if(transition && !noTransition){
            A.anim(_popup,transition[1],200,function(){
                _popup.hide().empty();
                A.hasPopupOpen = false;
            });
        }else{
            _popup.hide().empty();
            A.hasPopupOpen = false;
        }
        $(document).trigger('popuphide');
    };
    var _subscribeEvents = function(){
    	var closePopup = function(){
    		hide();
    		$(document).trigger('popupclose');
    	}
    	
        _mask.on('tap',function(){
            clickMask2close &&  closePopup();
        });
        _popup.on('tap','[data-target="closePopup"]',function(){closePopup();});
    };
    /**
     * alert组件
     * @param title 标题
     * @param content 内容
     */
    var alert = function(title,content,btnName){
        var markup = TEMPLATE.alert.replace('{title}',title).replace('{content}',content).replace('{ok}',btnName || '确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
    };

    /**
     * confirm 组件
     * @param title 标题
     * @param content 内容
     * @param okCall 确定按钮handler
     * @param cancelCall 取消按钮handler
     */
    var confirm = function(title,content,okCall,cancelCall){
        var markup = TEMPLATE.confirm.replace('{title}',title).replace('{content}',content).replace('{cancel}','取消').replace('{ok}','确定');
        show({
            html : markup,
            pos : 'center',
            clickMask2Close : false,
            showCloseBtn : false
        });
        $('#popup_btn_container .agile-popup-alert-ok').tap(function(){
            hide();
            okCall.call(this);
        });
        $('#popup_btn_container .agile-popup-alert-cancel').tap(function(){
            hide();
            cancelCall.call(this);
        });
    };

    /**
     * 带箭头的弹出框
     * @param html 弹出框内容
     * @param pos 位置
     * @param arrow_direction 箭头方向
     * @param onShow onShow事件
     */
    var popover = function(html,pos,arrow_direction,onShow){
        show({
            html : html,
            pos : pos,
            showCloseBtn : false,
            arrowDirection : arrow_direction,
            onShow : onShow
        });
    };

    /**
     * loading组件
     * @param text 文本，默认为“加载中...”
     * @param closeCallback 函数，当loading被人为关闭的时候的触发事件
     */
    var loading = function(text,closeCallback){
        var markup = TEMPLATE.loading.replace('{title}',text||'加载中...');
        show({
            html : markup,
            pos : 'loading',
            opacity :.1,
            animation : true,
            clickMask2Close : false,
            onClose : closeCallback
        });
    };

    /**
     * actionsheet组件
     * @param buttons 按钮集合
     * [{color:'red',text:'btn',handler:function(){}},{color:'red',text:'btn',handler:function(){}}]
     */
    var actionsheet = function(buttons,showCancel){
        var markup = '<div class="actionsheet">';
        var defaultCalssName = "button block agile-popup-actionsheet-normal";
        var defaultCancelCalssName = "button block agile-popup-actionsheet-cancel";
        showCancel = showCancel==false?false:true;
        
        $.each(buttons,function(i,n){
            markup += '<button class="'+(n.css||defaultCalssName)+'">'+ n.text +'</button>';
        });
        if(showCancel==true) markup += '<button class="'+defaultCancelCalssName+'">取消</button>';
        markup += '</div>';
        show({
            html : markup,
            pos : 'bottom',
            showCloseBtn : false,
            onShow : function(){
                $(this).find('button').each(function(i,button){
                    $(button).on('tap',function(){
                        if(buttons[i] && buttons[i].handler){
                            buttons[i].handler.call(button);
                        }
                        hide();
                    });
                });
            }
        });
    };

    _init();

    return {
        show : show,
        close : hide,
        alert : alert,
        confirm : confirm,
        popover : popover,
        loading : loading,
        actionsheet : actionsheet
    };
})(A.$);


/**
 * 日历组件
 * @param selector selector
 * @param options 配置参数
 */
(function($){
    var calendar = function(selector,options){
        var defaults = {
                months : ["01月", "02月", "03月", "04月", "05月", "06月",
                    "07月", "08月", "09月", "10月", "11月", "12月"],
                days : ["日", "一", "二", "三", "四", "五", "六"],
                swipeable : true,//是否可通过手指滑动
                date : new Date(),//日历当前日期
                onRenderDay : undefined,//渲染单元格时的事件
                onSelect : undefined //选中日期时的事件
            },
            _this = this,
            $el = $(selector),
            $yearText,
            $monthText,
            $calendarBody,
            currentDate,currentYear,currentMonth;

        var _init = function(){
            _this.settings = $.extend({},defaults,options);
            currentYear = _this.settings.date.getFullYear();
            currentMonth = _this.settings.date.getMonth();
            currentDate = new Date(currentYear,currentMonth,_this.settings.date.getDate());
            _render();
            _subscribeEvents();
        };

        /**
         * 获取月份第一天是星期几[0-6]
         */
        var _fisrtDayOfMonth = function(date){
            return ( new Date(date.getFullYear(), date.getMonth(), 1) ).getDay();
        };
        /**
         * 获取月份总天数[1-31]
         */
        var _daysInMonth = function(date){
            return ( new Date(date.getFullYear(),date.getMonth()+1,0) ).getDate();
        };

        /**
         * 渲染日历
         * @private
         */
        var _render = function(){
            var html = '';
            html += '<div class="agile-calendar">';
            html += _renderNav(currentYear,currentMonth);
            html += _renderHead();
            html += '<div class="agile-calendar-body">';
            html += _renderBody(currentDate);
            html += '</div></div>';
            $el.html(html);
            var $span = $el.find('span');
            $yearText = $span.eq(0);
            $monthText = $span.eq(1);
            $calendarBody = $el.find('.agile-calendar-body');
        };

        var _renderNav = function(year,month){
            var html = '<div class="agile-calendar-nav">';
            html += '<div><i class="agile-icon agile-calendar-pre __previous" data-year='+year+'></i><span>'+year+'</span><i class="agile-icon agile-calendar-next __next" data-year='+year+'></i></div>';
            html += '<div><i class="agile-icon agile-calendar-pre __previous" data-month='+month+'></i> <span>'+_this.settings.months[month]+'</span><i class="agile-icon agile-calendar-next __next" data-month='+month+'></i></div>';
            html += '</div>';

            return html;l
        };

        var _renderHead = function(){
            var html = '<table><thead><tr>';
            for(var i = 0; i < 7; i++){
                html += '<th>'+_this.settings.days[i]+'</th>';
            }
            html += '</tr></thead></table>';
            return html;
        };

        var _renderBody = function(date){
            var firstDay = _fisrtDayOfMonth(date),
                days = _daysInMonth(date),
                rows = Math.ceil((firstDay+days) / 7),
                beginDate,
                html = '';
            currentYear = date.getFullYear();
            currentMonth = date.getMonth();
            beginDate = new Date(currentYear,currentMonth,1-firstDay);//日历开始的日期
            html += '<table><tbody>';
            for(var i = 0; i < rows; i++){
                html += '<tr>';
                for(var j = 0; j < 7; j++){
                    html += _renderDay(beginDate,currentMonth);
                    beginDate.setDate(beginDate.getDate() + 1);
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        };
        var _renderDay = function(date,month){
            var otherMonth = (date.getMonth() !== month);
            var dateStr = _this.format(date);
            var classname = (_this.format(_this.settings.date) == dateStr) ? 'active':'';
            var dayStr = date.getDate();
            if(_this.settings.onRenderDay){
                dayStr = _this.settings.onRenderDay.call(null,dayStr,dateStr);
            }
            return otherMonth ? '<td>&nbsp;</td>' : '<td data-selected="selected" class="'+classname+ '" data-date= '+dateStr+'>'+dayStr+'</td>';
        };

        var _subscribeEvents = function(){
            var $target,$ctarget;
            $el.on('tap',function(e){
            	
                $target = $(e.target);
                if($target.is('[data-year].__next')){
                    //后一年
                    currentDate.setFullYear(currentDate.getFullYear()+1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-year].__previous')){
                    //前一年
                    currentDate.setFullYear(currentDate.getFullYear()-1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-month].__next')){
                    //后一月
                    currentDate.setMonth(currentDate.getMonth()+1);
                    _this.refresh(currentDate);
                }else if($target.is('[data-month].__previous')){
                    //前一月
                    currentDate.setMonth(currentDate.getMonth()-1);
                    _this.refresh(currentDate);
                }
                $ctarget = $target.closest('td');
                if(!$target.is('td') && $ctarget.length > 0){
                    $target = $ctarget;
                }
                if($target.is('td')){
                    var dateStr = $target.data('date');
                    if(dateStr && _this.settings.onSelect){
                        _this.settings.onSelect.call($target[0],dateStr);
                    }
                }

            });
            $el.on('swipeLeft',function(){
                currentDate.setMonth(currentDate.getMonth()+1);
                _this.refresh(currentDate);
            });
            $el.on('swipeRight',function(){
                currentDate.setMonth(currentDate.getMonth()-1);
                _this.refresh(currentDate);
            });
        };

        /**
         * 刷新日历为指定日期
         * @param date 指定日期
         */
        this.refresh = function(date){
            var oldDate = new Date(currentYear,currentMonth,1),
                newDate = new Date(date.getFullYear(),date.getMonth(),1),
                transition = undefined,$table;

            if(oldDate.getTime() == newDate.getTime())return;
            transition = oldDate<newDate ? 'slideLeftRound' : 'slideRightRound';

            $yearText.text(date.getFullYear());
            $monthText.text(this.settings.months[date.getMonth()]);
            var newbody = _renderBody(date);
            A.anim($calendarBody,transition,function(){
                $calendarBody.html(newbody);
            });

        };
        _init();
    };
    /**
     * 字符串转化为日期对象，只支持yyyy-MM-dd 和 yyyy/MM/dd
     * @param date
     * @return {*}
     */
    calendar.prototype.parse = function(date){
        var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
        return dateRE.test(date) ? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)) : null;
    };
    /**
     * 格式化日期  yyyy-MM-dd
     * @return {String}
     */
    calendar.prototype.format = function(date){
        var y  = date.getFullYear(),m = date.getMonth()+1,d = date.getDate();
        m = (m<10)?('0'+m):m;
        d = (d<10)?('0'+d):d;
        return y + '-' + m + '-' + d;
    };
    A.Calendar = calendar;
})(A.$);
/**
 *  滚动组件(iscroll)
 */
(function($){
    var scrollCache = {},index = 1;
    A.Scroll = function(selector,opts){
        var scroll,scrollId,$el = $(selector),
            options = {
               hScroll : false,
               bounce : true,
               lockDirection : true,
               useTransform: true,
               useTransition: false,
               checkDOMChanges: true,
               hideScrollbar: true,
               fadeScrollbar: true,
               zoom: false,
               scrollbarClass: 'agile-scrollbar',
               onBeforeScrollStart: function (e) {   	   
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                        e.preventDefault();
               },
               onRefreshEnd: function(){           	   
                   	var _focusObj = $el.find(':focus');
                   	if(_focusObj.length>0){
                   		//scroller.scrollToElement(_focusObj[0],0);
                   		var elTop = _focusObj.offset().top;
                   		var wHeight = $(window).height();
                   		if(elTop>wHeight) scroller.scrollTo(0,elTop-wHeight/2,0,true);
                   	}      
                   	   	
               }
            };
        scrollId = $el.data('_jscroll_');
        //滚动组件使用频繁，缓存起来节省开销
        if(scrollId && scrollCache[scrollId]){
            scroll = scrollCache[scrollId];
            $.extend(scroll.scroller.options,opts);
            scroll.scroller.refresh();
            return scroll;
        }else{
            scrollId = '_jscroll_'+index++;
            $el.data('_jscroll_',scrollId);
            $.extend(options,opts);
            scroller = new iScroll($el[0],options);
            return scrollCache[scrollId] = {
                scroller : scroller,
                destroy : function(){
                    scroller.destroy();
                    delete scrollCache[scrollId];
                }
            };
        };
    };
})(A.$);


/**
 * 幻灯片组件
 */
(function($){
    function slider(selector,showDots){
        var afterSlide = function(){},
            beforeSlide = function(){return true;},
            gestureStarted = false,
            index = 0,
            speed = 200,
            wrapper,
            dots,
            container,
            slides,
            slideNum,
            slideWidth,
            deltaX,
            autoPlay,
            interval = 0;
        var _this = this;
        
        var sliderRole = "",$sliderLabel;

        if($.isPlainObject(selector)){
            wrapper = $(selector.selector);
            showDots = selector.showDots;
            beforeSlide = selector.onBeforeSlide || beforeSlide;
            afterSlide = selector.onAfterSlide || afterSlide;
            autoPlay = selector.autoPlay;
            interval = selector.interval || 3000;
            speed = selector.speed||speed;
            container = selector.container;
            slides = selector.slides;
        }else{
            wrapper = $(selector);
        }
        
        if(wrapper.data("role")=="banner") sliderRole = "banner";
        
        var _flush = this.flush = function(opts) {
        	opts = opts||{};
        	slides = opts.slides;
            slideNum = slides.length;           
            container.css('width',slideNum * slideWidth).attr('__is_slider__', true);
            slides.css({
                    'width':slideWidth,
                    'float':'left'
            }).show();
        	
        };
        
        /**
         * 初始化容器大小
         */
        var _init = function(opts) {
        	opts = opts||{};
            container = container?container:wrapper.children().first();
            slideWidth = wrapper.offset().width;
            _flush({
            	slides : slides?slides:container.children()
            });
            
            if(showDots == undefined)showDots = true;
            showDots && _initDots();
            _init_slider_label();
            _slide(0, 0);
            afterSlide(0);
            autoPlay && _autoPlay();           
        };
        
        var _init_slider_label = function(){
        	if(sliderRole=="banner"){
        		wrapper.find('.slider_label').remove();
        		$sliderLabel = wrapper.append('<div class="slider_label"></div>').find('.slider_label');
            }
        };
        
        var _set_slider_label = function(index){
        	index = arguments.length==0?0:index;
        	if($sliderLabel) $sliderLabel.html($(slides.get(index)).find('[data-title]').data('title'));
        };

        var _autoPlay = function(){
            setTimeout(function(){
                if(index == slideNum - 1){
                    _slide(0);
                }else{
                    _this.next();
                }
                _autoPlay();
            },interval);
        };

        var _initDots = function(){
            dots = wrapper.find('.dots');
            if(dots.length>0){
                dots.show();
            }else{
                var dotsWidth = slideNum*20;
                var html = '<div class="dots"><ul>';
                for(var i=0;i<slideNum;i++){
                    html +='<li index="'+i+'"';
                    if(i == 0){
                        html += 'class="active"';
                    }
                    html += '><a href="#"></a></li>';
                }
                html += '</ul></div>';
                wrapper.append(html);
                dots = wrapper.find('.dots');
                dots.children().css('width',dotsWidth+'px');
                dots.find('li').on('tap',function(){
                    var index = $(this).attr('index');
                    _slide(parseInt(index), speed);
                });
            }
        };

        /**
         * 滑动到指定卡片
         * @param i
         * @param duration
         * @private
         */
        var _slide = function(i, duration) {
            duration = duration || speed;
            container.css({
                '-webkit-transition-duration':duration + 'ms',
                '-webkit-transform':'translate3D(' + -(i * slideWidth) + 'px,0,0)'
            });
            if(index != i){
                index = i;
                if(dots) $(dots.find('li').get(index)).addClass('active').siblings().removeClass('active');
                _set_slider_label(index);
                afterSlide(index);  
            }else{
            	_set_slider_label(index);
            }          
        };

        /**
         * 绑定滑动事件
         */
        var _bindEvents = function() {
            container.on('touchstart',_touchStart,false);
            container.on('touchmove',_touchMove,false);
            container.on('touchend',_touchEnd,false);
        };

        var  _touchStart = function(event) {
            var e = event.touches[0];
            start = {
                pageX: e.pageX,
                pageY: e.pageY,
                time: Number(new Date())
            };
            isScrolling = undefined;
            deltaX = 0;
            container[0].style.webkitTransitionDuration = 0;
            gestureStarted = true;
            if($(event.target).closest('[__is_slider__]')[0]==container[0]){
            	gestureStarted = true;
            }else{
            	gestureStarted = false;
            }
        };

        var _touchMove = function(event) {
            if(!gestureStarted)return;
            var e = event.touches[0];
            deltaX = e.pageX - start.pageX;
            if ( typeof isScrolling == 'undefined') {
                //根据X、Y轴的偏移量判断用户的意图是左右滑动还是上下滑动
                isScrolling = Math.abs(deltaX) < Math.abs(e.pageY - start.pageY);
            }
            if (!isScrolling) {
                event.preventDefault();
                //判定是否达到了边界即第一个右滑、最后一个左滑
                var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
                if(isPastBounds)return;
                var pos = (deltaX - index * slideWidth);
                container[0].style.webkitTransform = 'translate3D('+pos+'px,0,0)';
            }
        };

        var _touchEnd = function(e) {
            //判定是否跳转到下一个卡片
            //滑动时间小于250ms或者滑动X轴的距离大于屏幕宽度的1/3，则直接跳转到下一个卡片
            var isValidSlide = (Number(new Date()) - start.time < 250 && Math.abs(deltaX) > 20) || Math.abs(deltaX) > slideWidth/3;
                //判定是否达到了边界即第一个右滑、最后一个左滑
            var isPastBounds = !index && deltaX > 0 || index == slideNum - 1 && deltaX < 0;
            if (!isScrolling) {
                if(beforeSlide(index,deltaX)){
                    _slide( index + ( isValidSlide && !isPastBounds ? (deltaX < 0 ? 1 : -1) : 0 ), speed );
                }else{
                    _slide(index);
                }
            }
            gestureStarted = false;
        };
        
        _init();
        _bindEvents();

        this.refresh = function(){
            container.attr('style','');
            _init(opts);
        };

        this.prev = function() {
            if (index) _slide(index-1, speed);
        };

        this.next = function() {
            if(index < slideNum-1){
                _slide(index+1, speed);
            }
        };
        this.index = function(i) {
        	if(arguments.length==0){
        		return index;
        	}else{
        		_slide(i);
        	} 
        };
    }
    A.Slider = slider;
})(A.$);
/**
 * 上拉/下拉组件
 */
(function($){
    var refreshCache = {},index = 1;
    function Refresh(selector,type,callback){
        var iscroll, scroller,refreshEl,iconEl,labelEl,topOffset,isPullDown,
            options = {
                selector : undefined,
                type : 'pullDown',//pullDown|pullUp 默认为pullDown
                minPullHeight : 10,//拉动的像素相对值，超过才会翻转
                pullText: '下拉刷新更多',
                releaseText: '松开加载更新',
                refreshText: '加载中请稍后',
                refreshTip : false,//下拉时显示的文本，比如：最后更新时间:2014-....
                onPullIcon : 'agile-icon agile-refresh-down-icon',
                onReleaseIcon  : 'agile-refresh-icon-reverse',
                onRefreshIcon : 'agile-refresh-spinner spinner',
                callback : undefined
            };
        //装载配置
        if(typeof selector === 'object'){
            $.extend(options,selector);
        }else{
            options.selector = selector;
            options.type = type;
            options.callback = callback;
            if(type === 'pullUp'){
                $.extend(options,{
                    pullText: '上拉加载更多',
                    releaseText: '松开加载更新',
                    refreshText: '加载中请稍后',
                    onPullIcon : 'agile-icon agile-refresh-up-icon',
                });
            }
        }
        isPullDown = options.type === 'pullDown' ? true : false;

        /**
         * 初始化dom节点
         * @param opts
         * @private
         */
        var _init = function(opts){
            scroller = $(opts.selector).children()[0];
            var refreshTpl = '<div class="agile-refresh-container"><span class="agile-refresh-icon '+opts.onPullIcon
                +'"></span><span class="agile-refresh-label">'
                +opts.pullText+'</span>'
                +(opts.refreshTip?'<div class="agile-refresh-tip">'+opts.refreshTip+'</div>':'')+'</div>';
            if(isPullDown){
                refreshEl = $(refreshTpl).prependTo(scroller);
            }else{
                refreshEl = $(refreshTpl).appendTo(scroller);
            }
            topOffset = refreshEl.height();
            iconEl = refreshEl.find('.agile-refresh-icon');
            labelEl = refreshEl.find('.agile-refresh-label');
        };

        /**
         * 构造iscroll组件，并绑定滑动事件
         * @param opts
         * @private
         */
        var _excuteScroll = function(opts){
            return A.Scroll(opts.selector,{
                    topOffset:isPullDown?topOffset:0,
                    bounce : true,
                    onScrollMove : function(){
                    	
                        if(!isPullDown&&this.y>=0){
                        	//do something
                        }else if (this.y > opts.minPullHeight && isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.addClass(opts.onReleaseIcon);
                            labelEl.html(opts.releaseText);
                            this.minScrollY = 0;
                        } else if (this.y < opts.minPullHeight && isPullDown && iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.removeClass(opts.onReleaseIcon);
                            labelEl.html(opts.pullText);
                            this.minScrollY = -topOffset;
                        }else if (this.y < (this.maxScrollY - opts.minPullHeight) && !isPullDown && !iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.addClass(opts.onReleaseIcon);
                            labelEl.html(opts.releaseText);
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + opts.minPullHeight) && !isPullDown && iconEl.hasClass(opts.onReleaseIcon)) {
                            iconEl.removeClass(opts.onReleaseIcon);
                            labelEl.html(opts.pullText);
                            this.maxScrollY = topOffset;
                        }
                    },
                    onScrollEnd : function(){
                        if(iconEl.hasClass(opts.onReleaseIcon)){
                            iconEl.removeClass(opts.onReleaseIcon).removeClass(opts.onPullIcon).addClass(opts.onRefreshIcon);
                            labelEl.html(opts.refreshText);
                            var _this = this;
                            setTimeout(function(){//解决在chrome下onRefresh的时候文本无法更改的问题。奇怪的问题！
                                opts.callback.call(_this);
                            },1);
                        }
                        A.Element.initLazyload($(opts.selector));
                    },
                    onRefresh: function () {
                        iconEl.removeClass(opts.onRefreshIcon).addClass(opts.onPullIcon);
                        labelEl.html(opts.pullText);
                    }
                });
        };

        //run
        _init(options);
        iscroll = _excuteScroll(options);
        return iscroll;

    }

    /**
     * 刷新组件
     * @param selector selector
     * @param type 类型 pullDown(下拉) pullUp(上拉)
     * @param callback 回调函数
     */
    A.Refresh = function(selector,type,callback){
        var el,refreshId;
        if(selector.selector){
            el = $(selector.selector);
        }else{
            el = $(selector);
        }
        refreshId = el.data('_refresh_');
        //因上拉下拉可能会使用的比较频繁，故缓存起来节省开销,亦可防止重复绑定
        if(refreshId && refreshCache[refreshId]){
            return refreshCache[refreshId];
        }else{
            refreshId = '_refresh_'+index++;
            el.data('_refresh_',refreshId);
            var refresh = new Refresh(selector,type,callback);
            return refreshCache[refreshId] = {
                scroller : refresh.scroller,
                destroy : function(){
                    delete refreshCache[refreshId];
                    refresh.scroller.destroy();
                    $('.refresh-container',selector).remove();
                }
            };
        }
    };
})(A.$);

/**
 * 扩展$的注入
 */
(function ($) {
	/*
     * 数据注入对象扩展
     * @param data        要注入的json数据，支持自定义表达式如${data.list}，但是如果是自定义表达式则必须为字符串
     * @param dataSource  能够请求道要注入的json数据的url地址
     * @param type        注入的类型，在显示注入的容器中是直接覆盖（replace）还是追加（add）数据
     * @param callback    回调函数
     * */
	$.fn.render = function (opts) {
		var $el = $(this);		
		if(!$el.data('inject')){
			return;
		}
		var options = {
				data : null,
				dataSource : $el.data('source')
		};
		$.extend(options, opts);
		delete options.container;
		
		if(!(options.data||options.dataSource)) return;
		
		var tag = '#'+$el.attr('id');
		
		options.tmplId = tag;
		options.callback = function(html, o){	
			var $referObj = $el;
			var $oldObj = $('[__inject_dependence__="'+tag+'"]');
			if(options.type=='replace'){
				$('[__inject_dependence__="'+tag+'"]').remove();
				//$referObj = $el;
			}else if(options.type=='after'){
				$referObj = $oldObj.length==0?$el:$oldObj.last();
			}else if(options.type=='before'){
				//$referObj = $el;
			}
			$el.attr('__inject_cache__',true);
			$referObj.after($(html).attr('__inject_dependence__',tag));
			A.Element.init($el.parent());
			if(opts&&opts.callback){			
				opts.callback(html, o);
			}
		};
  	
    	A.render(options);
	};

	$.fn.renderReplace = function (data, callback) {
		_render(this, 'replace', data, callback);
	};
	$.fn.renderAfter = function (data, callback) {
		_render(this, 'after', data, callback);
	};
	$.fn.renderBefore = function (data, callback) {
		_render(this, 'before', data, callback);
	};

	function _render(el, type, data, callback){
		if(typeof data=='function'&&callback==null){
			callback = data;
			data = null;			
		}
		var opts = {};
		opts.type = type;
		if(typeof data=='string'){
			opts.dataSource = data;
		}else if(typeof data=='object'){
			opts.data = data;
		}
		opts.callback = callback;
		$(el).render(opts);
	}
})(A.$);
/*
 * 扩展JSON
 * */
var aJSON = (function(){
	var JSON = {};

	JSON.parse = function(str){
		try{
			return eval("("+str+")");
		}catch(e){
			return null;
		}
	}


	JSON.stringify = function(o){
		var r = [];   
		if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";   
		if(typeof o =="undefined") return "";
		if(typeof o != "object") return o.toString();
		if(o===null) return null;
		if(o instanceof Array){
			for(var i =0;i<o.length;i++){
		        r.push(this.stringify(o[i]));
		    }
		    r="["+r.join()+"]"; 
		}else{              
			for(var i in o){
			   r.push('"'+i+'":'+this.stringify(o[i]));
		    }
		    r="{"+r.join()+"}";
		}   
		return r; 
	};
	window.JSON = JSON;
	return JSON;
})();