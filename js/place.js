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

    this.model.attributes.picsHtml = this.renderPics();
    this.$el.html(this.template(this.model.toJSON()));

    var mapsDropdown = new MapsListDropdownView({
      maps: new MapsList(),
      elem: this.$('#add-place-to-map-dropdown-list')
    })
    mapsDropdown.render();

    return this;
  },

  renderPics: function() {
    var pics = this.model.attributes.pics;
    var html = "";
    for (var i = 0 ; i < pics.length ; ++i) {
      var pic = new Pic({src: pics[i]})
      var picHtml = new PicView({model: pic}).render().$el.html();
      html += picHtml;
    }
    return html;
  }
});