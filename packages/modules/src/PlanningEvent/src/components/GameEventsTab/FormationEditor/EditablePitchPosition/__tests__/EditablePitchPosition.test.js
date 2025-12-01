import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import userEvent from '@testing-library/user-event';
import FormationEditorContext, {
  initialState,
} from '@kitman/modules/src/PlanningEvent/src/contexts/FormationEditorContext';
import { actionTypes } from '../../reducer';
import EditablePitchPosition from '..';

const mocks = {
  dispatch: jest.fn(),
};

const contextValue = {
  state: initialState,
  dispatch: mocks.dispatch,
  sport: 'soccer',
  formations: [],
  gameFormats: [],
};

const mockPositionData = {
  id: 123,
  position: {
    id: 84,
    abbreviation: 'GK',
  },
  x: 0,
  y: 2,
};

describe('EditablePitchPosition', () => {
  const renderComponent = ({ context, positionData } = {}) =>
    render(
      <DndContext>
        <FormationEditorContext.Provider value={context || contextValue}>
          <EditablePitchPosition
            cellId={positionData ? `${positionData.x}_${positionData.y}` : ''}
            positionData={positionData}
          />
        </FormationEditorContext.Provider>
      </DndContext>
    );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    renderComponent({ positionData: mockPositionData });
    expect(screen.getByText('GK')).toBeInTheDocument();
  });

  it('renders without position data', () => {
    renderComponent();
    expect(screen.queryByText('GK')).not.toBeInTheDocument();
  });

  it('selects the position on click', async () => {
    renderComponent({ positionData: mockPositionData });
    await userEvent.click(screen.getByText('GK'));
    expect(mocks.dispatch).toHaveBeenCalledWith({
      payload: '0_2',
      type: actionTypes.SET_ACTIVE_COORDINATE_ID,
    });
  });

  it('deselects an active position when clicked', async () => {
    renderComponent({
      positionData: mockPositionData,
      context: {
        ...contextValue,
        state: { ...contextValue.state, activeCoordinateId: '0_2' },
      },
    });
    await userEvent.click(screen.getByText('GK'));

    expect(mocks.dispatch).toHaveBeenCalledWith({
      payload: undefined,
      type: actionTypes.SET_ACTIVE_COORDINATE_ID,
    });
  });

  describe('with "show-position-view-ids" feature flag', () => {
    beforeEach(() => {
      window.featureFlags['show-position-view-ids'] = true;
    });
    afterEach(() => {
      window.featureFlags['show-position-view-ids'] = false;
    });
    it('shows the position view id', () => {
      renderComponent({
        positionData: mockPositionData,
        context: {
          ...contextValue,
          state: { ...contextValue.state, activeCoordinateId: '0_2' },
        },
      });

      expect(screen.getByText(123)).toBeInTheDocument();
    });
  });
});
