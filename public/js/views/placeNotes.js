var PlaceNotesView = Backbone.View.extend({

  events: {
    "click button.edit": "edit",
    "mouseover": "showEditButton",
    "mouseout": "hideEditButton",
    "focusout textarea": "save"
  },

  initialize: function() {
    var that = this;

    this.template = _.template($('#place-notes-template').html());
    this.editTemplate = _.template($('#edit-place-notes-template').html());

    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {

    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  showEditButton: function() {
    this.$('.edit').show();
  },

  hideEditButton: function() {
    this.$('.edit').hide();
  },

  edit: function() {
    this.$el.html(this.editTemplate(this.model.toJSON()));
    this.$('textarea').focus();
  },

  save: function() {
    this.model.set({
      notes: this.$('textarea[name="notes"]').val()
    });

    this.render();
  }

});

module.exports = PlaceNotesView;