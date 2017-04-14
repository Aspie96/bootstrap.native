// Native Javascript for Bootstrap 3
// Copyright (c) 2015 dnp_theme
// Copyright (c) 2016-2017 Valentino Giudice
// MIT license

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchvalue, start) {
		for(var i = start || 0; i < this.length; i++) {
			if(this[i] === searchvalue) {
				return i;
			}
		}
		return -1;
	};
}
if(!String.prototype.trim) {
    String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
    };
}
if(!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s);
		var i = matches.length;
		while(--i >= 0 && matches.item(i) !== this);
		return i > -1;            
	};
}
Element.prototype.hasClass = function(cls) {
	return (" " + this.className + " ").indexOf(" " + cls + " ") > -1;
};
Element.prototype.addClass = function(cls) {
	if(!this.hasClass(cls)) {
		if(this.className) {
			this.className += " " + cls;
		} else {
			this.className = cls;
		}
	}
};
Element.prototype.removeClass = function(cls) {
	if(this.hasClass(cls)) {
		var classes = this.className.split(" ");
		classes.splice(classes.indexOf(cls), 1);
		this.className = classes.join(" ");
	}
};

// EventListener | CC0 | github.com/jonathantneal/EventListener
this.Element&&Element.prototype.attachEvent&&!Element.prototype.addEventListener&&function(){function e(e,t){Window.prototype[e]=HTMLDocument.prototype[e]=Element.prototype[e]=t}function t(e){t.interval&&document.body&&(t.interval=clearInterval(t.interval),document.dispatchEvent(new CustomEvent("DOMContentLoaded")))}e("addEventListener",function(e,t){var n=this,r=n._c1_listeners=n._c1_listeners||{},o=r[e]=r[e]||[];o.length||n.attachEvent("on"+e,o.event=function(e){var t=n.document&&n.document.documentElement||n.documentElement||{scrollLeft:0,scrollTop:0};e.currentTarget=n,e.pageX=e.clientX+t.scrollLeft,e.pageY=e.clientY+t.scrollTop,e.preventDefault=function(){e.returnValue=!1},e.relatedTarget=e.fromElement||null,e.stopImmediatePropagation=function(){l=!1,e.cancelBubble=!0},e.stopPropagation=function(){e.cancelBubble=!0},e.target=e.srcElement||n,e.timeStamp=+new Date;for(var r,c=0,a=[].concat(o),l=!0;l&&(r=a[c]);++c)for(var i,u=0;i=o[u];++u)if(i==r){i.call(n,e);break}}),o.push(t)}),e("removeEventListener",function(e,t){for(var n,r=this,o=r._c1_listeners=r._c1_listeners||{},c=o[e]=o[e]||[],a=c.length-1;n=c[a];--a)if(n==t){c.splice(a,1);break}!c.length&&c.event&&r.detachEvent("on"+e,c.event)}),e("dispatchEvent",function(e){var t=this,n=e.type,r=t._c1_listeners=t._c1_listeners||{},o=r[n]=r[n]||[];try{return t.fireEvent("on"+n,e)}catch(c){return void(o.event&&o.event(e))}}),Object.defineProperty(Window.prototype,"CustomEvent",{get:function(){var e=this;return function(t,n){n=n||{};var r,o=e.document.createEventObject();o.type=t,o.returnValue=!n.cancelable,o.cancelBubble=!n.bubbles;for(r in n)o[r]=n[r];return o}}}),t.interval=setInterval(t,1),window.addEventListener("load",t)}();try{new window.CustomEvent("?")}catch(e){!function(){window.CustomEvent=function(e,t){var n;t=t||{bubbles:!1,cancelable:!1,detail:void 0};try{n=document.createEvent("CustomEvent"),n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail)}catch(r){n=document.createEvent("Event"),n.initEvent(e,t.bubbles,t.cancelable),n.detail=t.detail}return n}}()}

