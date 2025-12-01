/* eslint-disable func-names */
export default class FormInteractive {
  constructor(path) {
    this.path = path;
  }

  start() {
    const form = this;
    $('.interactiveForm')
      .find('.interactiveField')
      // eslint-disable-next-line array-callback-return
      .map(function () {
        form.createInteractiveField(this);
      });
  }

  createInteractiveTextField(field) {
    const form = this;
    $(field).on('keyup', () => {
      if (field.value.length > 2 || field.value.length === 0) {
        setTimeout(form.startSearch(), 1500);
      }
    });
  }

  createInteractiveDefaultField(field) {
    const form = this;
    $(field).on('change', () => {
      form.startSearch();
    });
  }

  createInteractiveField(field) {
    switch (field.type) {
      case 'text':
        this.createInteractiveTextField(field);
        break;
      default:
        this.createInteractiveDefaultField(field);
        break;
    }
  }

  startSearch() {
    $.ajax({
      url: this.path,
      dataType: 'json',
      type: 'GET',
      cache: false,
      data: this.getValues(),
      complete: function (response) {
        $(this.targetBlock()).html(response.responseText);
      }.bind(this),
    });
  }

  getValues() {
    const values = {};
    $('.interactiveField').each(function () {
      values[this.id] = this.value;
    });
    return values;
  }

  targetBlock() {
    return `#${$('form.interactiveForm').first().data('target')}`;
  }
}
