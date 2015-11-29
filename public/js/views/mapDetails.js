var PlaceView = Backbone.View.extend({
  events: {
    "click .remove" : "removeFromMap",
    "click .lookup" : "lookup",
    "click a" : "showDetails"
  },

  initialize: function(options) {
    this.mapid = options.mapid;
  },
 
  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/place'}).render(this.model.toJSON());

    this.$el.html(html);

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
  },
 
  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/mapDetails'}).render(this.model.toJSON());

    this.$el.html(html);

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

    // we rely on this to happen when place is removed from collection
    place.on('removedFromMap:' + this.model.attributes._id, function() {
      view.clear();
    });

    this.$('ul').append(view.render().el);
  },

  onAddClick: function(e) {
    e.preventDefault();
    this.trigger('addPlaces', this.model);
  }
});

module.exports = MapDetailsView;