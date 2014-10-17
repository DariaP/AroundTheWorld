var MapsList = require('./map.js').MapsList,
    MapDetailsView = require('./mapDetails.js');

var MapView = Backbone.View.extend({

  tagName:  "li",
  
  events: {
    "click .delete" : "onDeleteClick",
    "click .edit" : "onEditClick",
    "click a" : "onLinkClick",
    "click #save" : 'onSaveClick'
  },

  initialize: function() {
    // TODO: split?

    this.template = _.template($('#map-template').html());
    this.editTemplate = _.template($('#edit-map-template').html());
    this.listenTo(this.model, 'destroy', this.clear);
    this.listenTo(this.model, 'changed', this.render);
  },
 
  render: function() {
    // TODO: what if name is too long to fit?
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.$el.remove();
  },

  onDeleteClick: function(e) {
    e.preventDefault();
    this.model.destroy({
      error: function() {
        ;//TODO
      }
    });
  },

  onEditClick: function(e) {
    e.preventDefault();
    this.edit();
  },

  onLinkClick: function(e) {
    e.preventDefault();
    this.trigger('mapClick');
  },

  onSaveClick: function(e) {
    e.preventDefault();
    this.save();
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
  },

  save: function() {
    this.model.set({
      name : this.$('#edit-map-name').val()
    });
    this.render();
    // TODO: why does this work? o_O
    this.trigger('refreshed');
  }
});

var NewMapView = Backbone.View.extend({
  events: {
    "click #save" : 'onSaveClick'
  },

  initialize: function(options) {
    this.template = _.template($('#new-map-template').html());
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  onSaveClick: function(e) {
    e.preventDefault();
    this.trigger('newMap', this.$('#name').val());
    this.$el.remove();
  }
});

var MapsSidebarView = Backbone.View.extend({
  el: '#maps-sidebar',

  events: {
    "click .close": "hide",
    "click #new": "newMap"
  },

  initialize: function(options) {
    this.mapsListTemplate = _.template($('#maps-list-template').html());
    
    this.maps = new MapsList();
    this.listenTo(this.maps, 'add', this.addMapToList);

    this.hide();
  },

  render: function() {
    this.$('#content').html(this.mapsListTemplate());
    this.list = this.$('#maps-list');
    this.list.html('');

    this.maps.refresh();
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.on('mapClick', function() {
      that.showMap(map);

      that.once('mapReady', function(m) {
        if (m.attributes._id == map.attributes._id) {
          map.places.fetch();
        }
      });
      that.trigger('mapMenuClicked', map);
    });

    view.on('refreshed', function() {
      that.$el.hide().fadeIn('fast');
    })

    this.list.append(view.el);
  },

  showMap: function(map) {
    var view = new MapDetailsView({ model: map });
    this.$('#content').html(view.render().el);
  },

  newMap: function(e) {
    var that = this;

    e.preventDefault();

    if (!this.addingNew) {
      this.addingNew = true;

      var view = new NewMapView();
      this.list.before(view.render().el);

      view.once('newMap', function(name) {
        that.addMap(name);
      })
    }
  },

  addMap: function(name) {
    this.addingNew = false;
    this.maps.create({
      name: name
    });
  },

  hide: function() {
    this.$el.hide();    
  },

  show: function() {
    this.render();
    this.$el.show();    
  }
});

module.exports = MapsSidebarView;