/* eslint-disable func-names */
const setColour = (colourPickerSelect, colourPickerElement, colourId) => {
  // set active
  colourPickerSelect.val(colourId);
  colourPickerElement.find('div.urineColours__square').removeClass('active');
  colourPickerElement
    .find(`div[data-hydration-id="${colourId}"]`)
    .addClass('active');
};

const initColourPicker = () => {
  $('select.colour_select').each(function () {
    const colourPickerSelect = $(this);
    // Add the urineColours container
    const colourPickerElement = $(
      '<div class="urineColours"></div>'
    ).insertAfter(colourPickerSelect);

    // Hide the input select
    colourPickerSelect.hide();

    // Add the squares
    colourPickerSelect.find('option').each(function () {
      if (this.value === '') {
        return;
      }

      const colourSquare = `<div class="urineColours__square" data-hydration-id="${this.value}" style="background:${this.text}"></div>`;
      colourPickerElement.append(colourSquare);
    });

    // Add the click handlers on the squares
    colourPickerElement.find('.urineColours__square').each(function () {
      $(this).on('click', function () {
        const colourId = $(this).attr('data-hydration-id');
        setColour(colourPickerSelect, colourPickerElement, colourId);
      });
    });

    // If there is a preselected colour, set the preselected colour to the colour picker
    const colourVal = colourPickerSelect.val();
    if (colourVal) {
      setColour(colourPickerSelect, colourPickerElement, colourVal);
    }
  });
};

export default initColourPicker;
