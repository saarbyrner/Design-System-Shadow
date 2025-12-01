import { screen } from '@testing-library/react';
import { paginatedLabelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/searchLabels';
import { labelRequest } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import userEvent from '@testing-library/user-event';
import {
  useCreateLabelMutation,
  useSearchLabelsQuery,
  useUpdateLabelMutation,
} from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import { getInitialState } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import {
  storeFake,
  renderTestComponent,
} from '@kitman/modules/src/DynamicCohorts/shared/testUtils';
import { duplicateNameErrorCode } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import { LabelModalTranslated as LabelModal } from '../LabelModal';

jest.mock(
  '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi'
);

const openModalState = {
  isLabelModalOpen: true,
  nextId: null,
  filters: {
    searchValue: '',
    createdBy: [],
  },
};

describe('<LabelModal />', () => {
  const mockDispatch = jest.fn();
  const onCreateLabel = jest.fn();
  const onUpdateLabel = jest.fn();

  const defaultStore = storeFake(
    {
      labelSlice: getInitialState(),
      manageLabelsSlice: openModalState,
    },
    mockDispatch
  );

  beforeEach(() => {
    onCreateLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useCreateLabelMutation.mockReturnValue([
      onCreateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
    useSearchLabelsQuery.mockReturnValue({
      data: paginatedLabelResponse,
      isSuccess: true,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    onUpdateLabel.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    useUpdateLabelMutation.mockReturnValue([
      onUpdateLabel,
      { isError: false, isLoading: false, isSuccess: true },
    ]);
  });

  const getCreateButton = () => {
    return screen.getByRole('button', {
      hidden: true,
      name: 'Create',
    });
  };

  it('renders the title and inputs', () => {
    renderTestComponent(defaultStore, <LabelModal />);
    expect(screen.getByText('Create athlete label')).toBeInTheDocument();
    expect(screen.getByText('Athlete label')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders the cancel and create button', () => {
    renderTestComponent(defaultStore, <LabelModal />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('dispatches to close and reset the form when hitting cancel', async () => {
    renderTestComponent(defaultStore, <LabelModal />);
    await userEvent.click(screen.getByText('Cancel'));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: undefined,
      type: 'labelSlice/onReset',
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      payload: undefined,
      type: 'manageLabelsSlice/onCloseLabelModal',
    });
  });

  it('calls on save with the correct formstate', async () => {
    const filledStore = storeFake(
      {
        labelSlice: {
          formState: {
            ...labelRequest,
          },
          errorState: [],
        },
        manageLabelsSlice: openModalState,
      },
      mockDispatch
    );
    renderTestComponent(filledStore, <LabelModal />);

    await userEvent.click(screen.getByText('Create'));
    expect(onCreateLabel).toHaveBeenCalledTimes(1);
    expect(onCreateLabel).toHaveBeenCalledWith(labelRequest);
  });

  it('does not call on save if there is an error', async () => {
    const filledStore = storeFake(
      {
        labelSlice: {
          formState: {
            ...labelRequest,
          },
          errorState: [{ isValid: false, message: 'Not valid.' }],
        },
        manageLabelsSlice: {
          isLabelModalOpen: true,
          nextId: null,
          filters: {
            searchValue: '',
            createdBy: [],
          },
        },
      },
      mockDispatch
    );
    renderTestComponent(filledStore, <LabelModal />);
    const createButton = getCreateButton();
    await userEvent.click(createButton);
    expect(createButton).toBeDisabled();
    expect(onCreateLabel).toHaveBeenCalledTimes(0);
  });

  it('does not call on save if the form is empty', async () => {
    renderTestComponent(defaultStore, <LabelModal />);
    const createButton = getCreateButton();
    await userEvent.click(createButton);

    // wait for button to become disabled, when the form is empty, the button is disabled AFTER clicking
    expect(
      await screen.findByRole('button', {
        hidden: true,
        name: 'Create',
        disabled: true,
      })
    ).toBeInTheDocument();
    expect(onCreateLabel).toHaveBeenCalledTimes(0);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'Label name required.',
      type: 'labelSlice/onUpdateErrorState',
    });
  });

  it('dispatches correct error when duplicate status code is returned', async () => {
    onCreateLabel.mockReturnValue({
      // eslint-disable-next-line prefer-promise-reject-errors
      unwrap: () => Promise.reject({ status: duplicateNameErrorCode }),
    });
    const filledStore = storeFake(
      {
        labelSlice: {
          formState: {
            ...labelRequest,
          },
          errorState: [],
        },
        manageLabelsSlice: openModalState,
      },
      mockDispatch
    );
    renderTestComponent(filledStore, <LabelModal />);

    await userEvent.click(screen.getByText('Create'));
    expect(onCreateLabel).toHaveBeenCalledTimes(1);
    expect(onCreateLabel).toHaveBeenCalledWith(labelRequest);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'Label name already exists.',
      type: 'labelSlice/onUpdateErrorState',
    });
  });

  describe('in edit mode', () => {
    const labelId = 10;
    const editModeStore = storeFake({
      labelSlice: {
        ...getInitialState(),
        formState: {
          ...labelRequest,
          id: labelId,
        },
        isEditing: true,
      },
      manageLabelsSlice: openModalState,
    });

    it('renders the title', () => {
      renderTestComponent(editModeStore, <LabelModal />);
      expect(screen.getByText('Edit athlete label')).toBeInTheDocument();
    });

    it('renders the cancel and edit button', () => {
      renderTestComponent(editModeStore, <LabelModal />);
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Edit athlete label')).toBeInTheDocument();
    });

    it('renders a disabled name input', () => {
      renderTestComponent(editModeStore, <LabelModal />);
      const labelNameInput = screen.getByRole('textbox', {
        hidden: true,
        name: 'Athlete label',
      });
      expect(labelNameInput).toBeDisabled();
    });

    it('calls on update with the correct formstate', async () => {
      renderTestComponent(editModeStore, <LabelModal />);
      await userEvent.click(screen.getByText('Edit'));
      expect(onUpdateLabel).toHaveBeenCalledTimes(1);
      expect(onUpdateLabel).toHaveBeenCalledWith({
        ...labelRequest,
        id: labelId,
      });
    });
  });
});
