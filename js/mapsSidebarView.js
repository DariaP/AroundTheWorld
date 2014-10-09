var MapView = require('./mapViews.js').asSidebarItemView,
    MapsList = require('./map.js').MapsList;

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {

  	this.list = this.$('#maps-list');

    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.hide();
  },

  render: function() {
  	this.list.html('');
  	this.maps.fetch();
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapMenuClicked', map);
    });

    this.list.append(view.el);
  },

  hide: function() {
    this.$el.hide();    
  },

  show: function() {
    this.$el.show();  	
  }
});

module.exports = MapsSidebarView;