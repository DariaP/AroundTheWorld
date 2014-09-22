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
    this.listenTo(this.model, 'change', this.render);

    this.render();
  },

  render: function() {
    var place = this.model.attributes;

    $("#place-name").text(place.name);
    $("#place-desc").text(place.notes);
    $("#links").html(this.renderPics(this.model.pics));
    $("#place-details-sidebar").css('visibility', 'visible');

    return this;
  },

  renderPics: function(pics) {
    return "<p>I am the pics</p>";
  }
});