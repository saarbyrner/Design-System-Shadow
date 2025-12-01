import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnnotationMenu from '../index';

// Mock the TooltipMenu component
jest.mock(
  '@kitman/components/src/TooltipMenu',
  () =>
    ({ menuItems, tooltipTriggerElement }) =>
      (
        <div>
          <div
            data-testid={tooltipTriggerElement.props.children.props.className}
          />
          <ul>
            {menuItems.map((item) => (
              <li key={item.description}>
                <button
                  type="button"
                  onClick={item.onClick}
                  disabled={item.isDisabled}
                >
                  {item.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
);

describe('AnnotationMenu Component', () => {
  let props;

  beforeEach(() => {
    props = {
      canEditNotes: true,
      isArchived: false,
      onClickEdit: jest.fn(),
      onClickDuplicate: jest.fn(),
      onClickArchive: jest.fn(),
      onClickRestore: jest.fn(),
    };
  });

  const renderComponent = (extraProps) => {
    const user = userEvent.setup();
    render(<AnnotationMenu {...props} {...extraProps} />);
    return { user };
  };

  it('renders a tooltip correctly', () => {
    renderComponent();
    expect(screen.getByText('Edit Note')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Note')).toBeInTheDocument();
    expect(screen.getByText('Archive Note')).toBeInTheDocument();
  });

  it('does not render the inner note menu if user does not have canEditNotes', () => {
    renderComponent({ canEditNotes: false });
    expect(screen.queryByText('Edit Note')).not.toBeInTheDocument();
  });

  it('calls onClickEdit when clicking the Edit note item', async () => {
    const { user } = renderComponent();
    await user.click(screen.getByText('Edit Note'));
    expect(props.onClickEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onClickDuplicate when clicking the Duplicate note item', async () => {
    const { user } = renderComponent();
    await user.click(screen.getByText('Duplicate Note'));
    expect(props.onClickDuplicate).toHaveBeenCalledTimes(1);
  });

  it('calls onClickArchive when clicking the Archive Note item', async () => {
    const { user } = renderComponent();
    await user.click(screen.getByText('Archive Note'));
    expect(props.onClickArchive).toHaveBeenCalledTimes(1);
  });

  describe('when the note is archived', () => {
    beforeEach(() => {
      props.isArchived = true;
    });

    it('disables the edit note button', () => {
      renderComponent();
      expect(screen.getByText('Edit Note')).toBeDisabled();
    });

    it('disables the duplicate note button', () => {
      renderComponent();
      expect(screen.getByText('Duplicate Note')).toBeDisabled();
    });

    it('calls onClickRestore when clicking the Restore note item', async () => {
      const { user } = renderComponent();
      await user.click(screen.getByText('Restore Note'));
      expect(props.onClickRestore).toHaveBeenCalledTimes(1);
    });

    it('renders icon based on props', () => {
      renderComponent({ icon: 'icon-testing' });
      expect(screen.getByTestId('icon-testing')).toBeInTheDocument();
    });

    it('renders icon-more as default icon', () => {
      renderComponent();
      expect(screen.getByTestId('icon-more')).toBeInTheDocument();
    });
  });
});
