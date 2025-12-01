import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import {
  storeFake,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import InjuryUploadModal from '@kitman/modules/src/AthleteAvailabilityList/src/components/InjuryUploadModal';

const mockUpdateFile = jest.fn();
const mockSaveUploadInjury = jest.fn();

const defaultProps = {
  isOpen: true,
  file: {
    lastModified: 1542706027020,
    lastModifiedDate: new Date('Nov 20 2018'),
    name: 'sample.csv',
    size: 124625,
    type: 'text/csv',
    webkitRelativePath: '',
  },
  updateFile: mockUpdateFile,
  saveUploadInjury: mockSaveUploadInjury,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(
    <Provider store={storeFake({ globalApi: {}, appStatus: { status: '' } })}>
      <InjuryUploadModal {...props} />
    </Provider>
  );

describe('<InjuryUploadModal />', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'Import Injuries', level: 4 })
    ).toBeInTheDocument();
  });

  describe('when a file is selected', () => {
    it('calls the correct callback', async () => {
      const user = userEvent.setup();

      renderComponent();

      const fileInput = document.querySelector(
        '[data-testid="InputFile"] input'
      );

      await user.upload(fileInput, new File(['foo'], 'foo.png'));

      expect(mockUpdateFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the upload button is clicked', () => {
    it('calls the correct callback', async () => {
      const user = userEvent.setup();

      renderComponent();

      await user.click(screen.getByRole('button', { name: 'Upload' }));

      expect(mockSaveUploadInjury).toHaveBeenCalledTimes(1);
    });
  });

  describe('when there is no file attached', () => {
    it('disables the upload button', () => {
      renderComponent({ ...defaultProps, file: null });

      expect(screen.getByRole('button', { name: 'Upload' })).toBeDisabled();
    });
  });
});
