import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
import { Provider } from 'react-redux';
import { FileUploaderTranslated as FileUploader } from '@kitman/modules/src/StaffProfile/shared/components/DocumentsTab/Components/DocumentSidePanel/components/FileUploader';
import { setI18n } from 'react-i18next';

setI18n(i18n);

const mockSetFile = jest.fn();
const filePondRef = {
  current: {},
};
const props = {
  filePondRef,
  maxFiles: 1,
  disabled: false,
  setFile: mockSetFile,
  t: i18nextTranslateStub(),
};

const localState = {
  documentSidePanel: {
    isOpen: true,
    form: {},
  },
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const renderComponent = (state = localState) =>
  render(
    <Provider
      store={storeFake({
        documentsTabSlice: state,
      })}
    >
      <FileUploader {...props} />
    </Provider>
  );

describe('FileUploader', () => {
  it('renders correctly', () => {
    renderComponent();

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(uploadField).toBeInTheDocument();
    expect(uploadField.accept).toEqual(
      'image/jpeg,image/jpg,image/png,image/gif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/rtf,application/rtf,text/csv,application/dicom'
    );
    expect(uploadField.type).toEqual('file');
    expect(uploadField.multiple).toEqual(false);
  });
});
