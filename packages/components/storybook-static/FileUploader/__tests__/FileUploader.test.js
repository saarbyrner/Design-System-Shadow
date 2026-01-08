import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import i18n from '@kitman/common/src/utils/i18n';
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
  onUpdateAttachment: jest.fn(),
  onDeleteAttachment: jest.fn(),
};

describe('FileUploader', () => {
  it('renders correctly', () => {
    renderWithRedux(<FileUploader {...props} />);

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(uploadField).toBeInTheDocument();
    expect(uploadField.accept).toEqual(
      'image/jpeg,image/jpg,image/png,image/gif,image/tiff,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/rtf,application/rtf,text/csv,application/dicom'
    );
    expect(uploadField.type).toEqual('file');
    expect(uploadField.multiple).toEqual(false);
  });
});
