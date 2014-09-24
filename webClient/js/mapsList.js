
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

  initialize: function(options) {
    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMapToList);
  },
  render: function() {
  	this.$el.find('#maps-list').html('');
  	this.maps.fetch();
  },
  addMapToList: function(map) {
    var view = new PlacesMapListView({model: map});
    this.$('#maps-list').append(view.render().el);
    this.$el.css('visibility', 'visible');
  }
});