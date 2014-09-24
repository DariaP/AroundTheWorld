
var MapsList = Backbone.Collection.extend({
  model: PlacesMap,

  fetch: function(options) {
    this.add(new PlacesMap({
      name: "My First Map"
    }));
  }    
});


var MapsListSidebarView = Backbone.View.extend({
  el: '#maps-list',

  initialize: function(options) {

    this.maps = options.maps;
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.maps.fetch();
  },

  addMapToList: function(map) {
    var view = new PlacesMapListView({model: map});
    this.$el.append(view.render().el);
    this.$el.css('visibility', 'visible');
    $("#maps-sidebar").css('visibility', 'visible');
  }
});