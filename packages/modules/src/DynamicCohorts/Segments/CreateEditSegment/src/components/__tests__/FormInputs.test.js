import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import { labels as mockLabels } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { useGetAllLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import {
  defaultStore,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { segmentRequest } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import FormInputs from '../FormInputs';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
jest.mock('@kitman/common/src/redux/global/services/globalApi');
describe('<FormInputs />', () => {
  const mockDispatch = jest.fn();
  const defaultProps = {
    mode: MODES.CREATE,
    t: i18nextTranslateStub(),
  };

  const state = {
    segmentSlice: {
      formState: {
        name: 'the name',
        expression: segmentRequest.expression,
      },
      errorState: {
        name: false,
        expression: false,
      },
      queryParams: {
        expression: segmentRequest.expression,
        nextId: 12,
      },
    },
  };
  const filledStore = {
    default: () => {},
    subscribe: () => {},
    dispatch: mockDispatch,
    getState: () => state,
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { isSegmentsAdmin: true } },
      isSuccess: true,
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: mockLabels,
      isSuccess: true,
    });
  });

  it('renders the expected inputs and buttons', async () => {
    renderTestComponent(defaultStore, <FormInputs {...defaultProps} />);
    expect(await screen.findByText('Apply')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Athlete group name')
    ).toBeInTheDocument();

    // our Select component does not use the native placeholder prop, so can't use findByPlaceholderText
    expect(await screen.findByText('Athlete labels')).toBeInTheDocument();
  });

  it('calls dispatch properly when the apply button is clicked', async () => {
    renderTestComponent(filledStore, <FormInputs {...defaultProps} />);

    await userEvent.click(await screen.findByText('Apply'));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'segmentSlice/onUpdateQueryParams',
      payload: {
        expression: state.segmentSlice.queryParams.expression,
        // nextId had a value in the filled store, but when hitting 'Apply' we want it to be null to get the first page of the new list of athletes
        nextId: null,
      },
    });
  });
  it('has a disabled apply button when expression is not valid', async () => {
    const errorState = {
      segmentSlice: {
        ...state.segmentSlice,
        errorState: {
          expression: true,
          name: false,
        },
      },
    };
    const errorStore = {
      default: () => {},
      subscribe: () => {},
      dispatch: mockDispatch,
      getState: () => errorState,
    };
    renderTestComponent(errorStore, <FormInputs {...defaultProps} />);
    const applyButton = await screen.findByRole('button', { name: 'Apply' });
    expect(applyButton).toBeDisabled();
  });
});
