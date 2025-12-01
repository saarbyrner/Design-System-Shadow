import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants/index';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  defaultStore,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import {
  segmentRequest,
  segmentResponse,
} from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import {
  useCreateSegmentMutation,
  useUpdateSegmentMutation,
} from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { duplicateNameErrorCode } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import FormFooter from '../FormFooter';

jest.mock(
  '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi'
);
jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());

describe('<FormFooter />', () => {
  const mockLocationAssign = jest.fn();
  const createSegment = jest.fn();
  const updateSegment = jest.fn();
  const mockDispatch = jest.fn();

  const defaultProps = {
    mode: MODES.CREATE,
    t: i18nextTranslateStub(),
  };

  const state = {
    segmentSlice: {
      formState: {
        ...segmentRequest,
      },
      errorState: { name: false, expression: false },
    },
  };
  const filledStore = {
    default: () => {},
    subscribe: () => {},
    dispatch: mockDispatch,
    getState: () => state,
  };

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
    createSegment.mockReturnValue({
      unwrap: () => Promise.resolve(segmentResponse),
    });
    useCreateSegmentMutation.mockReturnValue([
      createSegment,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    updateSegment.mockReturnValue({
      unwrap: () => Promise.resolve(segmentResponse),
    });
    useUpdateSegmentMutation.mockReturnValue([
      updateSegment,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
  });

  describe('create mode', () => {
    it('shows save button in create mode', async () => {
      renderTestComponent(defaultStore, <FormFooter {...defaultProps} />);
      expect(await screen.findByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('calls the location assign  and dispatch reset correctly when clicking cancel', async () => {
      renderTestComponent(filledStore, <FormFooter {...defaultProps} />);
      await userEvent.click(await screen.findByText('Cancel'));
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'segmentSlice/onReset',
          payload: undefined,
        });
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith(
          '/administration/groups'
        );
      });
    });

    it('calls create segment when the form is properly filled out', async () => {
      renderTestComponent(filledStore, <FormFooter {...defaultProps} />);
      await userEvent.click(await screen.findByText('Save'));
      expect(createSegment).toHaveBeenCalledTimes(1);
      expect(createSegment).toHaveBeenCalledWith(segmentRequest);
    });

    it('doesnt call create segment when there are errors', async () => {
      const invalidState = {
        segmentSlice: {
          formState: {
            ...segmentRequest,
            name: '',
          },
          errorState: { name: true, expression: false },
        },
      };
      const storeWithInvalidState = {
        default: () => {},
        subscribe: () => {},
        dispatch: () => {},
        getState: () => invalidState,
      };
      renderTestComponent(
        storeWithInvalidState,
        <FormFooter {...defaultProps} />
      );
      const createButton = await screen.findByRole('button', {
        hidden: true,
        name: 'Save',
      });
      await userEvent.click(createButton);
      expect(createButton).toBeDisabled();
      expect(createSegment).toHaveBeenCalledTimes(0);
    });
    it('adds the toast, reset the form, and re-routes user when the create request succeeds', async () => {
      renderTestComponent(filledStore, <FormFooter {...defaultProps} />);
      await userEvent.click(await screen.findByText('Save'));
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'toasts/add',
        payload: {
          status: 'SUCCESS',
          title: `Successfully created ${segmentResponse.name}.`,
        },
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: 'segmentSlice/onReset',
        payload: undefined,
      });
      expect(mockLocationAssign).toHaveBeenCalledTimes(1);
      expect(mockLocationAssign).toHaveBeenCalledWith(
        `/administration/groups/${segmentResponse.id}/edit`
      );
    });
  });

  it('dispatches proper error when duplicate name is saved', async () => {
    createSegment.mockReturnValue({
      // eslint-disable-next-line prefer-promise-reject-errors
      unwrap: () => Promise.reject({ status: duplicateNameErrorCode }),
    });
    renderTestComponent(filledStore, <FormFooter {...defaultProps} />);
    await userEvent.click(await screen.findByText('Save'));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'segmentSlice/onUpdateErrorState',
      payload: {
        formInputKey: 'name',
        isInvalid: true,
      },
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: 'toasts/add',
      payload: {
        status: 'ERROR',
        title: 'Group name already exists.',
      },
    });
  });

  describe('edit mode', () => {
    it('shows update button in edit mode', async () => {
      renderTestComponent(
        defaultStore,
        <FormFooter {...defaultProps} mode={MODES.EDIT} />
      );
      expect(await screen.findByText('Update')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    it('calls update segment when the form is properly filled out', async () => {
      renderTestComponent(
        filledStore,
        <FormFooter {...defaultProps} mode={MODES.EDIT} />
      );
      await userEvent.click(await screen.findByText('Update'));
      expect(updateSegment).toHaveBeenCalledTimes(1);
      expect(updateSegment).toHaveBeenCalledWith(segmentRequest);
    });

    it('calls update the form and adds the toast when the update request succeeds', async () => {
      renderTestComponent(
        filledStore,
        <FormFooter {...defaultProps} mode={MODES.EDIT} />
      );
      await userEvent.click(await screen.findByText('Update'));
      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'toasts/add',
        payload: {
          status: 'SUCCESS',
          title: `Successfully updated ${segmentResponse.name}.`,
        },
      });
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: 'segmentSlice/onUpdateForm',
        payload: {
          id: segmentResponse.id,
          name: segmentResponse.name,
          expression: JSON.parse(segmentResponse.expression),
        },
      });
    });

    it('adds the error toast if the request fails', async () => {
      updateSegment.mockReturnValue({
        unwrap: () => Promise.resolve(),
      });
      useUpdateSegmentMutation.mockReturnValue([
        updateSegment,
        { isError: true, isLoading: false, isSuccess: false },
      ]);
      renderTestComponent(
        filledStore,
        <FormFooter {...defaultProps} mode={MODES.EDIT} />
      );
      await userEvent.click(await screen.findByText('Update'));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'toasts/add',
        payload: {
          status: 'ERROR',
          title: 'Could not update the group.',
        },
      });
    });
  });
});
