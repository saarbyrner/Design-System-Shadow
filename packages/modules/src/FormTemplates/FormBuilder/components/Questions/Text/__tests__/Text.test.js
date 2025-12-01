import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { textStyleOptions } from '@kitman/modules/src/FormTemplates/shared/consts';
import { TextQuestionTranslated as Text } from '../index';

describe('<Text />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.Text,
      config: { optional: false },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(<Text {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(screen.getByLabelText('Multiline')).toBeInTheDocument();
  });

  it('should call the correct action when updating question multiline value', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const multilineCheckbox = screen.getByLabelText('Multiline');

    expect(multilineCheckbox).toBeInTheDocument();

    await user.click(multilineCheckbox);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex,
        value: {
          custom_params: { style: 'multiline' },
          optional: false,
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should call the correct action when updating question multiline value inside a Group element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...props,
      isChildOfGroup: true,
      groupIndex: 1,
    });
    const multilineCheckbox = screen.getByLabelText('Multiline');

    expect(multilineCheckbox).toBeInTheDocument();

    await user.click(multilineCheckbox);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex,
        value: {
          custom_params: { style: 'multiline' },
          optional: false,
        },
        groupIndex: 1,
      },
      type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
    });
  });

  it('should call the correct action when updating question type value', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const typeInput = screen.getByLabelText('Type');

    expect(typeInput).toBeInTheDocument();

    await user.click(typeInput);

    const optionToSelect = textStyleOptions[1];
    const option = screen.getByText(optionToSelect.label);
    await user.click(option);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex,
        value: {
          optional: false,
          custom_params: {
            type: 'phone',
            unit: '',
          },
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should render the CountryCodeSelector when type is phone', () => {
    renderComponent({
      ...props,
      questionElement: {
        ...props.questionElement,
        config: {
          optional: false,
          custom_params: {
            type: 'phone',
          },
        },
      },
    });

    expect(screen.getByLabelText('Default country code')).toBeInTheDocument();
  });

  it('should call the correct action when updating default country code', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent({
      ...props,
      questionElement: {
        ...props.questionElement,
        config: {
          optional: false,
          custom_params: {
            type: 'phone',
          },
        },
      },
    });

    expect(screen.getByLabelText('Default country code')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Default country code'));
    const countryOption = screen.getByText('Canada (CA) +1');
    await user.click(countryOption);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        field: 'config',
        questionIndex,
        value: {
          optional: false,
          custom_params: {
            type: 'phone',
            default_country_code: '+1',
          },
        },
      },
      type: `${REDUCER_KEY}/updateQuestion`,
    });
  });

  it('should render the CountryCodeSelector with the default value when provided', () => {
    renderComponent({
      ...props,
      questionElement: {
        ...props.questionElement,
        config: {
          optional: false,
          custom_params: {
            type: 'phone',
            default_country_code: '+353',
          },
        },
      },
    });

    expect(screen.getByLabelText('Default country code')).toHaveValue('+353');
  });
});
