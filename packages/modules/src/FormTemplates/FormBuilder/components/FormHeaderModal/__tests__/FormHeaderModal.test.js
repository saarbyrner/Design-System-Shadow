import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetFormHeaderDefaultsQuery } from '@kitman/services/src/services/formTemplates';

import { FormHeaderModalTranslated as FormHeaderModal } from '../index';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

jest.mock('@kitman/services/src/services/formTemplates', () => ({
  ...jest.requireActual('@kitman/services/src/services/formTemplates'),
  useGetFormHeaderDefaultsQuery: jest.fn(),
}));

describe('<FormHeaderModal />', () => {
  const defaultsHeaderData = {
    header: {
      hidden: false,
      image: {
        hidden: false,
        current_organisation_logo: true,
      },
      text: {
        hidden: false,
        content: 'Kitman Rugby Club',
        color: '#000000',
      },
      color: {
        primary: '#ffffff',
      },
      layout: 'left',
    },
  };

  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {},
      isError: false,
      isSuccess: true,
      isLoading: false,
    });
    useGetFormHeaderDefaultsQuery.mockReturnValue({
      data: defaultsHeaderData,
      isError: false,
      isSuccess: true,
      isLoading: false,
    });
  });

  const props = {
    isModalOpen: true,
    onClose: jest.fn(),
    onCancel: jest.fn(),
  };

  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <FormHeaderModal {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...state },
        },
      }
    );

    return mockedStore;
  };

  it('should render the modal properly', () => {
    renderComponent();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /form header/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(
      screen.getByText(/use current organisation logo/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/image/i)).toBeInTheDocument();
    expect(screen.getByText(/layout/i)).toBeInTheDocument();
  });

  it('should close the modal when clicking the cancel button', async () => {
    const user = userEvent.setup();
    renderComponent();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    await user.click(cancelButton);

    expect(props.onCancel).toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('should close the modal and dispatch correct action when clicking the save button', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const saveButton = screen.getByRole('button', { name: /save/i });

    await user.click(saveButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        headerConfig: defaultsHeaderData.header,
      },
      type: `${REDUCER_KEY}/setBrandingHeaderConfig`,
    });

    expect(props.onClose).toHaveBeenCalled();
    expect(props.onCancel).not.toHaveBeenCalled();
  });
});
