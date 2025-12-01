import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import { Provider } from 'react-redux';

import {
  useGetSquadAthletesQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  growthAndMaturationTemplateColumns,
  baselinesTemplateColumns,
  benchmarkingTemplateColumns,
} from '@kitman/modules/src/shared/MassUpload/utils';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useImportConfig from '@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import AddAthletesSidePanel from '../index';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/shared/MassUpload/New/utils/useImportConfig');
jest.mock('@kitman/common/src/hooks/useLocationAssign');
jest.mock('@kitman/common/src/hooks/useEventTracking');

const useCSVExportImport = jest.requireActual(
  '@kitman/common/src/hooks/useCSVExport'
);

describe('AddAthletesSidePanelCsvExporter', () => {
  const defaultProps = {
    isOpen: false,
    onClose: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const mockSquads = ['mockSquad1', 'mockSquad2'];

  const mockAthletes = [
    { lastName: 'A', id: '1' },
    { lastName: 'C', id: '2' },
    { lastName: 'B', id: '3' },
  ];

  const mockSquad = {
    squads: mockSquads.map((squad, index) => ({
      id: index + 1,
      name: squad,
      position_groups: [
        {
          id: index + 1,
          name: `Position Group ${index + 1}`,
          positions: [
            {
              id: index + 1,
              name: `Position ${index + 1}`,
              athletes: mockAthletes.map((athlete) => ({
                id: (Number.parseInt(athlete.id, 10) + index + 1) * (index + 1),
                firstname: 'Athlete',
                lastname: athlete.lastName,
                fullname: `Athlete ${athlete.lastName}`,
                user_id: `uid${Number.parseInt(athlete.id, 10) * (index + 1)}`,
              })),
            },
          ],
        },
      ],
    })),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    massUploadSlice: {
      addAthletesSidePanel: {
        isOpen: false,
      },
    },
  });

  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useGetSquadAthletesQuery.mockReturnValue({
      data: mockSquad,
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canCreateImports: 'true' } },
      isError: false,
      isLoading: false,
      isSuccess: true,
    });
    useLocationAssign.mockReturnValue(mockLocationAssign);
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderAndAwait = async (type = IMPORT_TYPES.GrowthAndMaturation) => {
    render(
      <Provider store={store}>
        <AddAthletesSidePanel {...defaultProps} isOpen importType={type} />
      </Provider>
    );
    expect(
      screen.getByText('Select athletes for template')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Athlete A')).toHaveLength(2);
    });
  };

  const renderComponentAndGenerateCsvTemplate = async (
    type,
    selectMultipleAthletes
  ) => {
    await renderAndAwait(type);

    expect(
      screen.getByText('Select athletes for template')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText('Athlete A')).toHaveLength(2);
    });

    if (selectMultipleAthletes) {
      fireEvent.click(screen.getAllByText('Athlete A')[1]);
      fireEvent.click(screen.getAllByText('Athlete B')[0]);
      fireEvent.click(screen.getAllByText('Athlete C')[0]);
    } else {
      fireEvent.click(screen.getAllByText('Athlete A')[0]);
    }

    expect(screen.getByText('Download').closest('button')).toBeEnabled();

    fireEvent.click(screen.getByText('Download').closest('button'));
  };

  it('should render as expected once isOpen is true', async () => {
    await renderAndAwait();
    expect(screen.getAllByRole('button').length).toEqual(5);
  });

  it('should disable Download button until an athlete has been selected', async () => {
    await renderAndAwait();

    expect(screen.getByText('Download').closest('button')).toHaveAttribute(
      'disabled'
    );

    fireEvent.click(screen.getAllByText('Athlete A')[0]);
    expect(screen.getByText('Download').closest('button')).toBeEnabled();
  });

  it('should open mass upload modal if outside of mui mass upload flow on click of download csv', async () => {
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    await renderComponentAndGenerateCsvTemplate();

    expect(mockDispatch).toHaveBeenLastCalledWith({
      payload: undefined,
      type: 'massUploadSlice/openMassUploadModal',
    });
  });

  it('should open mass upload modal if mui mass upload flow on click of download csv', async () => {
    useImportConfig.mockReturnValue({ enabled: true });
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    await renderComponentAndGenerateCsvTemplate();

    expect(mockLocationAssign).toHaveBeenCalledWith(
      '/mass_upload/growth_and_maturation'
    );
  });

  it('should call useCSVExport with growth and maturation mapped columns on click of Download and close side panel', async () => {
    const spy = jest.spyOn(useCSVExportImport, 'default');
    const todaysDate = moment().format('YYYY/MM/DD');

    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    await renderComponentAndGenerateCsvTemplate();

    await waitFor(() => {
      expect(spy).toHaveBeenLastCalledWith(
        `Growth-and-maturation-template-${todaysDate}`,
        [
          {
            athlete_id: 2,
            athlete_first_name: 'Athlete',
            athlete_last_name: 'A',
            date_measured: todaysDate,
            ...growthAndMaturationTemplateColumns,
          },
        ]
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'massUploadSlice/onCloseAddAthletesSidePanel',
    });
  });

  it('should call useCSVExport with baselines mapped columns on click of Download and close side panel', async () => {
    const spy = jest.spyOn(useCSVExportImport, 'default');
    const todaysDate = moment().format('YYYY/MM/DD');

    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    await renderComponentAndGenerateCsvTemplate(IMPORT_TYPES.Baselines);

    await waitFor(() => {
      expect(spy).toHaveBeenLastCalledWith(
        `KR-baseline-template-${todaysDate}`,
        [
          {
            athlete_id: 2,
            athlete_first_name: 'Athlete',
            athlete_last_name: 'A',
            ...baselinesTemplateColumns,
          },
        ]
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'massUploadSlice/onCloseAddAthletesSidePanel',
    });
  });

  it('should call useCSVExport with benchmarking mapped columns on click of Download and close side panel', async () => {
    const spy = jest.spyOn(useCSVExportImport, 'default');
    const todaysDate = moment().format('YYYY/MM/DD');

    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    await renderComponentAndGenerateCsvTemplate(
      IMPORT_TYPES.LeagueBenchmarking
    );

    await waitFor(() => {
      expect(spy).toHaveBeenLastCalledWith(
        `League-benchmarking-template-${todaysDate}`,
        [
          {
            athlete_id: 2,
            athlete_first_name: 'Athlete',
            athlete_last_name: 'A',
            squad: 'mockSquad1',
            date_of_test: todaysDate,
            ...benchmarkingTemplateColumns,
          },
        ]
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'massUploadSlice/onCloseAddAthletesSidePanel',
    });
  });

  it('should call useCSVExport with training variables answer mapped columns on click of Download and close side panel', async () => {
    const spy = jest.spyOn(useCSVExportImport, 'default');
    const todaysDate = moment().format('YYYY/MM/DD');

    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;

    await renderComponentAndGenerateCsvTemplate(
      IMPORT_TYPES.TrainingVariablesAnswer
    );

    await waitFor(() => {
      expect(spy).toHaveBeenLastCalledWith(
        `Data-importer-template-${todaysDate}`,
        [
          {
            id: 2,
            first_name: 'Athlete',
            last_name: 'A',
            time_measured: null,
            micro_cycle: null,
          },
        ]
      );
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: 'massUploadSlice/onCloseAddAthletesSidePanel',
    });
  });

  describe('data sorting', () => {
    it('should sort by squad, then by athlete_last_name if exists', async () => {
      const spy = jest.spyOn(useCSVExportImport, 'default');
      const todaysDate = moment().format('YYYY/MM/DD');

      const mockDispatch = jest.fn();
      store.dispatch = mockDispatch;

      await renderComponentAndGenerateCsvTemplate(
        IMPORT_TYPES.LeagueBenchmarking,
        true
      );

      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          `League-benchmarking-template-${todaysDate}`,
          // Sorted array of athletes in expected order
          [
            { id: '4', name: 'B', squad: '1' },
            { id: '3', name: 'C', squad: '1' },
            { id: '6', name: 'A', squad: '2' },
          ].map((athlete) => ({
            athlete_id: Number.parseInt(athlete.id, 10),
            athlete_first_name: 'Athlete',
            athlete_last_name: athlete.name,
            squad: `mockSquad${athlete.squad}`,
            date_of_test: todaysDate,
            ...benchmarkingTemplateColumns,
          }))
        );
      });
    });

    it('should sort by last_name if squad does not exist', async () => {
      const spy = jest.spyOn(useCSVExportImport, 'default');
      const todaysDate = moment().format('YYYY/MM/DD');

      const mockDispatch = jest.fn();
      store.dispatch = mockDispatch;

      await renderComponentAndGenerateCsvTemplate(
        IMPORT_TYPES.TrainingVariablesAnswer,
        true
      );

      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          `Data-importer-template-${todaysDate}`,
          // Sorted array of athletes in expected order
          [
            { id: '6', name: 'A' },
            { id: '4', name: 'B' },
            { id: '3', name: 'C' },
          ].map((user) => ({
            id: Number.parseInt(user.id, 10),
            first_name: 'Athlete',
            last_name: user.name,
            time_measured: null,
            micro_cycle: null,
          }))
        );
      });
    });

    it('should sort by athlete_last_name if squad and last_name does not exist', async () => {
      const spy = jest.spyOn(useCSVExportImport, 'default');
      const todaysDate = moment().format('YYYY/MM/DD');

      const mockDispatch = jest.fn();
      store.dispatch = mockDispatch;

      await renderComponentAndGenerateCsvTemplate(
        IMPORT_TYPES.GrowthAndMaturation,
        true
      );

      await waitFor(() => {
        expect(spy).toHaveBeenLastCalledWith(
          `Growth-and-maturation-template-${todaysDate}`,
          // Sorted array of athletes in expected order
          [
            { id: '6', name: 'A' },
            { id: '4', name: 'B' },
            { id: '3', name: 'C' },
          ].map((athlete) => ({
            athlete_id: Number.parseInt(athlete.id, 10),
            athlete_first_name: 'Athlete',
            athlete_last_name: athlete.name,
            date_measured: todaysDate,
            ...growthAndMaturationTemplateColumns,
          }))
        );
      });
    });
  });
});
