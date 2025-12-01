import { render, screen, fireEvent } from '@testing-library/react';
import GridPagination from '..';

describe('GridPagination', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      totalPages: 5,
      activePage: 2,
      onChange: jest.fn(),
      disabled: false,
    };
    return render(<GridPagination {...defaultProps} {...props} />);
  };

  it('renders the correct page buttons', () => {
    renderComponent({ totalPages: 5 });
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('calls onChange when a different page is clicked', () => {
    const onChangeMock = jest.fn();
    renderComponent({ onChange: onChangeMock });

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(onChangeMock).toHaveBeenCalledWith(3);
  });

  it('does not call onChange when disabled', () => {
    const onChangeMock = jest.fn();
    renderComponent({ onChange: onChangeMock, disabled: true });

    const page3Button = screen.getByText('3');
    fireEvent.click(page3Button);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('highlights the active page', () => {
    renderComponent({ activePage: 2 });

    const activePageButton = screen.getByText('2');
    expect(activePageButton.className).toMatch(/Mui-selected/);
  });
});
