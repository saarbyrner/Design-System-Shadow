import dialogues from '../dialogues';

describe('For dialogues state', () => {
  it('shows the dialogue based on an unique id', () => {
    const dialogueKey = 'keyname_123';
    const initialState = {};

    const action = {
      type: 'SHOW_DIALOGUE',
      payload: {
        dialogue: dialogueKey,
      },
    };

    const nextState = dialogues(initialState, action);
    expect(nextState).toEqual({
      [dialogueKey]: true,
    });
  });

  it('hides the dialogue', () => {
    const initialState = {
      keyname_123: true,
    };

    const action = {
      type: 'HIDE_DIALOGUE',
    };

    const nextState = dialogues(initialState, action);
    expect(nextState).toEqual({});
  });
});
