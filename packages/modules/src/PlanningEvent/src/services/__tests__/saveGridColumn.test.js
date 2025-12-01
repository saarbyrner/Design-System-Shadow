import $ from 'jquery';
import { saveGridColumn, saveAssessmentGridColumn } from '../saveGridColumn';

describe('saveGridColumn', () => {
  let saveGridColumnRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveGridColumnRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await saveGridColumn(1, 'collections_tab', 'TestName', 'status', {
      variables: [{ source: 'kitman:tv', variable: 'Fatigue' }],
      summary: 'mean',
      period_length: 7,
    });

    expect(saveGridColumnRequest).toHaveBeenCalledTimes(1);
    expect(saveGridColumnRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/grid_columns',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab',
        columns: [
          {
            column_name: 'TestName',
            column_type: 'status',
            planning_status_definition: {
              variables: [{ source: 'kitman:tv', variable: 'Fatigue' }],
              summary: 'mean',
              period_length: 7,
            },
          },
        ],
      }),
    });
  });
});

describe('saveAssessmentGridColumn', () => {
  let saveAssessmentGridColumnRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveAssessmentGridColumnRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint when type is status', async () => {
    await saveAssessmentGridColumn(
      1,
      'collections_tab_assessment',
      'TestName',
      'status',
      {
        variables: [{ source: 'kitman:tv', variable: 'Fatigue' }],
        summary: 'mean',
        period_length: 7,
      },
      null,
      14669
    );

    expect(saveAssessmentGridColumnRequest).toHaveBeenCalledTimes(1);
    expect(saveAssessmentGridColumnRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/grid_columns',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab_assessment',
        assessment_group_id: 14669,
        columns: [
          {
            column_name: 'TestName',
            column_type: 'status',
            planning_status_definition: {
              variables: [{ source: 'kitman:tv', variable: 'Fatigue' }],
              summary: 'mean',
              period_length: 7,
            },
          },
        ],
      }),
    });
  });

  it('calls the correct endpoint when type is metric', async () => {
    await saveAssessmentGridColumn(
      1,
      'collections_tab_assessment',
      'TestName',
      'metric',
      {
        variables: [{ source: 'kitman:tv', variable: 'Fatigue' }],
        summary: 'mean',
        period_length: 7,
      },
      123,
      14669
    );

    expect(saveAssessmentGridColumnRequest).toHaveBeenCalledTimes(1);
    expect(saveAssessmentGridColumnRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/grid_columns',
      contentType: 'application/json',
      data: JSON.stringify({
        tab: 'collections_tab_assessment',
        assessment_group_id: 14669,
        columns: [
          {
            column_name: 'TestName',
            column_type: 'metric',
            training_variable_id: 123,
          },
        ],
      }),
    });
  });
});
