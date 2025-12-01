import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from '../index';

describe('MultiSelect component', () => {
  const props = {
    name: 'test',
    items: [
      {
        id: 1,
        title: 'Item 1',
        description: 'Select all Item 1',
      },
      {
        id: 2,
        title: 'Item 2',
        description: 'Select all Item 2',
      },
      {
        id: 3,
        title: 'Item 3',
      },
    ],
    selectedItems: [],
    onChange: jest.fn(),
  };

  it('renders', () => {
    const { container } = render(<MultiSelect {...props} />);
    expect(container.firstChild).toBeTruthy();
  });

  describe('when a label prop is provided', () => {
    it('shows a label', () => {
      render(<MultiSelect {...props} label="My Label" />);
      const label = screen.getByText('My Label');
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe('LABEL');
    });
  });

  describe('when a label prop is not provided', () => {
    it('does not show a label', () => {
      const { container } = render(<MultiSelect {...props} />);
      expect(container.querySelector('label')).toBeNull();
    });
  });

  describe('When there are selected items', () => {
    it("hasn't the class multiSelect--isEmpty", () => {
      const { container } = render(
        <MultiSelect {...props} selectedItems={[2, 3]} />
      );
      expect(container.querySelector('.multiSelect--isEmpty')).toBeNull();
    });

    it('shows the items as selected in the dropdown', () => {
      const { container } = render(
        <MultiSelect {...props} selectedItems={[2, 3]} />
      );
      expect(
        container.querySelectorAll('.multiSelect__item--selected')
      ).toHaveLength(2);
    });

    it('shows selected items are in the input field', () => {
      const { container } = render(
        <MultiSelect {...props} selectedItems={[2, 3]} />
      );
      expect(container.querySelectorAll('.multiSelect__selected')).toHaveLength(
        2
      );
    });

    it('allows selected items to be deselected', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <MultiSelect {...props} selectedItems={[2, 3]} />
      );

      const selected = container.querySelectorAll('.multiSelect__selected');
      await user.click(selected[0]);
      expect(container.querySelectorAll('.multiSelect__selected')).toHaveLength(
        1
      );
    });
  });

  describe('When there are no selected options', () => {
    it('has the class multiSelect--isEmpty', () => {
      const { container } = render(<MultiSelect {...props} />);
      expect(container.querySelector('.multiSelect--isEmpty')).toBeTruthy();
    });

    it('allows items to be selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelect {...props} />);

      const firstItem = container.querySelectorAll('.multiSelect__item')[0];
      await user.click(firstItem);

      const selected = container.querySelectorAll('.multiSelect__selected');
      expect(selected).toHaveLength(1);
      expect(selected[0]).toHaveTextContent(props.items[0].title);
    });
  });

  describe('when there are search results', () => {
    it('shows the matching items (case-insensitive)', async () => {
      render(<MultiSelect {...props} />);

      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'item 3' } });

      const items = screen.getAllByRole('listitem');
      const match = items.find((li) => li.textContent.includes('Item 3'));
      expect(match).toBeInTheDocument();
    });

    it('shows matching items when search term matches description', async () => {
      render(<MultiSelect {...props} />);

      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'Select' } });

      const descriptions = screen.getAllByText(/Select all Item/);
      expect(descriptions).toHaveLength(2);
    });
  });

  describe('when there are no search results', () => {
    it('shows the "no results" message', async () => {
      render(<MultiSelect {...props} />);

      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'gibberish' } });

      expect(screen.getByText(/Nothing found for/i)).toBeInTheDocument();
    });
  });

  describe('when the user selects an item', () => {
    it('clears the search term', async () => {
      const user = userEvent.setup();
      render(<MultiSelect {...props} />);

      const input = screen.getByRole('textbox');
      await fireEvent.change(input, { target: { value: 'Item 1' } });

      const item = screen.getByText('Item 1');
      await user.click(item);

      expect(input).toHaveValue('');
    });
  });

  describe('when the user clicks Multiselect', () => {
    it('opens the dropdown', async () => {
      const user = userEvent.setup();
      const { container } = render(<MultiSelect {...props} />);
      const searchField = container.querySelector('.multiSelect__searchField');

      await user.click(searchField);
      const wrapper = container.querySelector('.multiSelect.open');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('When the selected value is not in the list of options', () => {
    it("doesn't show the missing value", () => {
      const { container } = render(
        <MultiSelect {...props} selectedItems={[2, 'Unknown item']} />
      );
      const selected = container.querySelectorAll('.multiSelect__selected');
      expect(selected).toHaveLength(1);
      expect(selected[0]).toHaveTextContent('Item 2');
    });
  });
});
