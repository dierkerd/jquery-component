(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function($) {
  $.fn.bindData = function(callback) {
    var _this = this;
    $(_this).find('[data-bind-id]').each(function() {
      var pubSub = $({});
      var id = $(this).data('bind-id');
      var eventName = id + ':change';

      $(this).on('change input', function(e) {
        var $input = $(this);
        pubSub.trigger(eventName, [$input.val()]);
      });

      pubSub.on(eventName, function(evt, newVal) {
        $(_this).find('[data-bind = ' + id + ']').each(function() {
          var $bound = $(this);

          if (callback) newVal = callback(newVal);

          if ( $bound.is("input, textarea, select") ) {
            $bound.val( newVal );
          } else {
            $bound.html( newVal );
          }
        });
      });
    });
    return this;
  };
}(jQuery));

},{}],2:[function(require,module,exports){
(function($) {
  $.component = function(options) {
    var opts = options || {};

    var obj = {
      $el: '',
      bindData: opts.bindData || null,
      children: opts.children || '',
      events: opts.events || {},
      model: {
        data: opts.model || {},
        get: function(attr) {
          return this.data[attr];
        },
        set: function(key, val) {
          if (key == null) return this;

          var attrs;
          if (typeof key === 'object') {
            attrs = key;
          } else {
            (attrs = {})[key] = val;
          }

          for (var attr in attrs) {
            this.data[attr] = attrs[attr];
          }

          if (obj.$el) {
            obj.$el.replaceWith(obj.render());
          }
        }
      },
      render: function(data) {
        if (data) this.model.data = data;

        var $el = $(_.template(this.template)(this.model));
        $el.find('[data-children]').html(this.children);
        $el.events(this.events).bindData(this.bindData);
        this.$el = $el;

        return $el;
      },
      setBindData: function(callback) {
        this.bindData = callback;
        return this;
      },
      setChildren: function(children) {
        this.children = children;

        if (this.$el) {
          this.$el.find('[data-children]').html(this.children);
        }
        return this;
      },
      setEvents: function(events) {
        this.events = events;

        if (this.$el) {
          this.$el.replaceWith(this.render());
        }
        return this;
      },
      setModel: function(model) {
        this.model.data = model;

        if (this.$el) {
          this.$el.replaceWith(this.render());
        }
        return this;
      },
      setTemplate: function(newTemplate) {
        this.template = newTemplate;

        if (this.$el) {
          this.$el.replaceWith(this.render());
        }
        return this;
      },
      template: opts.template || ''
    };
    return obj;
  };
}(jQuery));

},{}],3:[function(require,module,exports){
(function($) {
  $.fn.events = function(o){
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

},{}],4:[function(require,module,exports){
require('./jquery.events.js');
require('./jquery.bindData.js');
require('./jquery.component.js');

},{"./jquery.bindData.js":1,"./jquery.component.js":2,"./jquery.events.js":3}]},{},[4]);
