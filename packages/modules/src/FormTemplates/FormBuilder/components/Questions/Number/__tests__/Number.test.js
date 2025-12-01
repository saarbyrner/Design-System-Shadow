import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { NumberQuestionTranslated as Number } from '../index';

describe('<Number />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.Number,
      config: { optional: false },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(<Number {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  describe('regular Number element', () => {
    it('renders', () => {
      renderComponent();

      expect(screen.getByLabelText('Unit')).toBeInTheDocument();
    });

    it('should call the correct action when updating question unit value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const unitInput = screen.getByLabelText('Unit');

      expect(unitInput).toBeInTheDocument();

      await user.type(unitInput, 'm');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'float',
            custom_params: {
              unit: 'm',
            },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('Number element inside a Group element', () => {
    it('should call the correct action when updating question unit value', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const unitInput = screen.getByLabelText('Unit');

      expect(unitInput).toBeInTheDocument();

      await user.type(unitInput, 'm');

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'float',
            custom_params: {
              unit: 'm',
            },
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
