import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { initialState } from '@kitman/modules/src/FormTemplates/redux/slices/utils/consts';
import { REDUCER_KEY } from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import { ContentElementTranslated as ContentElement } from '../index';

describe('<ContentElement />', () => {
  const questionIndex = 0;
  const props = {
    questionElement: {
      element_type: 'Forms::Elements::Layouts::Content',
      config: { optional: true },
    },
    questionIndex,
  };

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<ContentElement {...props} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: { ...initialState },
      },
    });

    return mockedStore;
  };

  it('renders', () => {
    renderComponent();

    expect(screen.getByText('Paragraph')).toBeInTheDocument();
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    const rte = screen.getByTestId('RichTextEditor|editor');
    expect(rte).toBeInTheDocument();
  });

  it('should call the correct action when deleting the element', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();
    const deleteButton = screen.getByTestId('DeleteIcon');

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: questionIndex,
      type: `${REDUCER_KEY}/deleteQuestionFromCurrentMenuItem`,
    });
  });

  it('should call the correct action when updating content text', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();
    await user.click(selector);

    const options = screen.getAllByRole('option');
    expect(options[1]).toBeInTheDocument();
    await user.click(options[1]);

    const textArea = screen.getByRole('textbox', { name: '' });

    expect(textArea).toBeInTheDocument();

    await user.type(textArea, 'some text');

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: `${REDUCER_KEY}/updateQuestion`,
        payload: expect.objectContaining({ field: 'config', questionIndex: 0 }),
      })
    );
  });

  it('should call the correct action when updating name text', async () => {
    const user = userEvent.setup();
    const mockedStore = renderComponent();

    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();
    await user.click(selector);

    const options = screen.getAllByRole('option');
    expect(options[1]).toBeInTheDocument();
    await user.click(options[1]);

    const textArea = screen.getByRole('textbox', { name: 'Name' });

    expect(textArea).toBeInTheDocument();

    await user.type(textArea, 'some text');

    expect(mockedStore.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: `${REDUCER_KEY}/updateQuestion`,
        payload: expect.objectContaining({ field: 'config', questionIndex: 0 }),
      })
    );
  });
});
