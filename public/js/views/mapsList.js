var MapView = Backbone.View.extend({
  
  events: {
    "click .delete" : "onDeleteClick",
    "click .edit" : "onEditClick",
    "click a" : "onLinkClick",
    "submit form" : 'onSaveClick'
  },

  initialize: function() {
    this.listenTo(this.model, 'destroy', this.clear);
    this.listenTo(this.model, 'deleted', this.clear);
    this.listenTo(this.model, 'changed', this.render);
  },

  render: function() {
    // TODO: what if name is too long to fit?

    var html = new EJS({url:             
        '/templates/map'}).render(this.model.toJSON());

    this.setElement(html);
    return this;
  },

  clear: function() {
    this.$el.remove();
  },

  onDeleteClick: function(e) {
    e.preventDefault();
    this.model.delete();
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
    var html = new EJS({url:             
        '/templates/editMap'}).render(this.model.toJSON());

    this.$el.html(html);
  },

  save: function() {
    this.model.set({
      name : this.$('input[name="name"]').val()
    });
    this.render();
    this.trigger('refreshed');
  }
});

var NewMapView = Backbone.View.extend({
  events: {
    "click .save" : 'onSaveClick'
  },

  initialize: function(options) {
  },

  render: function() {
    var html = new EJS({url:             
        '/templates/newMap'}).render();

    this.$el.html(html);

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
    this.maps = options.maps;
  },

  render: function() {
    var that = this;

    var html = new EJS({url:             
        '/templates/mapsList'}).render();

    this.$el.html(html);

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

    this.$('tbody').append(view.el);
  },

  newMap: function(e) {

    var that = this;

    e.preventDefault();

    if (!this.addingNew) {
      this.addingNew = true;

      var view = new NewMapView();
      this.$('tbody').before(view.render().el);

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