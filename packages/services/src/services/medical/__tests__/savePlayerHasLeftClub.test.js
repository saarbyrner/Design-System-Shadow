import $ from 'jquery';
import { data as mockedPlayerAttributes } from '../../../mocks/handlers/medical/savePlayerHasLeftClub';
import savePlayerHasLeftClub from '../savePlayerHasLeftClub';

describe('savePlayerHasLeftClub', () => {
  let savePlayerHasLeftClubRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    deferred.resolveWith(null, [savePlayerHasLeftClub]);

    savePlayerHasLeftClubRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(savePlayerHasLeftClub));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value when the injury type is an illness', async () => {
    await savePlayerHasLeftClub({
      athleteId: mockedPlayerAttributes.athlete_id,
      issueOccurenceId: mockedPlayerAttributes.issueOccurenceId,
      issueType: 'Illness',
      playerHasLeftClub: true,
    });

    expect(savePlayerHasLeftClubRequest).toHaveBeenCalledTimes(1);
    expect(savePlayerHasLeftClubRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `/athletes/${mockedPlayerAttributes.athlete_id}/illnesses/${mockedPlayerAttributes.issueOccurenceId}/player_left_club?scope_to_org=true`,
      data: JSON.stringify({ player_left_club: true }),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
    });
  });

  it('calls the correct endpoint and returns the correct value when the injury type is an injury', async () => {
    await savePlayerHasLeftClub({
      athleteId: mockedPlayerAttributes.athlete_id,
      issueOccurenceId: mockedPlayerAttributes.issueOccurenceId,
      issueType: 'Injury',
      playerHasLeftClub: true,
    });

    expect(savePlayerHasLeftClubRequest).toHaveBeenCalledTimes(1);
    expect(savePlayerHasLeftClubRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: `/athletes/${mockedPlayerAttributes.athlete_id}/injuries/${mockedPlayerAttributes.issueOccurenceId}/player_left_club?scope_to_org=true`,
      data: JSON.stringify({ player_left_club: true }),
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
    });
  });
});
