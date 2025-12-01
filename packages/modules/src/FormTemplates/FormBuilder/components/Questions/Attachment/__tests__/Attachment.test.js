import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { AttachmentQuestionTranslated as Attachment } from '../index';

describe('<Attachment />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.Attachment,
      config: { optional: false },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(<Attachment {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Size')).toBeInTheDocument();
  });

  describe('Regular attachment element', () => {
    it('should call the correct action when updating question type selector - signature', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Signature'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              type: 'signature',
              max_size: '10mb',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question size selector - 100mb', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();

      const sizeSelect = screen.getByLabelText('Size');

      expect(sizeSelect).toBeInTheDocument();

      await user.click(sizeSelect);
      await user.click(screen.getByText('100mb'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              max_size: '100mb',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question type selector - avatar', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Avatar'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              type: 'avatar',
              max_size: '10mb',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  it('should call the correct action when updating question size selector - 5mb', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const sizeSelect = screen.getByLabelText('Size');

    expect(sizeSelect).toBeInTheDocument();

    await user.click(sizeSelect);
    await user.click(screen.getByText('5mb'));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex,
        value: {
          optional: false,
          custom_params: {
            max_size: '5mb',
          },
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  describe('Attachment element inside a group element', () => {
    it('should call the correct action when updating question type selector - signature', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 0,
      });
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Signature'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              type: 'signature',
              max_size: '10mb',
            },
          },
          groupIndex: 0,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question type selector - avatar', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 0,
      });
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Avatar'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              type: 'avatar',
              max_size: '10mb',
            },
          },
          groupIndex: 0,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
