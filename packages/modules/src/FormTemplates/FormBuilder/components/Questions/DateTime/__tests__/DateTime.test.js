import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { DateTimeQuestionTranslated as DateTime } from '../index';

describe('<DateTime />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: INPUT_ELEMENTS.DateTime,
      config: { optional: false, type: 'date' },
    },
    questionIndex,
  };

  const renderComponent = (customProps = props) => {
    const { mockedStore } = renderWithRedux(<DateTime {...customProps} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  describe('Regular DateTime element', () => {
    it('renders', () => {
      renderComponent();

      expect(screen.getByLabelText('Type')).toBeInTheDocument();
    });

    it('should call the correct action when updating question type selector - time', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Time'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'time',
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });

    it('should call the correct action when updating question type selector - date_time', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent();
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Date and Time'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'date_time',
          },
        },
        type: `${REDUCER_KEY}/updateQuestion`,
      });
    });
  });

  describe('DateTime element inside a Group', () => {
    it('renders', () => {
      renderComponent({ ...props, isChildOfGroup: true, groupIndex: 1 });

      expect(screen.getByLabelText('Type')).toBeInTheDocument();
    });

    it('should call the correct action when updating question type selector - time', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });

      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Time'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'time',
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question type selector - date', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        questionElement: {
          ...props.questionElement.element_type,
          config: { ...props.questionElement.config, type: 'date_time' },
        },
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Date'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'date',
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });

    it('should call the correct action when updating question type selector - date_time', async () => {
      const user = userEvent.setup();
      const mockedStore = renderComponent({
        ...props,
        isChildOfGroup: true,
        groupIndex: 1,
      });
      const typeSelect = screen.getByLabelText('Type');

      expect(typeSelect).toBeInTheDocument();

      await user.click(typeSelect);
      await user.click(screen.getByText('Date and Time'));

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          field: 'config',
          questionIndex,
          value: {
            optional: false,
            type: 'date_time',
          },
          groupIndex: 1,
        },
        type: `${REDUCER_KEY}/updateQuestionFromGroupLayoutElement`,
      });
    });
  });
});
