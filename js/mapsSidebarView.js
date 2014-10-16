var MapsList = require('./map.js').MapsList,
    MapDetailsView = require('./mapDetails.js');

var MapView = Backbone.View.extend({

  tagName:  "li",
  
  events: {
    "click .delete" : "onDeleteClick",
    "click .edit" : "onEditClick",
    "click a" : "onLinkClick"
  },

  initialize: function() {
    this.template = _.template($('#map-template').html());
    this.listenTo(this.model, 'destroy', this.clear);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.$el.remove();
  },

  onDeleteClick: function(e) {
    e.preventDefault();
    this.model.destroy({
      error: function() {
        console.log('error');
      },
      success: function() {
        console.log('success');
      }
    });
  },

  onEditClick: function(e) {
    e.preventDefault();
    this.edit();
  },

  onLinkClick: function(e) {
    e.preventDefault();
    this.trigger('mapClick');
  },

  edit: function() {
    ;
  }
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

    this.maps.refresh();
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.on('mapClick', function(e) {
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