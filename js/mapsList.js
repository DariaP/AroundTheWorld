
var MapsList = Backbone.Collection.extend({
  model: Map,
  url: 'http://localhost:8089/getAllMaps'
});


var MapsListSidebarView = Backbone.View.extend({
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
    var view = new MapAsListItemView({model: map}).render(),
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

var MapsListDropdownView = Backbone.View.extend({
  //el: '#add-place-to-map-dropdown-list',

  initialize: function(options) {
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMap);

// TODO: why el field didn't work?
    this.$el = options.elem;
  },

  render: function() {
  	this.maps.fetch();
  },

  addMap: function(map) {
    var view = new MapAsDropdownItemView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      that.trigger('mapDropdownClicked', map);
    });

    this.$el.append(view.el);
  },
});