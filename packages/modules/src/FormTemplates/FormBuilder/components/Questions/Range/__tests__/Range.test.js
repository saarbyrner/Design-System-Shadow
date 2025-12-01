import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { RangeQuestionTranslated as Range } from '../index';

describe('<Range />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.Range,
      config: { optional: false },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(<Range {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  describe('Regular range element', () => {
    it('renders', () => {
      renderComponent();

      expect(screen.getByLabelText('Min')).toBeInTheDocument();
      expect(screen.getByLabelText('Max')).toBeInTheDocument();
      expect(screen.getByLabelText('Type')).toBeInTheDocument();
      expect(screen.getByLabelText('Increment')).toBeInTheDocument();
    });

    it('should call the correct action when updating question min value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const minInput = screen.getByLabelText('Min');

      expect(minInput).toBeInTheDocument();

      await user.type(minInput, '5');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            min: '5',
            optional: false,
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question max value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const maxInput = screen.getByLabelText('Max');

      expect(maxInput).toBeInTheDocument();

      await user.type(maxInput, '9');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            max: '9',
            optional: false,
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question type selector', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Slider'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              style: 'linear',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question increment selector', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const incrementSelect = screen.getByLabelText('Increment');

      expect(incrementSelect).toBeInTheDocument();

      await user.click(incrementSelect);
      await user.click(screen.getByText('25'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              increment: 25,
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('Range element inside a Group Element', () => {
    it('should call the correct action when updating question min value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const minInput = screen.getByLabelText('Min');

      expect(minInput).toBeInTheDocument();

      await user.type(minInput, '5');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            min: '5',
            optional: false,
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question max value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const maxInput = screen.getByLabelText('Max');

      expect(maxInput).toBeInTheDocument();

      await user.type(maxInput, '9');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            max: '9',
            optional: false,
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question type selector', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Slider'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              style: 'linear',
            },
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question increment selector', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const incrementSelect = screen.getByLabelText('Increment');

      expect(incrementSelect).toBeInTheDocument();

      await user.click(incrementSelect);
      await user.click(screen.getByText('10'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: {
              increment: 10,
            },
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
