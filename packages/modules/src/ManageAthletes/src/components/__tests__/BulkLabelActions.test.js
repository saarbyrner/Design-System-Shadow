import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import selectEvent from 'react-select-event';
import {
  MockedManageAthletesContextProvider,
  mockedManageAthletesContextValue,
} from '../../contexts/mocks';
import BulkLabelActions from '../BulkLabelActions';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
describe('<BulkLabelActions />', () => {
  beforeEach(() => {
    useGetAllLabelsQuery.mockReturnValue({
      data: mockLabels,
      isSuccess: true,
      isFetching: false,
    });
  });

  const athleteIsSelected = {
    ...mockedManageAthletesContextValue,
    selectedAthleteIds: [1],
  };

  const multipleAthletesSelected = {
    ...mockedManageAthletesContextValue,
    selectedAthleteIds: [1, 2, 3],
  };

  const renderComponent = (mockContextValue) => {
    return render(
      <Provider
        store={{
          default: () => {},
          subscribe: () => {},
          dispatch: () => {},
          getState: () => {},
        }}
      >
        <MockedManageAthletesContextProvider
          manageAthletesContext={mockContextValue}
        >
          <BulkLabelActions t={i18nextTranslateStub()} />
        </MockedManageAthletesContextProvider>
      </Provider>
    );
  };

  it('does not render the actions when no athletes are checked', () => {
    renderComponent(mockedManageAthletesContextValue);
    expect(screen.queryByText('Labels to assign')).not.toBeInTheDocument();
  });

  it('does render the selector and buttons when one athlete is checked', () => {
    renderComponent(athleteIsSelected);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    expect(screen.getByText('Labels to assign')).toBeInTheDocument();
    expect(screen.getByText('Labels to remove')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders correct number selected', () => {
    renderComponent(multipleAthletesSelected);
    expect(screen.getByText('3 selected')).toBeInTheDocument();
    expect(screen.getByText('Labels to assign')).toBeInTheDocument();
    expect(screen.getByText('Labels to remove')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('calls the update function with the expected request when clicking Apply, and clears selections after', async () => {
    const bulkUpdateLabelMock = jest.fn();
    renderComponent({
      ...multipleAthletesSelected,
      bulkUpdateLabels: bulkUpdateLabelMock,
    });

    // select one to add
    const assignWrapper = screen.getByTestId('AssignLabelsSelect');
    selectEvent.openMenu(
      assignWrapper.querySelector('.kitmanReactSelect input')
    );
    expect(screen.getByText(mockLabels[0].name)).toBeInTheDocument();
    await userEvent.click(screen.getByText(mockLabels[0].name));

    // select one to remove
    const removeWrapper = screen.getByTestId('RemoveLabelsSelect');
    selectEvent.openMenu(
      removeWrapper.querySelector('.kitmanReactSelect input')
    );
    expect(screen.getByText(mockLabels[1].name)).toBeInTheDocument();
    await userEvent.click(screen.getByText(mockLabels[1].name));

    // the selectors are populated with the names to assign and remove
    expect(screen.getByText(mockLabels[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockLabels[1].name)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Apply'));
    expect(bulkUpdateLabelMock).toHaveBeenCalledWith(
      [mockLabels[0].id],
      [mockLabels[1].id]
    );

    // the selections should be removed after clicking apply
    expect(screen.queryByText(mockLabels[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(mockLabels[1].name)).not.toBeInTheDocument();
  });
});
