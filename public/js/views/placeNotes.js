var PlaceNotesView = Backbone.View.extend({

  events: {
    "click button.edit": "edit",
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",
    "focusout textarea": "save",
    "submit form": "submit"
  },

  initialize: function() {
    var that = this;

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    var html = new EJS({url:             
        '/templates/placeNotes'}).render(this.model.toJSON());

    this.$el.html(html);

    return this;
  },

  showEditButton: function() {
    this.$('.edit').show();
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  edit: function() {
    var html = new EJS({url:             
        '/templates/editPlaceNotes'}).render(this.model.toJSON());

    this.$el.html(html);
    this.$('textarea').focus();
  },

  submit: function(e) {
    e.preventDefault();
    this.save();
  },

  save: function() {
    this.model.set({
      notes: this.$('textarea[name="notes"]').val()
    });

    this.render();
  }

});

module.exports = PlaceNotesView;