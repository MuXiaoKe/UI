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
		extend: function() {
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
			this.htm();
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
		var title = "<h3>" + config.title + "</h3>";

		var button = (function() {
			//如果是单个按钮字符串，改为数组
			typeof config.btn === "string" && (config.btn = [config.btn]);
			var btnlength = (config.btn || []).length,
				btnhtml;
			//如果没有btn，返回空
			if (btnlength === 0 || !config.btn) return "";

			config.btn.forEach(function(item, index) {
				btnhtml = btnhtml + "<span >" + config.btn[index] + "</span>";
			});

			return '<div class="dialog-layerbtn">' + btndom + "</div>";
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
			title +
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

		if (config.btn) {
		}
	};
})(window);
