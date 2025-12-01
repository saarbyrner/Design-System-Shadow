import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useFetchOrganisationPreferenceQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { bulkUpdateAthleteLabels } from '@kitman/services/src/services/dynamicCohorts';
import {
  useManageAthletes,
  ManageAthletesContextProvider,
  DEFAULT_CONTEXT_VALUE,
} from '../manageAthletesContext';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/services/src/services/dynamicCohorts');

const renderHookWithContext = () =>
  renderHook(() => useManageAthletes(), {
    wrapper: ({ children }) => (
      <Provider
        store={{
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }}
      >
        <ManageAthletesContextProvider>
          {children}
        </ManageAthletesContextProvider>
      </Provider>
    ),
  });

describe('ManageAthletesContextProvider', () => {
  beforeEach(() => {
    useFetchOrganisationPreferenceQuery.mockReturnValue({
      data: { isOptionalWorkersCompClaimPolicyNumber: false },
    });
    bulkUpdateAthleteLabels.mockImplementation(() => {
      return Promise.resolve({});
    });
  });
  const labelsToAdd = [1, 2, 3];
  const labelsToRemove = [4, 5, 6];
  it('has the default value for bulkUpdateLabel prop', async () => {
    let renderHookResult;
    act(() => {
      renderHookResult = renderHookWithContext();
    });

    // prevent act console warnings
    await renderHookResult.waitForNextUpdate();
    expect(renderHookResult.result.current).toHaveProperty('bulkUpdateLabels');
  });

  it('calls bulkUpdateAthleteLabels with the expected props', async () => {
    let renderHookResult;
    act(() => {
      renderHookResult = renderHookWithContext();
    });

    // prevent act console warnings
    await renderHookResult.waitForNextUpdate();
    expect(renderHookResult.result.current).toHaveProperty('bulkUpdateLabels');
    act(() => {
      renderHookResult.result.current.bulkUpdateLabels(
        labelsToAdd,
        labelsToRemove
      );
    });

    // prevent act console warnings
    await renderHookResult.waitForNextUpdate();
    expect(bulkUpdateAthleteLabels).toHaveBeenCalledWith({
      athleteIds: DEFAULT_CONTEXT_VALUE.selectedAthleteIds,
      labelsToAdd,
      labelsToRemove,
    });
  });
});
