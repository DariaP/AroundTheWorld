var PlaceView = Backbone.View.extend({
  events: {
    'click [type="checkbox"]': 'checkboxClicked'
  },

  initialize: function(options) {
    this.mapid = options.mapid;
  },
 
  render: function() {
    var html = new EJS({url:             
        '/templates/addPlace'}).render(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  checkboxClicked: function(e) {
    if (this.checked) {
      this.checked = false
      this.trigger('unchecked');
    } else {
      this.checked = true
      this.trigger('checked');
    }
  }
});

var AddPlacesToMapView = Backbone.View.extend({

  events: {
    'click .save': 'save'
  },

  initialize: function(options) {
    this.places = options.places;
    this.newPlaces = {};
  },

  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/addPlaces'}).render(this.model.toJSON());

    this.$el.html(html);

    this.places.onEach(function(place) {
      that.addPlace(place);
    });

    return this;
  },

  addPlace: function(place) {
    var view = new PlaceView({
      model: place,
      mapid: this.model.attributes._id
    });
    var that = this;

    view.on('checked', function() {
      that.newPlaces[place.attributes._id] = place;
    });
    view.on('unchecked', function() {
      that.newPlaces[place.attributes._id] = undefined;
    });

    this.$('ul').append(view.render().el);
  },

  save: function(e) {
    for(id in this.newPlaces) {
      if (this.newPlaces[id]) {
        this.newPlaces[id].addToMap(this.model.attributes._id);
      }
    }
    this.trigger('done');
  }
});

module.exports = AddPlacesToMapView;