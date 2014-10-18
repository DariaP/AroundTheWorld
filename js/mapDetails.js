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
  }
});

var MapDetailsView = Backbone.View.extend({

  events: {
  },

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
    this.listenTo(this.model.places, 'add', this.addPlace);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  addPlace: function(place) {
    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });
    this.$('#places-list').append(view.render().el);
  }
});

module.exports = MapDetailsView;