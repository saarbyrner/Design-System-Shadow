import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import { setupStore } from '@kitman/modules/src/AppRoot/store';

import { IMPORT_TYPES } from '../consts';
import useImportConfig from '../useImportConfig';

describe('useImportConfig', () => {
  const AppReduxWrapper = ({ children }) => (
    <Provider store={setupStore()}>{children}</Provider>
  );

  afterEach(() => {
    window.featureFlags = {};
  });

  it(`should return the correct config for ${IMPORT_TYPES.LeagueBenchmarking}`, () => {
    window.featureFlags = {
      'benchmark-testing': true,
      'performance-optimisation-imports': true,
    };
    const mockPermissions = {
      analysis: {
        benchmarkingTestingImportArea: { canView: true },
      },
    };
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.LeagueBenchmarking,
          permissions: mockPermissions,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });

  it(`should return the correct config for ${IMPORT_TYPES.TrainingVariablesAnswer}`, () => {
    window.featureFlags = {
      'training-variables-importer': true,
    };
    const mockPermissions = {};
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.TrainingVariablesAnswer,
          permissions: mockPermissions,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });

  it(`should return the correct config for ${IMPORT_TYPES.GrowthAndMaturation}`, () => {
    window.featureFlags = {
      'growth-and-maturation-area': true,
      'performance-optimisation-imports': true,
    };
    const mockPermissions = {
      analysis: {
        growthAndMaturationImportArea: {
          canView: true,
        },
      },
    };
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.GrowthAndMaturation,
          permissions: mockPermissions,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });

  it(`should return the correct config for ${IMPORT_TYPES.Baselines}`, () => {
    window.featureFlags = {
      'growth-and-maturation-area': true,
      'performance-optimisation-imports': true,
    };
    const mockPermissions = {
      analysis: {
        growthAndMaturationImportArea: {
          canView: true,
        },
      },
    };
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.Baselines,
          permissions: mockPermissions,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });

  it(`should return the correct config for ${IMPORT_TYPES.EventData}`, () => {
    window.setFlag('pac-calendar-events-imported-data-tab-in-mui', true);
    const mockPermissions = {
      workloads: {
        games: { canEdit: true },
        trainingSessions: { canEdit: true },
      },
    };
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.EventData,
          permissions: mockPermissions,
          eventId: 1,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });

  it(`should return the correct config for ${IMPORT_TYPES.KitMatrix}`, () => {
    window.featureFlags = {
      'league-ops-kit-management-v2': true,
    };
    const mockPermissions = {
      settings: {
        canCreateImports: true,
      },
    };
    const { result } = renderHook(
      () =>
        useImportConfig({
          importType: IMPORT_TYPES.KitMatrix,
          permissions: mockPermissions,
        }),
      { wrapper: AppReduxWrapper }
    );
    expect(result.current).toMatchSnapshot();
  });
});
