import $ from 'jquery';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/rehab/createRehabSession';
import createRehabSession from '../rehab/createRehabSession';

describe('createRehabSession', () => {
  let createRehabSessionRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    createRehabSessionRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await createRehabSession(
      1,
      123,
      'injury',
      [],
      null,
      '2022-10-27T12:00:00.000+01:00',
      null,
      false
    );
    expect(returnedData).toEqual(serverResponse);

    expect(createRehabSessionRequest).toHaveBeenCalledTimes(1);
    expect(createRehabSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1,
        maintenance: false,
        exercise_instances: [],
        issue_type: 'injury',
        issue_id: 123,
        session_date: '2022-10-27T12:00:00.000+01:00',
      }),
    });
  });

  it('converts Emr::Private::Models::ChronicIssue issues to correct param value', async () => {
    const returnedData = await createRehabSession(
      1,
      123,
      'Emr::Private::Models::ChronicIssue',
      [],
      null,
      '2022-10-27T12:00:00.000+01:00',
      null,
      false
    );
    expect(returnedData).toEqual(serverResponse);

    expect(createRehabSessionRequest).toHaveBeenCalledTimes(1);
    expect(createRehabSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1,
        maintenance: false,
        exercise_instances: [],
        issue_type: 'chronic',
        issue_id: 123,
        session_date: '2022-10-27T12:00:00.000+01:00',
      }),
    });
  });

  it('converts ChronicIllness issues to correct param value', async () => {
    const returnedData = await createRehabSession(
      1,
      123,
      'ChronicIllness',
      [],
      null,
      '2022-10-27T12:00:00.000+01:00',
      null,
      false
    );
    expect(returnedData).toEqual(serverResponse);

    expect(createRehabSessionRequest).toHaveBeenCalledTimes(1);
    expect(createRehabSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1,
        maintenance: false,
        exercise_instances: [],
        issue_type: 'chronic',
        issue_id: 123,
        session_date: '2022-10-27T12:00:00.000+01:00',
      }),
    });
  });

  it('converts ChronicInjury issues to correct param value', async () => {
    const returnedData = await createRehabSession(
      1,
      123,
      'ChronicInjury',
      [],
      null,
      '2022-10-27T12:00:00.000+01:00',
      null,
      false
    );
    expect(returnedData).toEqual(serverResponse);

    expect(createRehabSessionRequest).toHaveBeenCalledTimes(1);
    expect(createRehabSessionRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/medical/rehab/session_exercises',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_id: 1,
        maintenance: false,
        exercise_instances: [],
        issue_type: 'chronic',
        issue_id: 123,
        session_date: '2022-10-27T12:00:00.000+01:00',
      }),
    });
  });
});
