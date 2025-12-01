import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useSelector } from 'react-redux';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import CSVImporter from '..';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('<CSVImporter />', () => {
  const i18nT = i18nextTranslateStub();

  const props = {
    type: IMPORT_TYPES.GrowthAndMaturation,
    t: i18nT,
  };

  beforeEach(() => {
    useSelector.mockReturnValue(true);
  });

  const renderComponent = (importType = props.type) =>
    renderWithRedux(<CSVImporter {...props} type={importType} />, {
      massUploadSlice: { massUploadModal: { isOpen: true } },
    });

  describe('MassUploadModal', () => {
    it('renders the mass upload modal', async () => {
      renderComponent();
      expect(screen.getByTestId('Modal|Title')).toHaveTextContent(
        'Import a growth and maturation assessment file'
      );
    });

    it('renders the mass upload modal with different title text if userType is baselines', async () => {
      renderComponent(IMPORT_TYPES.Baselines);
      expect(screen.getByTestId('Modal|Title')).toHaveTextContent(
        'Import a Khamis-Roche baseline file'
      );
    });
  });
});
