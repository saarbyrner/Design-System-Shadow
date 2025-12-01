import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { VirtuosoMockContext } from 'react-virtuoso';
import FavoriteAsyncSelect from '..';

describe('<FavoriteAsyncSelect />', () => {
  // react select source code helped me get this load options fn
  // https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/__tests__/Async.test.tsx
  const loadOptions = jest.fn((_, callback) =>
    callback([
      // callback needs to be label, options
      // or else the stars doesn't show up
      // see the note in react select overrides file
      {
        label: 'Diagnostic types',
        options: [
          {
            id: 543,
            value: 5, // NOTE: VALUE IS IGNORED! id is what gets returned to onChange
            label: 'loaded label 1',
            name: 'loaded label 1',
            isFavorite: true,
          },
          {
            id: 875,
            value: 6, // NOTE: VALUE IS IGNORED! id is what gets returned to onChange
            label: 'loaded label 2',
            name: 'loaded label 2',
            isFavorite: false,
          },
        ],
      },
    ])
  );

  const props = {
    cacheOptions: false,
    label: 'Favorite Async Label',
    value: null,
    placeholder: 'Mock placeholder...',
    arrayOfFavorites: [],
    optionalGroupPayload: {
      groupTitle: 'string',
      groupPayload: [],
    },
    loadOptions,
    onChange: jest.fn(),
    handleToggle: jest.fn(),
  };

  const renderFavoriteAsyncSelect = (argProps) =>
    render(<FavoriteAsyncSelect {...argProps} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

  it('sets the correct label', () => {
    renderFavoriteAsyncSelect(props);
    renderFavoriteAsyncSelect({ ...props, label: 'Another select label' });

    expect(screen.getByLabelText('Favorite Async Label')).toBeInTheDocument();
    expect(screen.getByLabelText('Another select label')).toBeInTheDocument();
  });

  it('renders no favorites if none exist', async () => {
    renderFavoriteAsyncSelect({
      ...props,
      arrayOfFavorites: [],
    });
    // Click to open select
    await userEvent.click(screen.getByRole('textbox'));

    expect(screen.getByText('No favorites')).toBeInTheDocument();
  });

  it('calls the correct prop when selecting an option', async () => {
    renderFavoriteAsyncSelect({
      ...props,
      arrayOfFavorites: [
        {
          id: 101,
          value: 1,
          label: 'favorite label 1',
          isFavorite: true,
        },
        {
          id: 102,
          value: 2,
          label: 'favorite label 2',
          isFavorite: true,
        },
      ],
    });
    // Click to open select
    await userEvent.click(screen.getByRole('textbox'));

    // Click to choose item
    await userEvent.click(screen.getByText('favorite label 2'));

    await expect(props.onChange).toHaveBeenCalledTimes(1);

    expect(props.onChange).toHaveBeenCalledWith({
      id: 102,
      isFavorite: true,
      label: 'favorite label 2',
      value: 102, // NOTE: value is not the original value. This component returns id.
    });
  });

  describe('isMulti prop true', () => {
    it('renders the checkbox', async () => {
      renderFavoriteAsyncSelect({
        ...props,
        isMulti: true,
        value: [
          {
            id: 543, // NOTE: the id matches id in arrayOfFavorites
          },
        ],
        arrayOfFavorites: [
          {
            id: 543,
            value: 5,
            label: 'loaded label 1',
            name: 'loaded label 1',
            isFavorite: true,
          },
        ],
      });

      // ensure loaded labels haven't been loaded yet
      expect(screen.queryByText('loaded label 1')).not.toBeInTheDocument();
      expect(screen.queryByText('loaded label 2')).not.toBeInTheDocument();

      const selectTextBox = screen.getByRole('textbox');

      // add a delay of 2 milliseconds between each letter to mimic each letter being typed separately
      await userEvent.type(selectTextBox, 'typing test', [{ delay: 2 }]);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledTimes(1);
      });

      // wait for the loading message to disappear
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const favMultiCheckboxes = screen.queryAllByRole('checkbox');

      expect(favMultiCheckboxes[0]).toBeInTheDocument();
      expect(favMultiCheckboxes[0]).toBeChecked();
      expect(favMultiCheckboxes[1]).toBeInTheDocument();
      expect(favMultiCheckboxes[1]).not.toBeChecked();
    });
  });

  describe('when the user search for a term', () => {
    it('will call loadOptions when user types and debounce timer', async () => {
      renderFavoriteAsyncSelect(props);
      const selectTextBox = screen.getByRole('textbox');
      // add a delay of 2 milliseconds between each letter to mimic each letter being typed separately
      await userEvent.type(selectTextBox, 'typing test', [{ delay: 2 }]);
      expect(selectTextBox).toHaveValue('typing test');
      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledTimes(1);
      });
    });

    it('shows a Loading... message first', async () => {
      renderFavoriteAsyncSelect(props);

      // ensure the loading message haven't been displayed yet
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();

      const selectTextBox = screen.getByRole('textbox');

      // add a delay of 2 milliseconds between each letter to mimic each letter being typed separately
      await userEvent.type(selectTextBox, 'typing test', [{ delay: 2 }]);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows list of loaded favorites after typing', async () => {
      renderFavoriteAsyncSelect(props);

      // ensure loaded labels haven't been loaded yet
      expect(screen.queryByText('loaded label 1')).not.toBeInTheDocument();
      expect(screen.queryByText('loaded label 2')).not.toBeInTheDocument();

      const selectTextBox = screen.getByRole('textbox');

      // add a delay of 2 milliseconds between each letter to mimic each letter being typed separately
      await userEvent.type(selectTextBox, 'typing test', [{ delay: 2 }]);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledTimes(1);
      });

      // wait for the loading message to disappear
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      // loaded labels should be visible now
      expect(screen.getByText('loaded label 1')).toBeInTheDocument();
      expect(screen.getByText('loaded label 2')).toBeInTheDocument();
    });
  });

  describe('checking the stars', () => {
    it('shows the correct styles', async () => {
      renderFavoriteAsyncSelect({
        ...props,
        arrayOfFavorites: [
          {
            id: 543,
            value: 5,
            label: 'loaded label 1',
            name: 'loaded label 1',
            isFavorite: true,
          },
        ],
      });

      // ensure loaded labels haven't been loaded yet
      expect(screen.queryByText('loaded label 1')).not.toBeInTheDocument();
      expect(screen.queryByText('loaded label 2')).not.toBeInTheDocument();

      const selectTextBox = screen.getByRole('textbox');

      // add a delay of 2 milliseconds between each letter to mimic each letter being typed separately
      await userEvent.type(selectTextBox, 'typing test', [{ delay: 2 }]);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalledTimes(1);
      });

      // wait for the loading message to disappear
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const favoriteTemplates = screen.getAllByTestId(
        'Favorite|FavoriteTemplate'
      );

      // one label is in the array of favorites
      expect(
        within(favoriteTemplates[0]).getByRole('button')
      ).toBeInTheDocument();
      expect(
        within(favoriteTemplates[0])
          .getByRole('button')
          .className.includes('icon-star-filled')
      ).toEqual(true);

      // the other label is not in the array of favorites
      expect(
        within(favoriteTemplates[0]).getByRole('button')
      ).toBeInTheDocument();
      expect(
        within(favoriteTemplates[0])
          .getByRole('button')
          .className.includes('icon-star')
      ).toEqual(true);
    });
  });
});