document.on = function(event, selector, handler) {
	if(!handler) {
		handler = selector;
		selector = false;
	}
	var handlerFunc;
	if(selector) {
		handlerFunc = function(e) {
			var target = e.target;
			while(target && target != document) {
				if(target.matches(selector)){
					e.currentTarget = target;
					handler.call(target, e);
				}
				target = target.parentNode;
			}
		};
	} else {
		handlerFunc = handler;
	}
	document.addEventListener(event, handlerFunc);
};



// ALERT DEFINITION
// ===================
function Alert(el) {
	this.element = el;
	var self = this;

	this.close = function() {
		var event = new CustomEvent("close.bs.alert", { "cancelable": true });
		self.element.dispatchEvent(event);
		if(!event.defaultPrevented) {
			if(self.element.hasClass("in")) {
				self.element.removeClass("in");
				setTimeout(function() {
					self._close();
				}, 150);
			} else {
				self._close();
			}
		}
	};
	this._close = function() {
		self.element.parentNode.removeChild(self.element);
		event = new CustomEvent("closed.bs.alert");
		self.element.dispatchEvent(event);
	}

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	}
}

Alert.all = function(callback) {
	var elements = document.querySelectorAll('.alert');
	for(var i = 0; i < elements.length; i++) {
		callback(new Alert(elements[i]));
	}
};

// ALERT DATA API
// =================
document.on("click", '[data-dismiss="alert"]', function(e) {
	var alert = this;
	while((alert = alert.parentNode) != document && !alert.hasClass("alert"));
	if(alert.hasClass("alert")) {
		new Alert(alert).close();
		e.preventDefault();
	}
});



// BUTTON DEFINITION
// ===================
function Button(el) {
	this.element = el;
	var self = this;

	this.setState = function(option) {
		if(!self.element.getAttribute("data-original-text")) {
			self.element.setAttribute("data-original-text", self.element.innerHTML.replace(/^\s+|\s+$/g, ""));
		}
		if(option === "loading") {
			self.element.addClass("disabled");
			self.element.disabled = true;
		}
		var text = self.element.getAttribute("data-" + option + "-text");
		if(text) {
			self.element.innerHTML = text
		}
	};
	this.reset = function() {
		if(self.element.disabled || self.element.hasClass("disabled")) {
			self.element.removeClass("disabled");
			self.element.disabled = false;
		}
		var text = self.element.getAttribute("data-original-text");
		if(text) {
			self.element.innerHTML = text;
		}
	};
	this.toggle = function(el) {
		var parent = el.parentNode;
		var label = el.tagName === "LABEL" ? el : parent.tagName === "LABEL" ? parent : null;
        if(label) {
			var target = self.element;
			labels = target.querySelectorAll(".btn");
			input = label.getElementsByTagName("INPUT")[0];
			if(input) {
				if(input.type === "checkbox") {
					if(input.checked) {
						label.removeClass("active");
						input.checked = false;
					} else {
						label.addClass("active");
						input.checked = true;
					}
				}
				if(input.type === "radio") {
					if(!input.checked) {
						label.addClass("active");
						input.checked = true;
						for(var i = 0; i < labels.length; i++) {
							var l = labels[i];
							if(l !== label && l.hasClass("active")) {
								var inp = l.getElementsByTagName("INPUT")[0];
								l.removeClass("active");
								inp.checked = false;
							}
						}
					}                
				}
			}
		}
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	}
}

Button.all = function(callback) {
	var elements = document.querySelectorAll('[data-toggle="button"],[data-toggle="buttons"]');
	for(var i = 0; i < elements.length; i++) {
		callback(new Button(elements[i]));
	}
};

// BUTTON DATA API
// =================
document.on("click", '.btn-group[data-toggle="buttons"]', function(e) {
	new Button(this).toggle(e.target);
});



