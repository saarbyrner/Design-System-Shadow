import i18n from '@kitman/common/src/utils/i18n';
import notify from '../utilities/notifications';

export default () => {
  // File Upload on the availability page
  $(document).ready(() => {
    $('#km-modal').on('show.bs.modal', () => {
      const uploadFileRootElement = document.getElementById(
        'availabilities_upload_file_form'
      );
      if (uploadFileRootElement) {
        const uploadBtn = document.getElementById(
          'availabilities_upload_button'
        );
        const inputFile = document.getElementById('availabilities_file_input');
        const fileNameEl = document.getElementById('availabilities_file_name');
        const submitBtn = document.getElementById(
          'availabilities_submit_button'
        );

        const hideModalDetails = () => {
          $('#loader').hide();
          $('#availabilities_upload_button').hide();
          $('#availabilities_file_name').hide();
          $('.modal-footer').hide();
        };

        const handleSkippedRowsError = (data) => {
          hideModalDetails();

          $('.modal-body').append(
            '<div class="modal__message modal__message--error">The uploaded file contains errors and cannot be processed, no data has been added.</div>'
          );
          $('.modal-body').append('<div class="import_log"></div>');

          $('.import_log').append(
            `<h6>${data.skipped_rows} of ${data.total_rows} rows contain errors.</h6>`
          );

          if (data.errors.length > 0) {
            data.errors.forEach((error) => {
              $('.import_log').append(`<h6>${error}</h6>`);
            });
          }
        };

        const handleRequestError = () => {
          hideModalDetails();

          $('.modal-body').append(
            '<div class="modal__message">An unexpected error has occurred. Please contact support.</div>'
          );
        };

        const handleRequestSuccess = (data) => {
          hideModalDetails();

          $('.modal-body').append(
            '<div class="modal__message modal__message--success">The uploaded file has been successfully processed, all data has been added.</div>'
          );

          $('.modal-body').append('<div class="import_log"></div>');

          $('.import_log').append(
            `<h6>${data.imported_rows} of ${data.total_rows} rows uploaded and available in the system.</h6>`
          );
        };

        const submitForm = () => {
          const formData = new FormData();
          formData.append('file', inputFile.files[0]);
          $.ajax({
            method: 'POST',
            url: '/athletes/availability/import_file',
            data: formData,
            contentType: false,
            processData: false,
            beforeSend: () => {
              $('#loader').show();
              submitBtn.disabled = true;
              uploadBtn.disabled = true;
            },
            success: (data) => {
              if (data.success === true) {
                handleRequestSuccess(data);
              } else {
                handleSkippedRowsError(data);
              }
            },
            error: () => {
              handleRequestError();
            },
          });
        };

        // When clicking the upload button, simulate click on the hidden input file
        uploadBtn.addEventListener('click', () => inputFile.click(), false);

        // When selecting a file, show the file name next to the upload button
        inputFile.addEventListener(
          'change',
          // eslint-disable-next-line func-names
          function () {
            fileNameEl.textContent = this.files[0].name;
          },
          false
        );

        // When clicking the submit button, submit the form
        submitBtn.addEventListener(
          'click',
          () => {
            if (inputFile.files.length === 0) {
              notify(
                i18n.t('Please select a file before uploading'),
                'warning'
              );
              return;
            }
            submitForm();
          },
          false
        );
      }
    });
  });
};
