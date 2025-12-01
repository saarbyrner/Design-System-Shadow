import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import * as redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import AthletesListContainer from '../AthletesList';

jest.mock('@kitman/common/src/hooks/useLocationSearch');

describe('AthletesListContainer', () => {
  let useDispatchSpy;
  let mockDispatch;
  const athletes = [
    { id: 2, firstname: 'John', lastname: 'Doe' },
    { id: 3, firstname: 'Jane', lastname: 'Doe' },
  ];
  const expectedAction = {
    type: 'SELECT_ATHLETE',
  };

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
    useLocationSearch.mockReturnValue(new URLSearchParams());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = () => {
    render(
      <Provider
        store={storeFake({
          athletes,
        })}
      >
        <AthletesListContainer />
      </Provider>
    );
  };
  it('renders the athletes', () => {
    renderComponent();
    const athleteList = screen.getByRole('list');
    expect(athleteList.childElementCount).toEqual(2);
  });

  it('selects the first athlete on mount', () => {
    renderComponent();

    expect(mockDispatch).toHaveBeenCalledWith({
      ...expectedAction,
      payload: {
        athleteId: athletes[0].id,
      },
    });
  });

  it('selects the athlete that has the id in the search params on mount', () => {
    useLocationSearch.mockReturnValue(new URLSearchParams({ athleteId: '3' }));
    renderComponent();
    expect(mockDispatch).toHaveBeenCalledWith({
      ...expectedAction,
      payload: {
        athleteId: athletes[1].id,
      },
    });
  });

  it('updates the selected athlete when clicking an athlete', async () => {
    const user = userEvent.setup();
    renderComponent();
    const [, athlete2] = screen.getByRole('list').childNodes;

    await user.click(athlete2);
    expect(mockDispatch).toHaveBeenCalledWith({
      ...expectedAction,
      payload: {
        athleteId: athletes[1].id,
      },
    });
  });
});
