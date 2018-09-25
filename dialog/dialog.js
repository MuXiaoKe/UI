//zh diaolog
(function(win) {
	//默认配置
	var config = {
		type: 0,
		shade: true,
		shadeClose: true,
		fixed: true,
		animate: "scale"
	};
	var dCommon = {
		extend: function(obj) {
			var configcopy = JSON.parse(JSON.stringify(config));
			for (var i in obj) {
				configcopy[i] = obj[i];
			}
			return configcopy;
		},
		timer: {}, //定时器
		end: {} //结束
	};
	var index = 0,
		defaultclass = ["mdialog-layer"],
		Dialog = function(options) {
			this.config = dCommon.extend(options);
			this.render();
		};
	Dialog.prototype.render = function() {
		config = this.config;
		var dialogWrap = document.createElement("div");
		this.id = dialogWrap.id = defaultclass[0] + index;

		dialogWrap.setAttribute(
			"class",
			defaultclass[0] + " " + defaultclass[0] + (dCommon.type || 0)
		);
		dialogWrap.setAttribute("index", index);

		//btn
		var button = (function() {
			if (!config.btn || config.btn.length === 0) {
				return "";
			}
			var btndom = "";
			var i = 0;
			for (i; i < config.btn.length; i++) {
				btndom = btndom + "<span>" + config.btn[i] + "</span>";
			}
			return '<div class="mdialog-layerbtn">' + btndom + "</div>";
		})();

		if (!config.fixed) {
			config.top = config.hasOwnProperty("top") ? config.top : 100;
			config.style = config.style || "";
			config.style +=
				" top:" + (document.body.scrollTop + config.top) + "px";
		}

		if (config.type === 2) {
			config.content =
				'<i></i><i class="layui-m-layerload"></i><i></i><p>' +
				(config.content || "") +
				"</p>";
		}
		if (config.skin) config.anim = "up";
		if (config.skin === "msg") config.shade = false;

		dialogWrap.innerHTML =
			(config.shade
				? "<div " +
				  (typeof config.shade === "string"
						? 'style="' + config.shade + '"'
						: "") +
				  ' class="mdialog-layershade"></div>'
				: "") +
			'<div class="mdialog-layermain" ' +
			(!config.fixed ? 'style="position:static;"' : "") +
			">" +
			'<div class="mdialog-layersection">' +
			'<div class="mdialog-layerchild ' +
			(config.skin ? "mdialog-layer-" + config.skin + " " : "") +
			(config.className ? config.className : "") +
			" " +
			(config.anim ? "mdialog-anim-" + config.anim : "") +
			'" ' +
			(config.style ? 'style="' + config.style + '"' : "") +
			">" +
			(config.title ? "<h3>" + config.title + "</h3>" : "") +
			'<div class="mdialog-layercont">' +
			config.content +
			"</div>" +
			button +
			"</div>" +
			"</div>" +
			"</div>";

		if (!config.type || config.type === 2) {
			var dialogs = document.getElementsByClassName(
				defaultclass[0] + config.type
			);
			var dialoglength = dialogs.length;

			if (dialoglength >= 1) {
				dialog.close(dialogs[0].getAttribute("index"));
			}
		}

		document.body.appendChild(dialogWrap);
		var el = document.querySelectorAll("#" + this.id)[0];
		config.success && config.success(el);

		this.index = index++;
		this.action(config, el);
	};
	Dialog.prototype.action = function(config, el) {
		var that = this;
		// 延迟自动关闭
		if (config.time) {
			dCommon.timer[that.index] = setTimeout(function() {
				dialog.close(that.index);
			}, config.time * 1000);
		}
		//按钮
		var btn = function(serial, index) {
			if (!config.btn || !config.btn1) {
				return;
			}
			config["btn" + serial](index);
		};

		if (config.btn) {
			var i = 0;
			var len = config.btn.length;
			var btns = document.getElementsByClassName("mdialog-layerbtn")[0]
				.children;
			for (i; i < len; i++) {
				(function(serial) {
					btns[serial].addEventListener(
						"click",
						function() {
							btn(serial + 1, that.index);
						},
						false
					);
				})(i);
			}
		}

		//遮罩关闭
		if (config.shade && config.shadeClose) {
			var shade = el.getElementsByClassName("mdialog-layershade")[0];
			shade.addEventListener(
				"click",
				function() {
					dialog.close(that.index);
				},
				false
			);
		}
	};
	win.dialog = {
		index: index,
		open: function(options) {
			var obj = new Dialog(options || {});
			return obj.index;
		},
		close: function(index) {
			var ibox = document.querySelectorAll(
				"#" + defaultclass[0] + index
			)[0];
			if (!ibox) return;
			//清空弹出框dom
			ibox.innerHTML = "";
			document.body.removeChild(ibox);
			//去除定时器
			clearTimeout(dCommon.timer[index]);
			//删除定时器属性
			delete dCommon.timer[index];
			//执行关闭方法
			typeof dCommon.end[index] === "function" && dCommon.edn[index]();
			//删除对应index的end方法
			delete dCommon.end[index];
		},
		//关闭所有层
		closeAll: function() {
			var boxs = document.querySelectorAll(defaultclass[0]);
			for (var i = 0, len = boxs.length; i < len; i++) {
				//  x | 0  是转换为2进制 ，  |0 为取整
				dialog.close(boxs[0].getAttribute("index") | 0);
			}
		}
	};
})(window);
