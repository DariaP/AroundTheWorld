
var MapsList = Backbone.Collection.extend({
  model: PlacesMap,

  fetch: function(options) {
  	this.reset([]);
    this.add(new PlacesMap({
      name: "My First Map"
    }));
  }    
});


var MapsListSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {

  	this.list = this.$('#maps-list');

    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.hide();
  },

  render: function() {
  	this.list.html('');
  	this.maps.fetch();
  },

  addMapToList: function(map) {
    var view = new PlacesMapListView({model: map});
    this.list.append(view.render().el);
    this.$el.show();
  },
  
  hide: function() {
    this.$el.hide();  	
  }
});