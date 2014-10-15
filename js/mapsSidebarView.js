var MapsList = require('./map.js').MapsList,
    MapDetailsView = require('./mapDetails.js');

var MapView = Backbone.View.extend({

  tagName:  "li",

  initialize: function() {
    this.template = _.template($('#map-template').html()),
    this.listenTo(this.model, 'change', this.render);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide"
  },

  initialize: function(options) {
    this.mapsListTemplate = _.template($('#maps-list-template').html());
  	
    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.hide();
  },

  render: function() {
    this.$('#content').html(this.mapsListTemplate());
    this.list = this.$('#maps-list');
  	this.list.html('');
  	this.maps.fetch();
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.$el.on('click', function(e) {
      e.preventDefault();
      //TODO: seq of code matters because of shared map/fetch staff
      that.showMap(map);
      that.trigger('mapMenuClicked', map);
    });

    this.list.append(view.el);
  },

  showMap: function(map) {
    var view = new MapDetailsView({ model: map });
    this.$('#content').html(view.render().el);
  },

  hide: function() {
    this.$el.hide();    
  },

  show: function() {
    this.render();
    this.$el.show();  	
  }
});

module.exports = MapsSidebarView;