import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import Toasts from '@kitman/modules/src/Toasts';
import { rest, server } from '@kitman/services/src/mocks/server';
import { data as squadAthletesData } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import { useFetchExportableElementsQuery } from '@kitman/services/src/services/exports/generic';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import { useGetSquadAthletesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as exportableFieldsData } from '@kitman/services/src/services/exports/generic/redux/services/mocks/data/fetchExportableElements';
import { ExportSidePanelTranslated as ExportSidePanel } from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetSquadAthletesQuery: jest.fn(),
}));

jest.mock('@kitman/services/src/services/exports/generic', () => ({
  ...jest.requireActual('@kitman/services/src/services/exports/generic'),
  useFetchExportableElementsQuery: jest.fn(),
}));

describe('<ExportSidePanel />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
    handleOnClosePanel: jest.fn(),
  };
  const localState = {
    humanInputSlice: {
      exportSidePanel: {
        isOpen: true,
        form: {
          ids: [2, 3],
          filename: 'export',
          fields: [],
        },
      },
    },
    genericExportsSlice: {
      exportableFields: exportableFieldsData,
    },
    toastsSlice: {
      value: [],
    },
  };

  beforeEach(() => {
    window.featureFlags['form-based-athlete-profile'] = true;

    useGetSquadAthletesQuery.mockReturnValue({
      data: squadAthletesData,
      error: false,
      isLoading: false,
    });

    useFetchExportableElementsQuery.mockReturnValue({
      data: exportableFieldsData,
      error: false,
      isLoading: false,
    });
  });

  it('renders content of the export side panel', () => {
    renderWithProviders(
      <>
        <ExportSidePanel {...props} isOpen />
        <Toasts />
      </>,
      {
        preloadedState: {},
      }
    );

    // Length 2 due to same Panel title and button
    expect(screen.queryAllByText('Export')).toHaveLength(2);
    expect(screen.getByLabelText('Squad/Roster')).toBeInTheDocument();
    expect(screen.getByLabelText('File name')).toBeInTheDocument();
    expect(screen.getByLabelText('Columns')).toBeInTheDocument();
  });

  it('test export button is enabled when feature flag is on', () => {
    renderWithProviders(<ExportSidePanel {...props} isOpen />, {
      preloadedState: {
        ...localState,
        humanInputSlice: {
          exportSidePanel: {
            isOpen: true,
            form: {
              ids: [2, 3],
              filename: 'export',
              fields: [{ object: 'athlete', field: 'first_name' }],
            },
          },
        },
      },
    });

    expect(screen.getByRole('button', { name: 'Export' })).toBeEnabled();
  });

  it('test export button is disabled when feature flag is on and no columns or athletes are selected', () => {
    renderWithProviders(<ExportSidePanel {...props} isOpen />, {
      preloadedState: {
        ...localState,
        humanInputSlice: {
          exportSidePanel: {
            isOpen: true,
            form: {
              ids: [],
              filename: '',
              fields: [],
            },
          },
        },
      },
    });

    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });

  it('test export button is disabled when feature flag is off', () => {
    window.featureFlags['form-based-athlete-profile'] = false;

    renderWithProviders(<ExportSidePanel {...props} isOpen />, {
      preloadedState: {},
    });

    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });

  it('renders success toast when export button is clicked', async () => {
    renderWithProviders(
      <>
        <ExportSidePanel {...props} isOpen />
        <Toasts />
      </>,
      {
        preloadedState: localState,
      }
    );

    // Length 2 due to same Panel title and button
    expect(screen.queryAllByText('Export')).toHaveLength(2);
    expect(screen.getByLabelText('Squad/Roster')).toBeInTheDocument();
    expect(screen.getByLabelText('File name')).toBeInTheDocument();
    expect(screen.getByLabelText('Columns')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Columns'));

    await userEvent.click(screen.getByText('EHIC expiry date'));

    const exportButton = screen.getByRole('button', { name: 'Export' });

    expect(exportButton).toBeEnabled();

    await userEvent.click(exportButton);

    expect(
      screen.getByText('Player data exported successfully')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Unable to export data. Try again')
    ).not.toBeInTheDocument();
  });

  it('renders error toast when export button is clicked and the endpoint returns an error', async () => {
    server.use(
      rest.post('/administration/athletes/export_profile', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithProviders(
      <>
        <ExportSidePanel {...props} isOpen />
        <Toasts />
      </>,
      {
        preloadedState: localState,
      }
    );

    // Length 2 due to same Panel title and button
    expect(screen.queryAllByText('Export')).toHaveLength(2);
    expect(screen.getByLabelText('Squad/Roster')).toBeInTheDocument();
    expect(screen.getByLabelText('File name')).toBeInTheDocument();
    expect(screen.getByLabelText('Columns')).toBeInTheDocument();

    selectEvent.openMenu(screen.getByLabelText('Columns'));

    await userEvent.click(screen.getByText('EHIC expiry date'));

    const exportButton = screen.getByRole('button', { name: 'Export' });

    expect(exportButton).toBeEnabled();

    await userEvent.click(exportButton);

    expect(
      screen.getByText('Unable to export data. Try again')
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Player data exported successfully')
    ).not.toBeInTheDocument();
  });
});
