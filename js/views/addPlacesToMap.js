var PlaceView = Backbone.View.extend({
  events: {
    'click [type="checkbox"]': 'checkboxClicked'
  },

  initialize: function(options) {
    this.mapid = options.mapid;
    this.template = _.template($('#add-place-template').html());
  },
 
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
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
    'click #save': 'save'
  },

  initialize: function(options) {
    this.places = options.places;
    this.template = _.template($('#add-places-template').html());
    this.newPlaces = {};
  },

  render: function() {
    var that = this;

    this.$el.html(this.template(this.model.toJSON()));

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

    this.$('#places-list').append(view.render().el);
  },

  save: function(e) {
    for(id in this.newPlaces) {
      if (this.newPlaces[id]) {
        this.newPlaces[id].addToMap(this.model.attributes._id);
        this.model.places.add(this.newPlaces[id]);
      }
    }
    this.trigger('done');
  }
});

module.exports = AddPlacesToMapView;