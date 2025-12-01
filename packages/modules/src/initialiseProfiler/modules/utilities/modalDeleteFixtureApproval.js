export default () => {
  /**
   * Adds a string as content to a DOM element.
   *
   * @param targetEl - DOM element to add the content to
   * @param data {string} - string to be added as content
   */
  const addTextToEl = (targetEl, data) => {
    targetEl.html(data.content);
  };

  /**
   * Sets the data-deletepath property of the button.
   *
   * @param btn - Button element that gets the property
   * @param data {Object} - Object containing attributes of the delete link in the table row
   */
  const setBtnPathProperty = (btn, data) => {
    btn.attr('href', data.deletePath);
  };

  /**
   * Adds the appropriate content to the modal.
   *
   * @param data {Object} - Object containing attributes of the delete link in the table row
   */
  const setupModalContent = (data) => {
    const $modalContent = $('#deleteConfirmModal .modal-body p');
    const $modalDeleteBtn = $(
      '#deleteConfirmModal .js-btn-modal-delete-fixture'
    );
    addTextToEl($modalContent, data);
    setBtnPathProperty($modalDeleteBtn, data);
  };

  /**
   * Gets the related data of the record that is being clicked to delete.
   *
   * @param data {Object} - Object containing attributes of the delete link in the table row
   */
  const getRecordData = (data) => {
    const deleteLinkAttr = data;
    // Do not use arrow function here, $(this) must refer to the clicked button.
    // eslint-disable-next-line func-names
    $('#fixtures .js-delete-fixture').on('click', function () {
      deleteLinkAttr.deletePath = $(this).attr('data-deletepath');
      deleteLinkAttr.content = $(this).attr('data-content');
    });
  };

  /**
   * Handles the modal show event.
   *
   * @param data {Object} - Object containing attributes of the delete link in the table row
   */
  const onModalShow = (data) => {
    $('#deleteConfirmModal').on('show.bs.modal', () => {
      setupModalContent(data);
    });
  };

  /**
   * Runs after the rails content is already parsed on the page.
   */
  $(document).ready(() => {
    const attrData = {};
    getRecordData(attrData);
    onModalShow(attrData);
  });
};
