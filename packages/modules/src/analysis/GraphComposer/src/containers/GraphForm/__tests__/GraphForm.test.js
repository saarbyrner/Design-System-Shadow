import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import { GraphFormTranslated } from '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm';
import CreateGraphFormContainer from '..';

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm',
  () => {
    return {
      GraphFormTranslated: jest.fn(({ updateGraphFormType }) => (
        <button
          type="button"
          data-testid="update-button"
          onClick={() => updateGraphFormType('bar', 'longitudinal')}
        />
      )),
    };
  }
);

describe('CreateGraphForm Container', () => {
  let mockStore;
  let mockDispatch;

  const GraphFormType = 'line';
  const timePeriod = '';
  const dateRange = {};
  const metrics = [
    {
      status: blankStatus(),
    },
  ];
  const availableVariables = [];
  const turnaroundList = [];
  const canAccessMedicalGraph = true;

  const mockState = {
    GraphFormLongitudinal: {
      metrics,
      time_period: timePeriod,
      date_range: dateRange,
    },
    GraphFormType,
    GraphGroup: 'longitudinal',
    StaticData: {
      availableVariables,
      canAccessMedicalGraph,
      turnaroundList,
    },
  };

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockStore = {
      getState: () => mockState,
      subscribe: jest.fn(),
      dispatch: mockDispatch,
    };

    jest.clearAllMocks();
  });

  it('renders', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <CreateGraphFormContainer />
      </Provider>
    );

    expect(container).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    render(
      <Provider store={mockStore}>
        <CreateGraphFormContainer />
      </Provider>
    );

    expect(GraphFormTranslated).toHaveBeenCalledWith(
      expect.objectContaining({
        graphType: GraphFormType,
        canAccessMedicalGraph,
      }),
      {}
    );
  });

  it('sends the correct action when updateGraphFormType is called', () => {
    const newGraphType = 'bar';
    const newGraphGroup = 'longitudinal';
    const expectedAction = {
      type: 'UPDATE_GRAPH_FORM_TYPE',
      payload: {
        graphType: newGraphType,
        graphGroup: newGraphGroup,
      },
    };

    render(
      <Provider store={mockStore}>
        <CreateGraphFormContainer />
      </Provider>
    );

    const mockCall = GraphFormTranslated.mock.calls[0];
    const props = mockCall[0];

    props.updateGraphFormType(newGraphType, newGraphGroup);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
  });
});
