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

          this.data = modelData;

          if (self.$el) {
            self.$el.trigger('change', [key, val]);
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
      var self = this;
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
      for (var attr in this.model.data) {
        var $elems = $el.find('[data-model="' + attr + '"]');

        $elems.each(function($elem) {
          if ($(this)[0].tagName == 'INPUT' || $(this)[0].tagName == 'SELECT' || $(this)[0].tagName == 'TEXTAREA') {
            $(this).val(self.model.data[attr]);
          } else {
            $(this).text(self.model.data[attr]);
          }
        });
      }
      $el.events(this.events).bindData(this.bindData);
      this.$el = $el;

      this.$el.on('change', function (e, key, value) {
        var $elems = self.$el.find('[data-model="' + key + '"]');

        $elems.each(function($elem) {
          if ($(this)[0].tagName == 'INPUT' || $(this)[0].tagName == 'SELECT' || $(this)[0].tagName == 'TEXTAREA') {
            $(this).val(value);
          } else {
            $(this).text(value);
          }
        });
      });

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
