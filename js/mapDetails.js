var PlaceView = Backbone.View.extend({
  events: {
    "click #remove" : "removeFromMap"
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#place-template').html());
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  removeFromMap: function(e) {
    var that = this;

    e.preventDefault();

    var newParentMaps = _.filter(
      this.model.attributes.parentMaps, 
      function(mapid) {
        return mapid !== that.mapid;
      }
    );

    this.model.set({
      parentMaps : newParentMaps
    });
    this.$el.remove();
    this.trigger('removed', this.model);
  }
});

var MapDetailsView = Backbone.View.extend({

  events: {
    "click #add" : "onAddClick"
  },

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
    this.listenTo(this.model.places, 'add', this.addPlace);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    this.showPlaces();

    return this;
  },

  showPlaces: function() {
    var places = this.model.places.models;
    for (var i = 0 ; i < places.length ; ++i) {
      if (places[i].attributes.name) {
        //console.log(places[i]);
        //console.log(places[i].attributes.name);
        this.addPlace(places[i]);
      }
    }    
  },

  addPlace: function(place) {
    var that = this;

    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });

    view.on('removed', function(place) {
      that.model.places.remove(place);
    });

    this.$('#places-list').append(view.render().el);
  },

  onAddClick: function(e) {
    e.preventDefault();
    this.trigger('addPlaces', this.model);
  }
});

module.exports = MapDetailsView;