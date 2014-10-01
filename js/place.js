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

// how to handle async
// show then load?
    this.on("picsReady", this.onPicsReady)
    this.renderPics(this.model.attributes.pics);
  },

  onPicsReady: function(picsHtml) {
    this.model.attributes.picsHtml = picsHtml;
    this.$el.html(this.template(this.model.toJSON()));

// create new list every time?
    var mapsDropdown = new MapsListDropdownView({
      maps: new MapsList(),
      elem: this.$('#add-place-to-map-dropdown-list')
    })
    mapsDropdown.render();

    this.trigger("ready");
  },
 
//sep?

  renderPics: function(pics) {
    var that = this;
    function renderPicsHelper(i, html) {
      if (i == pics.length) {
        that.trigger("picsReady", html);
      } else {
        var picModel = new Pic({src: pics[i]});
        picModel.on("ready", function() {
          var picHtml = new PicView({model: picModel}).render().$el.html();
          renderPicsHelper(i + 1, html + picHtml);
        });
      }
    };

    renderPicsHelper(0, "");
  }
});