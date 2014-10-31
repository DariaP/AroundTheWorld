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

    this.model.removeFromMap(this.mapid);

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
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.model.places.onEach(function(place) {
      if (place.attributes.name) {
        that.addPlace(place);
      }
    });

    return this;
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