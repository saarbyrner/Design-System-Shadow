import { render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  imageFileTypes,
  textFileTypes,
  docFileTypes,
  spreadsheetFileTypes,
  presentationFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import FilePondInstance from '@kitman/modules/src/ElectronicFiles/shared/components/FilePondInstance';

const mockOnAddFile = jest.fn();
const filePondRef = {
  current: {
    getFiles: () => [],
  },
};
const props = {
  filePondRef,
  acceptedFileTypes: [
    ...imageFileTypes,
    ...textFileTypes,
    ...docFileTypes,
    ...spreadsheetFileTypes,
    ...presentationFileTypes,
  ],
  onAddFile: mockOnAddFile,
  t: i18nextTranslateStub(),
};

const renderComponent = () => render(<FilePondInstance {...props} />);

describe('<FilePondInstance/>', () => {
  it('renders correctly', () => {
    renderComponent();

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(uploadField).toBeInTheDocument();
    expect(uploadField.accept).toEqual(props.acceptedFileTypes.join(','));
    expect(uploadField.type).toEqual('file');
    expect(uploadField.multiple).toEqual(true);
  });
});
