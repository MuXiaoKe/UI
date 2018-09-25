/*
幻灯片
 */
 /*
*  初始化-》slide函数对象 -》函数init方法 -》构建build方法
*  -》开始 play方法 -》 停止 stop方法 -》轮转过程goto方法
 */ 

(function($){
    $.zhSlide = function(){

        var zhSlide ={
            dom:{},
            api:{}
        };

        //初始化
        zhSlide.init = function(){

            var self = this,
                _callback,_settings;//定义内部回调和配置变量

            var _isElement = function(o){
                if( o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object' ) && o instanceof HTMLElement ){
                    return true;
                } else {
                    return ( o && o.nodeType && o.nodeType === 1 ) ? true : false ;
                } 
            }    

            var _isJquery = function(o){
                return (o && o.length && (typeof jQuery === 'function' || jQuery ==='object' ) && o instanceof jQuery ) ? true : false ;
            }

            //参数的分配
            for (var i = 0, l = arguments.length; i <l; i++) {
                if( _isJquery(arguments[i]) ){
                    self.dom.el = arguments[i];
                } else if( _isElement(arguments[i]) ){
                    self.dom.el = $(arguments[i]);
                } else if( typeof arguments[i] === 'function' ){
                    _callback = arguments[i];
                } else if( typeof arguments[i] === 'object' ){
                    _settings = arguments[i];
                }
            }

            if (!self.dom.el.length) { return; }
            //合并配置
            self.settings = $.extend({}, $.zhSlide.defaults,_settings);
            //开始dom构建
            self.build();
            //扩展api方法
            self.api = {
                play: function(){
                    self.settings.auto = true;
                    self.paly();
                },
                stop: function(){
                    self.settings.auto = false;
                    self.stop();
                },
                goto: function(){
                    self.goto.apply(self,arguments);
                },
                prev: function(){
                    self.goto(self.now - 1);
                },
                next: function(){
                    self.goto();
                }
            }

            if( typeof _callback === 'function' ){
                _callback(self.api);
            }

        }
        //构建dom
        zhSlide.build = function(){
            var self = this;
            var _html;
            var _dom = self.dom;
            //容器el下第一层包裹
            self.dom.box = self.dom.el.find('.box');
            //ul列表
            self.dom.list = self.dom .box.find('.list');

            self.dom.items = self.dom.list.find('li');
            //长度
            self.itemSum = selft.dom.items.length;
            //el的class属性
            self.baseClass = self.dom.el.attr('class');

            if( self.itemSum <1 ){ return};

            _dom.numList = _dom.el.find('.btn');
            _dom.numBtns = _dom.numList.find('li');
            _dom.prevBtn = _dom.el.find('.prev');
            _dom.nextBtn = _dom.el.find('.next');
            self.boxWidth = _dom.box.width();
            self.boxHeight = _dom.box.height();
            self.now = 0;
            //数字列表按钮
            if( self.settings.btn && !self.dom.numList.length){
                _html='';
                for (var i = 1; i <= self.itemSum; i++) {
                    _html += '<li class="b_' + i + '">' + i + '</li>';
                };
                _dom.numList = $('<ul></ul>',{'class':'btn','html':_html}).appendTo(_dom.el);
                _dom.numBtns = _dom.numList.find('li');

            }
            //左右切换按钮
            if (self.settings.prev && !self.dom.prevBtn.length) {
                self.dom.prevBtn = $('<div></div>', {'class': 'prev'}).appendTo(self.dom.el);
            };
            if (self.settings.next && !self.dom.nextBtn.length) {
                self.dom.nextBtn = $('<div></div>', {'class': 'next'}).appendTo(self.dom.el);
            };
            //序号按钮的点击
            if( self.settings.btn ){
                _dom.numList.on(self.settings.events,'li', function(){
                    self.goto($(this).index());
                })
            }
            //左右切换按钮的点击
            if( self.settings.prev ){
                _dom.prevBtn.on(self.settings.events, function(){
                    self.goto(self.now - 1);
                })
            }
            if( self.settings.next ){
                _dom.nextBtn.on(self.settings.events, function(){
                    self.goto();
                })
            }

            //第一次运行到配置中指定的序号
            self.goto(self.settings.start);

        }
        //开始方法
        zhSlide.play = function(){
            var self = this;
            //不是自动运行则跳出
            if ( !self.settings.auto ) { return };

            self.stop();

            self.run = setTimeout(function(){
                self.goto();
            }, self.settings.time);
        }
        //停止方法
        zhSlide.stop = function(){
            if( typeof( this.run ) !== 'undefined' ){
                cleartimeout(this.run);
            }
        }
        //轮播过渡
        zhSlide.goto = function(n){
            var self = this;
            var _next = typeof(n) ==='undefined' ? self.now + :parseInt(n,10);
            var _now = self.now;
            var _max =self.itemSum -1;
            var _moveVal;

            if( _next >_max ){
                _next = 0;
            } else if(_next<0){
                _next =_max;
            }  

            if(_dom.numList.length){
                _dom.numBtns.removeClass('in out selected');
            }

            self.stop();
            _dom.el.attr('class',self.baseClass + 'to_' + _next);
            //第一次初始化时
            if( _now === _next ){
                _dom.numBtns.eq(_next).addClass('in selected');
                _dom.items.eq(_next).addClass('in');
                self.play();
                return;
            }
            //菲第一次时
            _dom.numBtns.eq(_now).addClass('out').end().eq(_next).addClass('in selected');
            _dom.items.removeClass('in out').eq(_now).addClass('out').end().eq(_next).addClass('in');
            //轮播动画方式
            switch(self.settings.type){
                // 透明过渡
                case 'fade':
                  self.dom.items.css({
                    'display': 'none',
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'zIndex': ''
                  });
                  self.dom.items.eq(_now).css({
                    'display': '',
                    'zIndex': 1
                  });
                  self.dom.items.eq(_next).css({
                    'zIndex': 2
                  }).fadeIn(self.settings.speed);
                  break

                // 直接切换
                case 'toggle':
                  self.dom.items.hide().eq(_next).show();
                  break
                // 水平滚动
                case 'x':
                  _moveVal = self.boxWidth * _next;

                  if (_next === 0 && _now === _max) {
                    self.dom.items.eq(0).css({
                      'left': self.boxWidth * self.itemSum
                    });
                    _moveVal = self.boxWidth * self.itemSum;

                  } else if (_now === 0) {
                    self.dom.items.eq(0).css({
                      'left': ''
                    });
                    self.dom.box.scrollLeft(0);
                  };
                  //stop(true,false) 停止当前动画非立即完成
                  self.dom.box.stop(true, false).animate({
                    'scrollLeft': _moveVal
                  }, self.settings.speed);
                  break
                // 垂直滚动
                case 'y':
                  _moveVal = self.boxHeight * _next;

                  if (_next === 0 && _now === _max) {
                    self.dom.items.eq(0).css({
                      'top': self.boxHeight * self.itemSum
                    });
                    _moveVal = self.boxHeight * self.itemSum;

                  } else if(_now === 0) {
                    self.dom.items.eq(0).css({
                      'top': ''
                    });
                    self.dom.box.scrollTop(0);
                  };

                  self.dom.box.stop(true, false).animate({
                    'scrollTop': _moveVal
                  }, self.settings.speed);
                  break  
            }
            self.now = _next;
            //jquery队列方法 把要执行的方法插入到队列中等待执行
            _dom.box.queue(function(){
                self.play();
                self.dom.box.dequeue();
            })

        }

        zhSlide.init.apply(zhSlide,arguments);

        return this

    }
    //默认配置
    $.zhSlide.defaults = {

        events:'click', //按钮时间类型
        type: 'x',      //过渡方向效果
        start:0,        //开始展示序号
        speed:800,      //切换速度
        time:5000       //切换间隔时间
        auto: true,     //是否自动轮播 
        hoverLock:true, //鼠标移入移出锁定
        btn:true        //是否启动数字按钮
        prev: false,    // 是否使用 plus 按钮
        next: false    // 是否使用 minus 按钮 
    }

    //初始化
    $.fn.zhSlide = function(settings, callback){
        this.each(function(){
            $.zhSlide(this, settings, callback);    
        })
        return this
    }
});