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

var PlaceView = Backbone.View.extend({

  id: "place-details-sidebar",

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },
  
  render: function() {
    this.$("#place-name").text(this.model.name);
    this.$("#place-desc").text(this.model.name);
    this.$("#links").html(renderPics(this.model.pics));
    this.$el.show();
    return this;
  },

  renderPics: function(pics) {
    return "<p>I am the pics</p>";
  }
});