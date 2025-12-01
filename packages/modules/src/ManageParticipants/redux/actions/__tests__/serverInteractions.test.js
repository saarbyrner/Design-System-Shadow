import $ from 'jquery';

import {
  saveParticipationFormLoading,
  saveParticipationFormFailure,
  saveParticipationFormSuccess,
  saveParticipationForm,
} from '../serverInteractions';

jest.mock('jquery');

const mockLocation = () => {
  const location = window.location;
  delete window.location;
  window.location = { ...location, href: '' };
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: '',
  });
};

describe('serverInteractions actions', () => {
  beforeAll(() => {
    mockLocation();
  });

  afterEach(() => {
    $.ajax.mockClear();
  });

  it('has the correct action SAVE_PARTICIPATION_FORM_LOADING', () => {
    const expectedAction = {
      type: 'SAVE_PARTICIPATION_FORM_LOADING',
    };

    expect(saveParticipationFormLoading()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_PARTICIPATION_FORM_FAILURE', () => {
    const expectedAction = {
      type: 'SAVE_PARTICIPATION_FORM_FAILURE',
    };

    expect(saveParticipationFormFailure()).toEqual(expectedAction);
  });

  it('has the correct action SAVE_PARTICIPATION_FORM_SUCCESS', () => {
    const expectedAction = {
      type: 'SAVE_PARTICIPATION_FORM_SUCCESS',
    };

    expect(saveParticipationFormSuccess()).toEqual(expectedAction);
  });

  describe('When saving the participant form', () => {
    const participantForm = {
      event: {
        type: 'GAME',
        id: '123',
        name: 'Carlow 1 - 2 Dublin',
        rpe_collection_kiosk: true,
        rpe_collection_athlete: true,
        mass_input: true,
      },
      participants: [
        {
          athlete_id: 1,
          athlete_fullname: 'John Doe',
          rpe: 5,
          duration: 30,
          squads: [73, 8, 262],
          participation_level_id: 1,
          include_in_group_calculations: true,
        },
      ],
    };

    it('sends the correct request and dispatches the correct action', async () => {
      const mockPromise = {
        done: jest.fn((cb) => {
          cb();
          return mockPromise;
        }),
        fail: jest.fn(() => mockPromise),
      };
      $.ajax.mockReturnValue(mockPromise);

      const dispatcher = jest.fn();
      const getState = jest.fn(() => ({
        participantForm,
      }));

      saveParticipationForm()(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith(saveParticipationFormLoading());
      expect($.ajax).toHaveBeenCalledWith({
        method: 'POST',
        url: '/workloads/game_modal/123/participants',
        contentType: 'application/json',
        data: JSON.stringify({
          event: {
            rpe_collection_kiosk: true,
            rpe_collection_athlete: true,
            mass_input: true,
          },
          participants: [
            {
              athlete_id: 1,
              rpe: 5,
              duration: 30,
              participation_level_id: 1,
              include_in_group_calculations: true,
            },
          ],
        }),
      });
      expect(mockPromise.done).toHaveBeenCalled();
      expect(dispatcher).toHaveBeenCalledWith(saveParticipationFormSuccess());
      expect(window.location.href).toBe('/workloads/games/123');
    });

    it('uses the correct endpoint when the event is a game', async () => {
      const mockPromise = {
        done: jest.fn((cb) => {
          cb();
          return mockPromise;
        }),
        fail: jest.fn(() => mockPromise),
      };
      $.ajax.mockReturnValue(mockPromise);

      const dispatcher = jest.fn();
      const getState = jest.fn(() => ({
        participantForm: {
          ...participantForm,
          event: {
            ...participantForm.event,
            type: 'GAME',
          },
        },
      }));

      saveParticipationForm()(dispatcher, getState);

      expect($.ajax.mock.calls[0][0].url).toBe(
        '/workloads/game_modal/123/participants'
      );
    });

    it('uses the correct endpoint when the event is a training session', async () => {
      const mockPromise = {
        done: jest.fn((cb) => {
          cb();
          return mockPromise;
        }),
        fail: jest.fn(() => mockPromise),
      };
      $.ajax.mockReturnValue(mockPromise);

      const dispatcher = jest.fn();
      const getState = jest.fn(() => ({
        participantForm: {
          ...participantForm,
          event: {
            ...participantForm.event,
            type: 'TRAINING_SESSION',
          },
        },
      }));

      saveParticipationForm()(dispatcher, getState);

      expect($.ajax.mock.calls[0][0].url).toBe(
        '/workloads/training_session_modal/123/participants'
      );
    });

    it('dispatches failure action when ajax call fails', async () => {
      const mockPromise = {
        done: jest.fn(() => mockPromise),
        fail: jest.fn((cb) => {
          cb();
          return mockPromise;
        }),
      };
      $.ajax.mockReturnValue(mockPromise);

      const dispatcher = jest.fn();
      const getState = jest.fn(() => ({
        participantForm,
      }));

      saveParticipationForm()(dispatcher, getState);

      expect(dispatcher).toHaveBeenCalledWith(saveParticipationFormLoading());
      expect(mockPromise.fail).toHaveBeenCalled();
      expect(dispatcher).toHaveBeenCalledWith(saveParticipationFormFailure());
    });
  });
});
