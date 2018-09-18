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
	Dialog.prototype.htm = function() {
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
	};
})(window);
