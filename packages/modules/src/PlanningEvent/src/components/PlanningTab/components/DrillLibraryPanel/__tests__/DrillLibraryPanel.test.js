import { render, screen, within, waitFor, act } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import userEvent from '@testing-library/user-event';
import { data } from '@kitman/services/src/mocks/handlers/planning/searchDrills';
import { DrillLibraryPanelTranslated as DrillLibraryPanel } from '../DrillLibraryPanel';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('DrillLibraryPanel', () => {
  const props = {
    activityTypes: [
      {
        label: 'Warm up',
        value: 1,
      },
      {
        label: 'Training',
        value: 2,
      },
    ],
    addActivity: jest.fn(),
    createDrill: jest.fn(),
    drillFilters: {
      search_expression: '',
      principle_ids: [],
      event_activity_type_ids: [],
      user_ids: [],
    },
    drillLibrary: data.event_activity_drills,
    drillPrinciples: [
      {
        label: 'drillPrinciples 1',
        value: 1,
      },
      {
        label: 'drillPrinciples 2',
        value: 2,
      },
    ],
    getNextDrillLibraryItems: jest.fn(),
    isOpen: true,
    onClose: jest.fn(),
    requestStatus: 'SUCCESS',
    setDrillLibraryFilters: jest.fn(),
    staffMembers: [
      {
        label: 'staff member 1',
        value: 1,
      },
      {
        label: 'staff member 2',
        value: 2,
      },
    ],
    areCoachingPrinciplesEnabled: true,
  };
  let spy;
  beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'planningEvent-Slideout');
    document.body.appendChild(mockElement);
    spy.mockReturnValueOnce(mockElement);
  });

  it('DrillLibraryPanel renders correctly', async () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 640, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...props} />
      </VirtuosoMockContext.Provider>
    );
    const creators = screen.getByText('All creators');
    const allActs = screen.getByText('All activities');
    const allPrinciples = screen.getByText('All principles');
    // correctly displays the filters
    expect(screen.getByText('Add drill')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(creators).toBeInTheDocument();
    await userEvent.click(creators);
    expect(screen.getByTitle('staff member 1')).toBeInTheDocument();
    expect(screen.getByTitle('staff member 2')).toBeInTheDocument();
    expect(allActs).toBeInTheDocument();
    await userEvent.click(allActs);
    const activityTypeNames = screen.getAllByTestId(/(Training)|(Warm up)/i);
    expect(activityTypeNames.length).toBe(2);
    expect(
      within(activityTypeNames[0]).getByText('Warm up')
    ).toBeInTheDocument();
    expect(
      within(activityTypeNames[1]).getByText('Training')
    ).toBeInTheDocument();
    expect(allPrinciples).toBeInTheDocument();
    await userEvent.click(allPrinciples);
    expect(screen.getByTitle('drillPrinciples 1')).toBeInTheDocument();
    expect(screen.getByTitle('drillPrinciples 2')).toBeInTheDocument();

    // correctly displays drills
    const drills = screen.getAllByTestId('DrillLibrary|DrillTemplate');
    expect(drills).toHaveLength(data.event_activity_drills.length);

    expect(screen.getByText('Warm up')).toBeInTheDocument();
    expect(screen.getByText('Training')).toBeInTheDocument();

    expect(within(drills[0]).getByText('Berlin Marathon')).toBeInTheDocument();
    expect(within(drills[1]).getByText('Tokyo Marathon')).toBeInTheDocument();
    expect(
      within(drills[2]).getByText('Favorited Marathon 2')
    ).toBeInTheDocument();
    expect(within(drills[3]).getByText('Paris Marathon')).toBeInTheDocument();
    expect(within(drills[4]).getByText('NY Marathon')).toBeInTheDocument();
    expect(within(drills[5]).getByText('Siberia Marathon')).toBeInTheDocument();
    expect(
      within(drills[6]).getByText('Favorited Marathon 1')
    ).toBeInTheDocument();
  });

  it('correctly displays an error message', async () => {
    const errorProps = { ...props, requestStatus: 'FAILURE' };
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...errorProps} />
      </VirtuosoMockContext.Provider>
    );

    await waitFor(() =>
      expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    );
  });

  it('correctly displays no drills message', async () => {
    const noDrillProps = { ...props, drillLibrary: [] };
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...noDrillProps} />
      </VirtuosoMockContext.Provider>
    );

    await waitFor(() =>
      expect(
        screen.getByText('No drills in your library yet')
      ).toBeInTheDocument()
    );
  });

  it('buttons render the correct actions', async () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...props} />{' '}
      </VirtuosoMockContext.Provider>
    );
    const buttons = await screen.findAllByRole('button');
    await act(async () => {
      await userEvent.click(buttons[0]);
      expect(props.onClose).toHaveBeenCalled();
    });

    await act(async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Create drill' })
      );
      expect(props.createDrill).toHaveBeenCalled();
    });

    const drillItem = screen.getByText('Berlin Marathon');
    const drillContainer = drillItem.parentNode.parentNode;
    expect(drillContainer).toBeInTheDocument();
    await userEvent.click(
      within(drillContainer).getByTestId('DrillLibrary|DrillItem|PlusButton')
    );
    expect(props.addActivity).toHaveBeenCalled();
  });

  it('response to searching for an exercise', async () => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...props} />
      </VirtuosoMockContext.Provider>
    );
    const search = screen.getByPlaceholderText('Search');
    expect(search).toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, 'Tokyo Mara');
    expect(search).toHaveValue('Tokyo Mara');
    await waitFor(() => {
      expect(props.setDrillLibraryFilters).toHaveBeenCalled();
    });
  });

  const testFilter = async (name, option) => {
    render(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <DrillLibraryPanel {...props} />
      </VirtuosoMockContext.Provider>
    );
    await userEvent.click(screen.getByText(name));
    await userEvent.click(screen.getByTitle(option));
    await waitFor(() => {
      expect(props.setDrillLibraryFilters).toHaveBeenCalled();
    });
  };

  it('response to adding creator filter', async () => {
    await testFilter('All creators', 'staff member 1');
  });

  it('response to adding drill principle filter', async () => {
    await testFilter('All principles', 'drillPrinciples 1');
  });

  it('response to adding activities filter', async () => {
    await testFilter('All activities', 'Warm up');
  });
});
