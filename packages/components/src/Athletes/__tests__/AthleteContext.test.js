/* eslint-disable jest/no-mocks-import */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockSquadAthletes from '../__mocks__/squadAthletes';
import { AthleteProvider, AthleteContext } from '../components/AthleteContext';
import { EMPTY_SELECTION } from '../constants';

describe('Athletes | AthleteContext', () => {
  describe('<AthleteProvider />', () => {
    it('sets the squadAthletes context value when passed props', async () => {
      const providerValue = [
        {
          ...EMPTY_SELECTION,
          squads: [2],
        },
      ];
      const onChangeCallback = jest.fn();
      render(
        <AthleteProvider
          squadAthletes={mockSquadAthletes.squads}
          value={providerValue}
          onChange={onChangeCallback}
        >
          <AthleteContext.Consumer>
            {({ squadAthletes, value, onChange }) => (
              <>
                <div data-testid="squadAthletes">
                  {JSON.stringify(squadAthletes)}
                </div>
                <div data-testid="value">{JSON.stringify(value)}</div>
                <button
                  type="button"
                  onClick={() => onChange([{ ...value[0], positions: [2] }])}
                >
                  A button
                </button>
              </>
            )}
          </AthleteContext.Consumer>
        </AthleteProvider>
      );

      expect(screen.getByTestId('squadAthletes')).toHaveTextContent(
        JSON.stringify(mockSquadAthletes.squads)
      );
      expect(screen.getByTestId('value')).toHaveTextContent(
        JSON.stringify(providerValue)
      );

      expect(onChangeCallback).toHaveBeenCalledTimes(0);

      await userEvent.click(screen.getByRole('button', { name: 'A button' }));

      expect(onChangeCallback).toHaveBeenCalledTimes(1);
      expect(onChangeCallback).toHaveBeenCalledWith([
        { ...providerValue[0], positions: [2] },
      ]);
    });
  });
});
