import qq from 'fine-uploader';
import i18n from '@kitman/common/src/utils/i18n';

export default () => {
  // File Upload when editing a training session or a game
  $(document).ready(() => {
    $('#km-modal').on('show.bs.modal', () => {
      const uploadFileRootElement = document.getElementById('upload_file_form');
      if (uploadFileRootElement) {
        const uploadHandlerPath =
          uploadFileRootElement.dataset.uploadHandlerPath;
        const debugFineUploader = uploadFileRootElement.dataset.debug;
        const redirectPath = uploadFileRootElement.dataset.redirectPath;

        const uploader = new qq.FineUploader({
          element: document.getElementById('bootstrapped-fine-uploader'),
          request: {
            endpoint: uploadHandlerPath,
            params: {
              authenticity_token: $('input[name=authenticity_token]').val(),
            },
          },
          validation: {
            allowedExtensions: ['csv', 'xlsx'],
            acceptFiles: ['csv', 'xlsx'],
            sizeLimit: 99999999,
            itemLimit: 1,
          },
          failedUploadTextDisplay: {
            mode: 'custom',
            maxChars: 200,
            responseProperty: 'error',
            enableTooltip: true,
          },
          classes: {
            success: 'alert alert-success',
            fail: 'alert alert-error',
          },
          debug: debugFineUploader,
          multiple: false,
          messages: {
            onLeave: i18n.t(
              'File still uploading. Are you sure you want to quit?'
            ),
            tooManyItemsError: i18n.t(
              'You can only upload one data file per event'
            ),
            typeError: i18n.t('Invalid file type.'),
          },
          callbacks: {
            onComplete: (id, fileName, responseJSON) => {
              if (responseJSON.success) {
                $('#uploaded_file_name').val(responseJSON.uploadName);
                $('#error').hide();
                $('.qq-upload-button').hide();
                $('#file_group label').html(
                  `<strong>${i18n.t(
                    'File verified. Click upload to complete.'
                  )}</strong>`
                );
              }
            },
            onSubmit: () => {
              $('#error').hide();
              return true;
            },
            onError: (event, id, name) => {
              $('#error-message').html(`<p>${name}</p>`);
              $('#error').show();
              $('.qq-upload-button').show();
              $('#file_group label').html(
                `<strong>${i18n.t(
                  'Please select a data file for this event.'
                )}</strong>`
              );
              uploader.cancelAll();
            },
          },
          showMessage: () => {
            // Don't show error alert - handled by onError above
          },
        });

        const getErrorHtml = (data) => {
          if (typeof data.errors !== 'undefined' && data.errors.length) {
            let html = '<ul>';
            for (let i = 0; i < data.errors.length; i++) {
              html += `<li>${data.errors[i]}</li>`;
            }
            html += `</ul><p>${i18n.t(
              'Please correct these errors or contact Kitman Labs for support'
            )}</p>`;
            $('#error-message').html(html);
          } else {
            $('#error-message').html(
              `<p>${i18n.t('Contact Kitman Labs support for assistance')}</p>`
            );
          }
        };

        $('#upload_file_form')
          .on('ajax:before', () => {
            $('#loader').show();
            $('input[type="submit"]').attr('disabled', 'yes');
          })
          .on('ajax:success', (xhr, data) => {
            if (data.success === true) {
              location.replace(redirectPath); // eslint-disable-line no-restricted-globals
            } else {
              uploader.reset();
              $('#uploaded_file_name').val('');
              $('#error').show();
              $('#loader').hide();
              $('input[type="submit"]').removeAttr('disabled');

              getErrorHtml(data);

              $('.qq-upload-button').show();
              $('#file_group label').html(
                `<strong>${i18n.t(
                  'Select a single data file for this event'
                )}</strong>`
              );
            }
          });
      }
    });
  });
};
