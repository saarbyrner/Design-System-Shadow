import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import BooleanQuestion from '../index';
import { getBooleanQuestionTranslations } from '../utils/helpers';

describe('<BooleanQuestion />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.Boolean,
      config: { optional: false, custom_params: { style: 'toggle' } },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(
      <BooleanQuestion {...customProps} />,
      {
        useGlobalStore: false,
        preloadedState: {
          [REDUCER_KEY]: { ...initialState },
        },
      }
    );

    return mockedStore;
  };

  const translations = getBooleanQuestionTranslations();
  const toggleText = 'Toggle';
  const switchText = 'Switch';
  const checkboxText = 'Checkbox';

  describe('regular Boolean element', () => {
    it('renders', () => {
      renderComponent();

      expect(screen.getByLabelText(translations.option1)).toBeInTheDocument();
      expect(screen.getByLabelText(translations.option2)).toBeInTheDocument();
      expect(screen.getByLabelText(translations.style)).toBeInTheDocument();
      expect(screen.getByDisplayValue(translations.no)).toBeInTheDocument();
      expect(screen.getByDisplayValue(translations.yes)).toBeInTheDocument();
      expect(screen.getByText(toggleText)).toBeInTheDocument();
    });

    it('changes style properly', async () => {
      const user = userEvent.setup();

      const mockedStore = renderComponent();

      await user.click(screen.getByLabelText(translations.style));
      const switchOption = screen.getByRole('option', { name: switchText });
      expect(switchOption).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: checkboxText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: toggleText })
      ).toBeInTheDocument();

      await user.click(switchOption);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: { style: 'switch' },
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('Boolean element inside a group', () => {
    it('renders', () => {
      renderComponent({ ...props, isChildOfGroup: true, groupIndex: 1 });

      expect(screen.getByLabelText(translations.option1)).toBeInTheDocument();
      expect(screen.getByLabelText(translations.option2)).toBeInTheDocument();
      expect(screen.getByLabelText(translations.style)).toBeInTheDocument();
      expect(screen.getByDisplayValue(translations.no)).toBeInTheDocument();
      expect(screen.getByDisplayValue(translations.yes)).toBeInTheDocument();
      expect(screen.getByText(toggleText)).toBeInTheDocument();
    });

    it('changes style properly', async () => {
      const user = userEvent.setup();

      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });

      await user.click(screen.getByLabelText(translations.style));
      const switchOption = screen.getByRole('option', { name: switchText });
      expect(switchOption).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: checkboxText })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('option', { name: toggleText })
      ).toBeInTheDocument();

      await user.click(switchOption);

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            custom_params: { style: 'switch' },
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
