var Place = Backbone.Model.extend({

  name: "",
  notes: "",
  pics: [],
  location: {lat: 0, lng: 0},
  parentMaps: [],

  addOnMap: function(map) {
    this.save({parentMaps: this.get("parentMaps") + map});
  }
});

var PlaceDetailsView = Backbone.View.extend({

  initialize: function() {

    this.template = _.template($('#place-details-template').html()),

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    var place = this.model.attributes;

    this.model.attributes.picsHtml = this.renderPics(this.model.pics);
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  renderPics: function(pics) {
    return "<p>I am the pics</p>";
  },

});