// CAROUSEL DEFINITION
// ===================
function Carousel(el) {
	this.element = el;
	var self = this;

	this.init = function() {
		var interval = self.interval();
		if(interval) {
			self.cycle(interval);
			if(self.element.getAttribute("data-pause") != "false") {
				self.element.addEventListener("mouseenter", Carousel.pauseHandler, false);
				self.element.addEventListener("mouseleave", Carousel.resumeHandler, false);
				self.element.addEventListener("touchstart", Carousel.pauseHandler, false);
				self.element.addEventListener("touchend", Carousel.resumeHandler, false);
			} else {
				self.element.removeEventListener("mouseenter", Carousel.pauseHandler, false);
				self.element.removeEventListener("mouseleave", Carousel.resumeHandler, false);
				self.element.removeEventListener("touchstart", Carousel.pauseHandler, false);
				self.element.removeEventListener("touchend", Carousel.resumeHandler, false);
			}
		}
    };
	this._clearInterval = function(removeAttribute) {
		clearTimeout(self.element.getAttribute("data-timer"));
		var timer = self.element.getAttribute("data-timer");
		if(timer) {
			clearTimeout(timer);
			if(removeAttribute !== false) {
				self.element.removeAttribute("data-timer");
			}
		}
	};
	this.cycle = function(interval) {
		self._clearInterval(false);
		if(!interval) {
			interval = self.interval();
		}
		self.element.setAttribute("data-timer", setTimeout(function() {
			self.slideTo(self.getActiveIndex() + 1);
		}, interval));
    };
    this.slideTo = function(next, slides) {
		var event = new CustomEvent("slide.bs.carousel", { "cancelable": true });
		self.element.dispatchEvent(event);
		if(!event.defaultPrevented) {
			slides = slides || self.element.querySelectorAll(".item");
			var indicators = self.element.querySelectorAll(".carousel-indicators li");
			var active = self.getActiveIndex();
			self._clearInterval();
			var nextNorm = ((next % slides.length) + slides.length) % slides.length;
			indicators[active].removeClass("active");
			indicators[nextNorm].addClass("active");
			if(self.element.hasClass("slide")) {
				var direction;
				var dr;
				if(next > active) {
					direction = "left";
					dr = "next";
				} else {
					direction = "right";
					dr = "prev";
				}
				slides[nextNorm].addClass(dr);
				slides[nextNorm].offsetWidth;
				slides[nextNorm].addClass(direction);
				slides[active].addClass(direction);
				event = new CustomEvent("slid.bs.carousel");
				setTimeout(function() {
					slides[active].removeClass("active");
					slides[nextNorm].addClass("active");
					slides[nextNorm].removeClass(dr);
					slides[nextNorm].removeClass(direction);
					slides[active].removeClass(direction);
					if(self.interval() && !self.element.hasClass("paused")) {
						self.cycle();
					}
					self.element.dispatchEvent(event);
				}, self.duration() + 100);
			} else {
				for(var i = 0; i < slides.length; i++) {
					if(i == nextNorm) {
						slides[i].addClass("active");
					} else {
						slides[i].removeClass("active");
					}
				}
				setTimeout(function() {
					if(self.interval() && !self.element.hasClass("paused")) {
						self.cycle();
					}
					self.element.dispatchEvent(event);
				}, self.duration() + 100);
			}
		}
	};
	this.getActiveIndex = function() {
		var slides = self.element.querySelectorAll(".item");
		var retVal = -1;
		var i = 0;
		while(retVal == -1 && i < slides.length) {
			if(slides[i].hasClass("active")) {
				retVal = i;
			}
			i++;
		}
		return retVal;
    };
	this.interval = function(interval) {
		if(interval === undefined) {
			if(typeof self.element.getAttribute("data-interval") == "string" && self.element.getAttribute("data-interval") != "false") {
				return parseInt(self.element.getAttribute("data-interval")) || 5000;
			} else {
				return false;
			}
		}
		if(interval) {
			self.element.setAttribute("data-interval", interval);
		} else {
			self.element.removeAttribute("data-interval");
		}
	};
	this.duration = function(duration) {
		if(duration === undefined) {
			return parseInt(self.element.getAttribute("data-duration")) || 600;
		}
		if(duration) {
			self.element.setAttribute("data-duration", duration);
		} else {
			self.element.removeAttribute("data-duration");
		}
	};
	this.slideRight = function() {
		self.slideTo(self.getActiveIndex() + 1);
	};
	this.slideLeft = function() {
		self.slideTo(self.getActiveIndex() - 1);
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Carousel.all = function(callback) {
	var elements = document.querySelectorAll('[data-ride="carousel"]');
	for(var i = 0; i < elements.length; i++) {
		callback(new Carousel(elements[i]));
	}
};

// CAROUSEL DATA API
// =================
Carousel.pauseHandler = function(e) {
	if(this.matches('[data-ride="carousel"]')) {
		var carousel = new Carousel(this);
		if(carousel.interval() && !this.hasClass("paused")) {
			carousel._clearInterval();
			this.addClass("paused");
		}
	}
};
Carousel.resumeHandler = function(e) {
	if(this.matches('[data-ride="carousel"]')) {
		var carousel = new Carousel(this);
		if(carousel.interval() && this.hasClass("paused")) {
			this.removeClass("paused");
			carousel.cycle();
		}
	}
};

document.on("click", '.carousel-control', function(e) {
	var carousel = this;
	while(carousel != document && !carousel.matches('[data-ride="carousel"]')) {
		carousel = carousel.parentNode;
	}
	if(carousel.matches('[data-ride="carousel"]') && !carousel.hasClass("sliding")) {
		carousel = new Carousel(carousel);
		if(this.getAttribute("data-slide") == "prev") {
			carousel.slideLeft();
		} else {
			carousel.slideRight();
		}
		e.preventDefault();
	}
});

document.on("click", '[data-slide-to]', function(e) {
	var carousel = this;
	while(carousel != document && !carousel.matches('[data-ride="carousel"]')) {
		carousel = carousel.parentNode;
	}
	if(carousel.matches('[data-ride="carousel"]') && !carousel.hasClass("sliding")) {
		new Carousel(carousel).slideTo(parseInt(this.getAttribute("data-slide-to")) || 0);
		e.preventDefault();
	}
});



// COLLAPSE DEFINITION
// ===================
function Collapse(el) {
	this.element = el;
	var self = this;

	this.toggle = function() {
		var collapse = self.getTarget();
		if(!collapse.hasClass("collapsing")) {
			if(collapse.hasClass("in")) {
				self.close(collapse);
			} else {
				self.open(collapse);
			}
		}
	};
	this.close = function(collapse) {
		if(!collapse) {
			collapse = self.getTarget();
		}
		if(collapse.hasClass("in")) {
			self._close(collapse);
			self.element.removeClass("collapsed");
		}
	};
	this.open = function(collapse) {
		if(!collapse) {
			collapse = self.getTarget();
		}
		if(!collapse.hasClass("in")) {
			var event = new CustomEvent("show.bs.dropdown", { "cancelable": true });
			self.element.dispatchEvent(event);
			if(!event.defaultPrevented) {
				self._open(collapse);
				self.element.addClass("collapsed");
				var accordionSelector = self.element.getAttribute("data-parent");
				if(accordionSelector) {
					var accordion = self.element;
					while(accordion != document && !accordion.matches(accordionSelector)) {
						accordion = accordion.parentNode;
					}
					if(accordion.matches(accordionSelector)) {
						var active = accordion.querySelectorAll(".collapse.in");
						for(var i = 0; i < active.length; i++) {
							if(active[i] !== collapse) {
								event = new CustomEvent("hide.bs.collapse");
								self.element.dispatchEvent(event);
								self._close(active[i]);
							}
						}
					}
				}
			}
		}
	};
	this._open = function(c) {
		c.addClass("in");
		self.element.setAttribute("aria-expanded", true);
		c.addClass("collapsing");
		setTimeout(function() {
			c.style.height = self.getMaxHeight(c) + "px";                    
			c.style.overflowY = "hidden";
		}, 0);
		setTimeout(function() {
			c.style.height = ""; 
			c.style.overflowY = "";
			c.removeClass("collapsing");
			var event = new CustomEvent("shown.bs.dropdown");
			c.dispatchEvent(event);
		}, self.duration());
	};
	this._close = function(c) {
		self.element.setAttribute("aria-expanded", false);
		c.style.height = self.getMaxHeight(c) + "px";
		setTimeout(function() {
			c.style.height = "0px";
			c.style.overflowY = "hidden";
			c.addClass("collapsing");
		},0);
		setTimeout(function() {
			c.removeClass("collapsing");
			c.removeClass("in"); 
			c.style.overflowY = "";
			c.style.height = "";
			var event = new CustomEvent("hidden.bs.dropdown");
			c.dispatchEvent(event);
		}, self.duration());
	};
	this.getMaxHeight = function(l) {
		var retVal = 0;
		for(var i = 0; i < l.children.length; i++) {
			var el = l.children[i];
			var s = el && el.currentStyle || window.getComputedStyle(el);
			var btp = /px/.test(s.borderTopWidth) ? Math.round(s.borderTopWidth.replace("px", "")) : "0";
			var mtp = /px/.test(s.marginTop) ? Math.round(s.marginTop.replace("px", "")) : "0";
			var mbp = /px/.test(s.marginBottom) ? Math.round(s.marginBottom.replace("px", "")) : "0";
			var bbp = /px/.test(s.borderBottomWidth) ? Math.round(s.borderBottomWidth.replace("px", "")) : "0";
			var mte = /em/.test(s.marginTop) ? Math.round(s.marginTop.replace("em", "") * parseInt(s.fontSize)) : "0";
			var mbe = /em/.test(s.marginBottom) ? Math.round(s.marginBottom.replace("em", "")  * parseInt(s.fontSize)) : "0";
			retVal += el.clientHeight + parseInt(btp) + parseInt(mtp) + parseInt(mbp) + parseInt(bbp) + parseInt(mte) + parseInt(mbe);
		}
		return retVal + 1;
	};
	this.getTarget = function() {
		var t = self.element;
		var h = t.href && t.getAttribute("href").replace("#", "");
		var d = t.getAttribute("data-target") && (t.getAttribute("data-target"));
		var id = h || (d && /#/.test(d)) && d.replace("#", "");
		var cl = (d && d.charAt(0) === ".") && d;
		return id && document.getElementById(id) || cl && document.querySelector(cl);
	};
	this.duration = function(duration) {
		if(duration === undefined) {
			return parseInt(self.element.getAttribute("data-duration")) || 300;
		}
		self.element.setAttribute("data-duration", duration);
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Collapse.all = function(callback) {
	var elements = document.querySelectorAll('[data-toggle="collapse"]');
	for(var i = 0; i < elements.length; i++) {
		callback(new Collapse(elements[i]));
	}
}

// COLLAPSE DATA API
// =================
document.on("click", '[data-toggle="collapse"]', function(e) {
	new Collapse(this).toggle();
	e.preventDefault();
});



// DROPDOWN DEFINITION
// ===================
function Dropdown(el) {
	this.element = el;
	var self = this;

	this.toggle = function() {
		if(self.element.parentNode.hasClass("open")) {
			self.close();
        } else {
			self.open();
        }
	};
	this.open = function() {
		if(!self.element.parentNode.hasClass("open")) {
			var event = new CustomEvent("show.bs.dropdown", { "cancelable": true });
			self.element.parentNode.dispatchEvent(event);
			if(!event.defaultPrevented) {
				if(!Dropdown.active) {
					document.addEventListener("keydown", Dropdown.keydownHandler, false);
				}
				Dropdown.active = self;
				self.element.parentNode.addClass("open");
				self.element.setAttribute("aria-expanded", true);
				vent = new CustomEvent("shown.bs.dropdown");
				self.element.parentNode.dispatchEvent(event);
			}
		}
	};
	this.close = function() {
		if(self.element.parentNode.hasClass("open")) {
			var event = new CustomEvent("hide.bs.dropdown");
			self.element.parentNode.dispatchEvent(event);
			if(self.element.parentNode.hasClass("open")) {
				if(Dropdown.active.element == self.element) {
					Dropdown.active = null;
					document.removeEventListener("keydown", Dropdown.keydownHandler, false);
				}
				self.element.parentNode.removeClass("open");
				self.element.setAttribute("aria-expanded", false);
				event = new CustomEvent("hidden.bs.dropdown");
				self.element.parentNode.dispatchEvent(event);
			}
		}
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Dropdown.all = function(callback) {
	var elements = document.querySelectorAll('[data-toggle="dropdown"]');
	for(var i = 0; i < elements.length; i++) {
		callback(new Dropdown(elements[i]));
	}
};

// DROPDOWN DATA API
// =================
Dropdown.keydownHandler = function(e) {
	if(Dropdown.active && e.which == 27) {
		Dropdown.active.close();
	}
};

document.on("click", '[data-toggle="dropdown"]', function(e) {
	new Dropdown(this).toggle();
	e.preventDefault();
});

document.on("click", function(e) {
	Dropdown.all(function(dropdown) {
		if(!dropdown.element.contains(e.target)) {
			dropdown.close();
		}
	});
});



// MODAL DEFINITION
// ===================
function Modal(el) {
	this.element = el;
	var self = this;

	this.open = function() {
		if(!self.element.hasClass("in")) {
			var event = new CustomEvent("show.bs.modal", { "cancelable": true });
			self.element.dispatchEvent(event);
			if(!event.defaultPrevented) {
				if(!Modal.active) {
					document.addEventListener("keydown", Modal.keydownHandler, false);
					window.addEventListener("resize", Modal.resizeHandler, false);
				}
				Modal.active = self;
				var currentOpen = document.querySelector(".modal.in");
				var duration = self.element.getAttribute("data-duration") || 300;
				if(currentOpen){
					clearTimeout(currentOpen.getAttribute("data-timer"));
					currentOpen.removeClass("in");
					setTimeout(function() {
						currentOpen.setAttribute("aria-hidden", true);
						currentOpen.style.display = "";
					}, duration / 2);
				}
				if(self.element.getAttribute("data-backdrop") != "false") {
					var overlay = self.createOverlay();
					setTimeout(function() {
						overlay.addClass("in");
					}, 0);
				}
				clearTimeout(self.element.getAttribute("data-timer"));
				self.element.setAttribute("data-timer", setTimeout(function() {
					self.element.style.display = "block";
					self.adjustDialog();
					self.setScrollbar();
					document.body.addClass("modal-open");
					self.element.addClass("in");
					self.element.setAttribute("aria-hidden", false);
					event = new CustomEvent("shown.bs.modal");
					self.element.dispatchEvent(event);
				}, duration / 2));
			}
		}
	};
	this.createOverlay = function() {
		var retVal = document.querySelector(".modal-backdrop");
		if(!retVal) {
			retVal = document.createElement("div");
			retVal.addClass("modal-backdrop");
			retVal.addClass("fade");
			document.body.appendChild(retVal);
		}
		return retVal;
	};
	this.close = function() {
		if(self.element.hasClass("in")) {
			var event = new CustomEvent("hide.bs.modal", { "cancelable": true });
			self.element.dispatchEvent(event);
			if(!event.defaultPrevented) {
				if(self.element.hasClass("in")) {
					if(Modal.active.element == self.element) {
						Modal.active = null;
						document.removeEventListener("keydown", Modal.keydownHandler, false);
						window.removeEventListener("resize", Modal.resizeHandler, false);
					}
					var overlay = document.querySelector(".modal-backdrop");
					if(overlay) {
						overlay.removeClass("in");
					}      
					self.element.removeClass("in");
					self.element.setAttribute("aria-hidden", true);
					clearTimeout(self.element.getAttribute("data-timer"));
					var duration = self.element.getAttribute("data-duration") || 300;
					self.element.setAttribute("data-timer", setTimeout(function() {
						document.body.removeClass("modal-open");
						self.resetAdjustments();
						self.resetScrollbar();
						self.element.style.display = "";
					}, duration / 2));
					setTimeout(function() {
						if(!document.querySelector(".modal.in")) {
							self.removeOverlay(overlay);
						}
						event = new CustomEvent("hidden.bs.modal");
						self.element.dispatchEvent(event);
					}, duration);
				}
			}
		}
	};
	this.removeOverlay = function(overlay) {
		if(!overlay) {
			overlay = document.querySelector(".modal-backdrop");
		}
		if(overlay) {
			document.body.removeChild(overlay);
		}
	};
	this.content = function(content) {
		if(typeof content == "string") {
			return self.element.querySelector(".modal-content").innerHTML = content;
		} else {
			return self.element.querySelector(".modal-content").innerHTML;
		}
	};
	this.adjustDialog = function() {
		var htmlRect = document.documentElement.getBoundingClientRect();
		var bodyIsOverflowing = document.body.clientWidth < (window.innerWidth || (htmlRect.right - Math.abs(htmlRect.left)));
		var modalIsOverflowing = self.element.scrollHeight > document.documentElement.clientHeight;
		var scrollbarWidth = self.measureScrollbar();
		self.element.style.paddingLeft = !bodyIsOverflowing && modalIsOverflowing ? scrollbarWidth + 'px' : '';
		self.element.style.paddingRight = bodyIsOverflowing && !modalIsOverflowing ? scrollbarWidth + 'px' : '';
	};
	this.resetAdjustments = function() {
		self.element.style.paddingLeft = "";
		self.element.style.paddingRight = "";
	};
	this.setScrollbar = function() {
		var bodyStyle = document.body.currentStyle || window.getComputedStyle(document.body);
		var bodyPad = parseInt((bodyStyle.paddingRight), 10);
		var htmlRect = document.documentElement.getBoundingClientRect();
		if(document.body.clientWidth < (window.innerWidth || (htmlRect.right - Math.abs(htmlRect.left)))) {
			document.body.style.paddingRight = (bodyPad + self.measureScrollbar()) + "px";
		}
	};
	this.resetScrollbar = function() {
		document.body.style.paddingRight = "";
	};
	this.measureScrollbar = function() {
		var scrollDiv = document.createElement("div");
		scrollDiv.className = "modal-scrollbar-measure";
		document.body.appendChild(scrollDiv);
		var retVal = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		document.body.removeChild(scrollDiv);
		return retVal;
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Modal.all = function(callback) {
	var elements = document.querySelectorAll('.modal');
	for(var i = 0; i < elements.length; i++) {
		callback(new Modal(elements[i]));
	}
};


// MODAL DATA API
// =================
Modal.keydownHandler = function(e) {
	if(Modal.active && e.which == 27 && Modal.active.element.getAttribute("data-keyboard") != "false") {
		Modal.active.close();
	}
};

Modal.resizeHandler = function(e) {
	if(Modal.active) {
		var overlay = document.querySelector(".modal-backdrop");
		if(overlay && overlay.hasClass("in")) {
			dim = {
				w: document.documentElement.clientWidth + "px",
				h: document.documentElement.clientHeight + "px"
			};
			overlay.style.height = dim.h;
			overlay.style.width = dim.w;
			Modal.active.adjustDialog();
		}
	}
};

document.on("click", '[data-toggle="modal"]', function(e) {
	new Modal(document.getElementById(this.getAttribute("data-target") && this.getAttribute("data-target").replace("#", "") || this.getAttribute("href") && this.getAttribute("href").replace("#", ""))).open();
	e.preventDefault();
});

document.on("click", '.modal', function(e) {
	if(e.target.parentNode.getAttribute("data-dismiss") === "modal" || e.target.getAttribute("data-dismiss") === "modal" || e.target === this) {
		new Modal(this).close();
		e.preventDefault();
	}
});



// PROGRESS DEFINITION
// ===================
function Progress(el) {
	this.element = el;
	var self = this;

	this._bar = function() {
		return self.element.querySelector(".progress-bar");
	};
	this.value = function(value, text) {
		var bar = self._bar();
		if(value === undefined) {
			return parseInt(bar.getAttribute("aria-valuenow") || bar.style.slice(0, -1));
		} else {
			bar.setAttribute("aria-valuenow", value);
			bar.style.width = value + "%";
			if(text) {
				bar.innerText = text;
			}
		}
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Progress.all = function(callback) {
	var elements = document.querySelectorAll('.progress');
	for(var i = 0; i < elements.length; i++) {
		callback(new Progress(elements[i]));
	}
};

// PROGRESS DATA API
// =================



// TAB DEFINITION
// ===================
function Tab(el) {
	this.element = el;
	var self = this;

	this.action = function() {
		var tabs = self.element.parentNode.parentNode;
		var event = new CustomEvent("show.bs.tab", { "cancelable": true });
		self.element.parentNode.dispatchEvent(event);
		if(!event.defaultPrevented) {
			var activeTab = self.getActiveTab();
			event = new CustomEvent("hide.bs.tab");
			var newContent = document.getElementById(self.element.getAttribute("href").replace("#", ""));
			var activeContent = self.getActiveContent();
			var duration = self.element.getAttribute("data-duration") || 150;
			var dropdown;
			if(self.element.parentNode.parentNode.hasClass("dropdown-menu")) {
				tabs = tabs.parentNode.parentNode;
				dropdown = tabs.parentNode;
			} else {
				dropdown = tabs.querySelector(".dropdown");
			}
			if(!self.element.parentNode.hasClass("active")) {
				activeTab.removeClass("active");
				self.element.parentNode.addClass("active");
				if(dropdown) {
					if(!self.element.parentNode.parentNode.hasClass("dropdown-menu")) {
						dropdown.removeClass("active");
					} else {
						dropdown.addClass("active");
					}
				}
				activeContent.removeClass("in");
				setTimeout(function() {
					activeContent.removeClass("active");
					newContent.addClass("active");
					event = new CustomEvent("hidden.bs.tab");
					activeTab.dispatchEvent(event);
				}, duration);
				setTimeout(function() {
					newContent.addClass("in");
					event = new CustomEvent("shown.bs.tab");
					self.element.parentNode.dispatchEvent(event);
				}, duration * 2);
			}
		}
	};
	this.getActiveTab = function(tabs) {
		if(!tabs) {
			tabs = self.element.parentNode.parentNode;
			if(self.element.parentNode.parentNode.hasClass("dropdown-menu")) {
				tabs = tabs.parentNode.parentNode;
			}
		}
		var activeTabs = tabs.querySelectorAll(".active");
		if(activeTabs.length === 1 && !activeTabs[0].hasClass("dropdown")) {
			return activeTabs[0];
		} else if ( activeTabs.length > 1 ) {
			return activeTabs[activeTabs.length-1]
		}
	};
	this.getActiveContent = function() {
		var a = self.getActiveTab().getElementsByTagName("A")[0].getAttribute("href").replace("#", "");
		return a && document.getElementById(a)
	};

	this.on = function(par1, par2, par3) {
		this.element.addEventListener(par1, par2, par3);
	};
}

Tab.all = function(callback) {
	var elements = document.querySelectorAll('[data-toggle="tab"],[data-toggle="pill"]');
	for(var i = 0; i < elements.length; i++) {
		callback(new Tab(elements[i]));
	}
};

// TAB DATA API
// =================
document.on("click", "[data-toggle='tab'], [data-toggle='pill']", function(e) {
	new Tab(this).action();
	e.preventDefault();
});



window.addEventListener("load", function() {
	Carousel.all(function(carousel) {
		carousel.init();
	});
}, false);
