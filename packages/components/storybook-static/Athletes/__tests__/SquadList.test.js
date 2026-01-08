/* eslint-disable jest/no-mocks-import */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import mockSquadAthletes from '../__mocks__/squadAthletes';
import SquadList from '../components/SquadList';
import {
  MockedAthleteContextProvider,
  cleanUpAthleteContext,
} from './testUtils';

describe('Athletes | <SquadList />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  afterEach(() => {
    cleanUpAthleteContext();
  });

  it('renders a clickable option for every squad given to the squadAthletes', async () => {
    const onSquadClick = jest.fn();
    render(
      <MockedAthleteContextProvider
        athleteContext={{
          squadAthletes: mockSquadAthletes.squads,
          value: [],
          onChange: () => {},
        }}
      >
        <SquadList {...props} onSquadClick={onSquadClick} />
      </MockedAthleteContextProvider>
    );

    expect(screen.getAllByTestId('SquadList|Option')).toHaveLength(
      mockSquadAthletes.squads.length
    );

    expect(onSquadClick).toHaveBeenCalledTimes(0);

    await userEvent.click(screen.getAllByTestId('SquadList|Option')[3]);

    expect(onSquadClick).toHaveBeenCalledTimes(1);
    expect(onSquadClick).toHaveBeenCalledWith(mockSquadAthletes.squads[3].id);
  });
});
