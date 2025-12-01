import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';

import { FormBrandingHeaderTranslated as FormBrandingHeader } from '../index';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

describe('<FormHeaderModal />', () => {
  const defaultsHeaderData = {
    header: {
      enabled: true,
      image: {
        hidden: false,
        current_organisation_logo: false,
        attachment_id: 1234,
        attachment: {
          id: 1495819,
          url: 'https://s3:9000/',
          filename: 'Manchester_United_FC_crest.svg.png',
          filetype: 'image/png',
          filesize: 580976,
          created: '2025-04-09T20:45:02Z',
          created_by: {
            id: 155134,
            firstname: 'Cathal',
            lastname: 'Diver',
            fullname: 'Cathal Diver',
          },
          attachment_date: '2025-04-09T20:45:02Z',
        },
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
  });

  const props = {
    header: defaultsHeaderData.header,
    showMenu: false,
  };

  const renderComponent = (customProps = props, state = initialState) => {
    const { mockedStore } = renderWithRedux(
      <FormBrandingHeader {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...state },
        },
      }
    );

    return mockedStore;
  };

  it('should render the form branding header properly', async () => {
    renderComponent();

    expect(screen.getByText('Kitman Rugby Club')).toBeInTheDocument();
    expect(await screen.findByRole('img')).toHaveAttribute(
      'src',
      'https://s3:9000/'
    );
  });

  it('should render only logo when text content is hidden', async () => {
    renderComponent({
      ...props,
      header: {
        ...props.header,
        text: {
          ...props.header.text,
          hidden: true,
        },
      },
    });

    expect(screen.queryByText('Kitman Rugby Club')).not.toBeInTheDocument();
    expect(await screen.findByRole('img')).toHaveAttribute(
      'src',
      'https://s3:9000/'
    );
  });

  it('should render only text content when logo is hidden', async () => {
    renderComponent({
      ...props,
      header: {
        ...props.header,
        image: {
          ...props.header.image,
          hidden: true,
        },
      },
    });

    expect(screen.getByText('Kitman Rugby Club')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should show menu when showMenu prop is true', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...props,
      showMenu: true,
    });

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /more/i }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('should dispatch the correct action when clicking Edit menu option', async () => {
    const user = userEvent.setup();

    const mockedStore = renderComponent({
      ...props,
      showMenu: true,
    });

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /more/i }));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: `${REDUCER_KEY}/setShowFormHeaderModal`,
    });
  });

  it('should dispatch the correct action when clicking Delete menu option', async () => {
    const user = userEvent.setup();

    const mockedStore = renderComponent({
      ...props,
      showMenu: true,
    });

    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /more/i }));

    expect(screen.getByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /delete/i }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: { headerConfig: null },
      type: `${REDUCER_KEY}/setBrandingHeaderConfig`,
    });
  });
});
