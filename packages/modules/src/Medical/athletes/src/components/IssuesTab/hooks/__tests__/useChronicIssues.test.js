import $ from 'jquery';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import moment from 'moment-timezone';
import sinon from 'sinon';
import { data } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import addIssuePanelReducer from '@kitman/modules/src/Medical/rosters/src/redux/reducers/addIssuePanel';

import useChronicIssues from '../useChronicIssues';

describe('useChronicIssues', () => {
  const store = createStore(
    combineReducers({
      addIssuePanel: addIssuePanelReducer,
    }),
    {
      addIssuePanel: getDefaultAddIssuePanelStore(),
    }
  );

  beforeEach(() => {
    window.featureFlags['chronic-conditions-resolution'] = true;
    moment.tz.setDefault('UTC');

    sinon
      .stub($, 'ajax')
      .withArgs(
        sinon.match({
          url: '/athletes/1/chronic_issues/search?grouped_response=true',
        })
      )
      .returns($.Deferred().resolveWith(null, [data.groupedChronicIssues]));
  });

  afterEach(() => {
    window.featureFlags['chronic-conditions-resolution'] = false;
    moment.tz.setDefault();
    $.ajax.restore();
  });

  it('returns the expected data when mounting the hook', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => {
        return useChronicIssues(1);
      },
      {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }
    );

    expect(result.current.athleteChronicIssues).toEqual([]);
    expect(result.current.athleteClosedChronicIssues).toEqual([]);
    await waitForNextUpdate();
    expect(result.current.athleteChronicIssues).toEqual(
      data.groupedChronicIssues.active_chronic_issues
    );
    expect(result.current.athleteClosedChronicIssues).toEqual(
      data.groupedChronicIssues.resolved_chronic_issues
    );
  });
});
