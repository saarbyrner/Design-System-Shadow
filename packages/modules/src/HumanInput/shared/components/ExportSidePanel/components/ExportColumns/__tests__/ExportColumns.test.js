import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import selectEvent from 'react-select-event';
import { data } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';
import ExportColumns from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  value: [],
  onUpdate: jest.fn(),
};

const defaultStore = {
  genericExportsSlice: {
    exportableFields: data,
  },
};

describe('<ExportColumns/>', () => {
  it('renders with exportable columns as groups and options', async () => {
    renderWithProviders(<ExportColumns {...props} />, {
      preloadedState: defaultStore,
    });

    expect(screen.getByLabelText('Columns')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Columns'));

    expect(screen.getByText('Passport')).toBeInTheDocument();
    expect(screen.getByText('Passport number')).toBeInTheDocument();
    expect(screen.getByText('Passport name')).toBeInTheDocument();

    expect(screen.getByText('EHIC')).toBeInTheDocument();
    expect(
      screen.getByText('Has European Health Insurance (EHIC) card?')
    ).toBeInTheDocument();
    expect(
      screen.getByText('EHIC personal identification number')
    ).toBeInTheDocument();
    expect(screen.getByText('EHIC expiry date')).toBeInTheDocument();
  });
});
