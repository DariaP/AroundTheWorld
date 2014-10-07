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

// TODO: and how does it update the page?
    this.listenTo(this.model, 'change', this.changed);
  },

  changed: function() {
    if(this.model.attributes.name) {
      this.render();
    } else {
      this.trigger("cleared");
    }
  },

  render: function() {
    var that = this;

    this.model.attributes.picsHtml = this.renderPics();
    this.$el.html(this.template(this.model.toJSON()));

// do I need separate view?
    var mapsDropdown = new MapsListDropdownView({
      maps: new MapsList(),
      elem: this.$('#add-place-to-map-dropdown-list')
    });

//why just that.addPlaceToMap doesn't work?
    mapsDropdown.on('mapDropdownClicked', function(map) {
      that.addPlaceToMap(map);
    });
    mapsDropdown.render();

    return this;
  },

  renderPics: function() {
    var pics = this.model.attributes.pics,
        html = "";

    for (var i = 0 ; i < pics.length ; ++i) {
      var pic = new Pic({src: pics[i]})
      var picHtml = new PicView({model: pic}).render().$el.html();
      html += picHtml;
    }
    return html;
  },

  addPlaceToMap: function(map) {
    if (-1 == $.inArray(map.attributes.name, this.model.attributes.parentMaps)) {
      this.model.attributes.parentMaps.push(map.attributes.name);
      this.model.save();
    }
  }
});
