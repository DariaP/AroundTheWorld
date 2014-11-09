var PlaceView = Backbone.View.extend({
  events: {
    "click #remove" : "removeFromMap",
    "click .lookup" : "lookup",
    "click a" : "showDetails"
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#place-template').html());
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.model.on('change:parentMaps', function() {
      if ( ! that.model.isOnMap(that.mapid)) {
        that.clear();
      }
    });

    return this;
  },

  removeFromMap: function(e) {
    var that = this;

    e.preventDefault();

    this.model.removeFromMap(this.mapid);
  },

  clear: function() {
    this.$el.remove();
  },

  lookup: function() {
    this.trigger('lookup');
  },

  showDetails: function() {
    this.trigger('showDetails');
  },
});

var MapDetailsView = Backbone.View.extend({

  events: {
    "click .add" : "onAddClick"
  },

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
  },
 
  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

    this.model.places.onEach(function(place) {
      that.addPlace(place);
    });

    return this;
  },

  addPlace: function(place) {
    var that = this;

    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });

    view.on('lookup', function() {
      that.trigger('lookup', place);
    });

    view.on('showDetails', function() {
      that.trigger('showDetails', place);
    });

    this.$('ul').append(view.render().el);
  },

  onAddClick: function(e) {
    e.preventDefault();
    this.trigger('addPlaces', this.model);
  }
});

module.exports = MapDetailsView;