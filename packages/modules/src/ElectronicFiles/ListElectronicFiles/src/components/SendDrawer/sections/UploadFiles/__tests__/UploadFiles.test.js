import { render, screen } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import { setI18n } from 'react-i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import {
  imageFileTypes,
  textFileTypes,
  docFileTypes,
  spreadsheetFileTypes,
  presentationFileTypes,
} from '@kitman/common/src/utils/mediaHelper';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import UploadFiles from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer/sections/UploadFiles';

setI18n(i18n);

const mockHandleAddFile = jest.fn();
const filePondRef = {
  current: {
    getFiles: () => [],
  },
};
const props = {
  filePondRef,
  handleAddFile: mockHandleAddFile,
  t: i18nextTranslateStub(),
};

const store = storeFake({
  sendDrawerSlice: mockState.sendDrawerSlice,
});

const renderComponent = () =>
  render(
    <Provider store={store}>
      <UploadFiles {...props} />
    </Provider>
  );

describe('UploadFiles section', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('From your computer')).toBeInTheDocument();

    const uploadField = document.querySelector('.filepond--wrapper input');

    expect(uploadField).toBeInTheDocument();
    expect(uploadField.accept).toEqual(
      [
        ...imageFileTypes,
        ...textFileTypes,
        ...docFileTypes,
        ...spreadsheetFileTypes,
        ...presentationFileTypes,
      ].join(',')
    );
    expect(uploadField.type).toEqual('file');
    expect(uploadField.multiple).toEqual(true);
  });
});
