(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./jquery.events.js');
require('./jquery.bindData.js');
require('./jquery.component.js');

},{"./jquery.bindData.js":2,"./jquery.component.js":3,"./jquery.events.js":4}],2:[function(require,module,exports){
(function($) {
  $.fn.bindData = function(callback) {
    var self = this;
    $(self).find('[data-bind-id]').each(function() {
      var pubSub = $({});
      var id = $(this).data('bind-id');
      var eventName = id + ':change';

      $(this).on('change input', function() {
        var $input = $(this);
        pubSub.trigger(eventName, [$input.val()]);
      });

      pubSub.on(eventName, function(evt, val) {
        if (callback) var newVal = callback(val);

        $(self).find('[data-bind = ' + id + ']').each(function() {
          var $bound = $(this);

          if ($bound.is('input, textarea, select')) {
            $bound.val(newVal);
          } else {
            $bound.html(newVal);
          }
        });
      });
    });
    return this;
  };
}(jQuery));

},{}],3:[function(require,module,exports){
(function($) {
  $.component = function(options) {
    var opts = options || {};

    var Component = function() {
      var self = this;
      this.$el = '';
      this.mounted = false;
      this.children = opts.children || '';
      this.events = opts.events || {};
      this.model = {
        oldData: null,
        data: opts.model || {},
        get: function(attr) {
          return this.data[attr];
        },
        set: function(key, val) {
          var attrs;
          var modelData = Object.create({});

          if (key == null) return this;

          if (typeof key === 'object') {
            attrs = key;
          } else {
            (attrs = {})[key] = val;
          }

          for (var k in this.data) {
            Object.defineProperty(modelData, k, {
              value: this.data[k],
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
          for (var attr in attrs) {
            Object.defineProperty(modelData, attr, {
              value: attrs[attr],
              writable: true,
              enumerable: true,
              configurable: true
            });
          }

          if (self.$el) {
            self.$el.replaceWith(self.render(modelData));
          } else {
            this.data = modelData;
          }
        }
      };
      this.optionsTemplate = opts.optionsTemplate || {};
      this.template = opts.template || '';
    };

    Component.prototype.bindData = opts.bindData || null;

    Component.prototype.clone = function() {
      return $.extend(true, {}, this);
    }

    Component.prototype.componentDidMount = opts.componentDidMount || null;

    Component.prototype.componentDidUpdate = opts.componentDidUpdate || null;

    Component.prototype.componentWillMount = opts.componentWillMount || null;

    Component.prototype.componentWillUpdate = opts.componentWillUpdate || null;

    Component.prototype.render = function(data, optionsTemplate) {
      this.model.oldData = this.model.data;
      if (data) this.model.data = data;
      if (optionsTemplate) this.optionsTemplate = optionsTemplate;

      if (!this.mounted && this.componentWillMount) {
        this.componentWillMount();
      }
      if (this.mounted && this.componentWillUpdate) {
        this.componentWillUpdate(this.model.oldData);
      }

      var $el = $(_.template(this.template, this.optionsTemplate)(this.model));

      if (typeof this.children == 'function') this.children = this.children();

      if (typeof this.children == 'object' && this.children.length == undefined) {
        for (var child in this.children) {
          $el.find('[data-child="' + child + '"]').html(this.children[child]);
        }
      } else {
        if (!Array.isArray(this.children)) this.children = [this.children];

        this.children.forEach(function(child) {
          $el.find('[data-children]').append(child);
        });
      }
      $el.events(this.events).bindData(this.bindData);
      this.$el = $el;

      if (!this.mounted && this.componentDidMount) {
        this.componentDidMount();
      }
      if (this.mounted && this.componentDidUpdate) {
        this.componentDidUpdate(this.model.oldData);
      }

      this.mounted = true;

      return this.$el;
    };

    Component.prototype.setBindData = function(callback) {
      this.bindData = callback;

      return this;
    };

    Component.prototype.setChildren = function(children) {
      this.children = children;

      if (this.$el) {
        this.$el.find('[data-children]').empty();

        if (typeof this.children == 'function') this.children = this.children();

        if (typeof this.children == 'object' && this.children.length == undefined) {
          for (var child in this.children) {
            $el.find('[data-child="' + child + '"]').html(this.children[child]);
          }
        } else {
          if (!Array.isArray(this.children)) this.children = [this.children];

          this.children.forEach(function(child) {
            $el.find('[data-children]').append(child);
          });
        }
      }

      return this;
    };

    Component.prototype.setEvents = function(events) {
      this.events = events;

      if (this.$el) {
        this.$el.replaceWith(this.render());
      }

      return this;
    };

    Component.prototype.setModel = function(model) {

      if (this.$el) {
        this.$el.replaceWith(this.render(model));
      } else {
        this.model.data = model;
      }

      return this;
    };

    Component.prototype.setTemplate = function(newTemplate) {
      this.template = newTemplate;

      if (this.$el) {
        this.$el.replaceWith(this.render());
      }

      return this;
    };

    return new Component();
  };
}(jQuery));

},{}],4:[function(require,module,exports){
(function($) {
  $.fn.events = function(o) {
    for (var i in o) {
      var separator = i.split(' ');
      var result = [];

      if (separator.length > 1) {
        result = [separator.shift(), separator.join(' ')];
        this.find(result[1]).bind(i, o[i]);
      } else {
        this.bind(i, o[i]);
      }
    }
    return this;
  };
}(jQuery));

},{}]},{},[1]);
