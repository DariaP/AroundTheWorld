var MapView = Backbone.View.extend({

  tagName:  "li",
  
  events: {
    "click .delete" : "onDeleteClick",
    "click .edit" : "onEditClick",
    "click a" : "onLinkClick",
    "click .save" : 'onSaveClick'
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
      name : this.$('input[name="name"]').val()
    });
    this.render();
    // TODO: why does this work? o_O
    this.trigger('refreshed');
  }
});

var NewMapView = Backbone.View.extend({
  events: {
    "click .save" : 'onSaveClick'
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
    this.trigger('newMap', this.$('input[name="name"]').val());
    this.$el.remove();
  }
});

var MapsListView = Backbone.View.extend({

  events: {
    "click .new": "newMap"
  },

  initialize: function(options) {
    this.template = _.template($('#maps-list-template').html());

    this.maps = options.maps;
  },

  render: function() {
    var that = this;

    this.$el.html(this.template());

    this.maps.onEach(function(map) {
      that.addMapToList(map);
    });

    return this;
  },

  addMapToList: function(map) {
    var view = new MapView({model: map}).render(),
        that = this;

    view.on('mapClick', function() {
      that.trigger('mapClick', map);
    });

    view.on('refreshed', function() {
      that.$el.hide().fadeIn('fast');
    })

    this.$('ul').append(view.el);
  },

  newMap: function(e) {

    var that = this;

    e.preventDefault();

    if (!this.addingNew) {
      this.addingNew = true;

      var view = new NewMapView();
      this.$('ul').before(view.render().el);

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
  }

});

module.exports = MapsListView;