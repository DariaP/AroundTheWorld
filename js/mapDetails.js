var MapDetailsView = Backbone.View.extend({

  initialize: function() {
    this.template = _.template($('#map-details-template').html());
    this.placeTemplate = _.template($('#place-template').html());
    this.listenTo(this.model.places, 'add', this.addPlace);
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    //this.model.places.fetch();
    return this;
  },

  addPlace: function(place) {
  	//TODO: looks like the better way to do this kind of work
    this.$('#places-list').append(this.placeTemplate(place.toJSON()));
  }
});

module.exports = MapDetailsView;