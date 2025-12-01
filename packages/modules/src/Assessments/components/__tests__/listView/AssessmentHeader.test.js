import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  defaultPermissions,
} from '@kitman/modules/src/Assessments/contexts/PermissionsContext';
import AssessmentHeader from '../../listView/AssessmentHeader';

describe('AssessmentHeader component', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      assessmentHeader: { id: 1, name: 'Header name' },
      isCurrentSquad: true,
      showReordering: false,
      onClickSave: jest.fn(),
      onClickDelete: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the header name', () => {
    render(<AssessmentHeader {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Header name' })
    ).toBeInTheDocument();
  });

  it('shows the header form when the edit button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<AssessmentHeader {...baseProps} />);

    const optionsButton = container.querySelector(
      '.assessmentHeader__dropdownMenuBtn'
    );
    await user.click(optionsButton);

    await user.click(await screen.findByRole('button', { name: 'Edit' }));

    expect(await screen.findByDisplayValue('Header name')).toBeInTheDocument();
  });

  it('saves a new header name when the form is submitted', async () => {
    const user = userEvent.setup();
    const { container } = render(<AssessmentHeader {...baseProps} />);

    const optionsButton = container.querySelector(
      '.assessmentHeader__dropdownMenuBtn'
    );
    await user.click(optionsButton);
    await user.click(await screen.findByRole('button', { name: 'Edit' }));

    const input = await screen.findByDisplayValue('Header name');
    await user.clear(input);
    await fireEvent.change(input, { target: { value: 'New Header Name' } });
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(baseProps.onClickSave).toHaveBeenCalledTimes(1);
    expect(baseProps.onClickSave).toHaveBeenCalledWith({
      id: 1,
      name: 'New Header Name',
    });
  });

  it('calls the delete callback when deleting is confirmed', async () => {
    const user = userEvent.setup();
    const { container } = render(<AssessmentHeader {...baseProps} />);

    const optionsButton = container.querySelector(
      '.assessmentHeader__dropdownMenuBtn'
    );
    await user.click(optionsButton);

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    const dialog = await screen.findByTestId('AppStatus-warning');
    const confirmButton = within(dialog).getByRole('button', {
      name: 'Delete',
    });
    await user.click(confirmButton);

    expect(baseProps.onClickDelete).toHaveBeenCalledTimes(1);
  });

  it('shows the reordering handle when showReordering is true', () => {
    const { container } = render(
      <AssessmentHeader {...baseProps} showReordering />
    );
    expect(
      container.querySelector('.assessmentReorderHandle')
    ).toBeInTheDocument();
  });

  it('disables the options menu when showReordering is true', () => {
    const { container } = render(
      <AssessmentHeader {...baseProps} showReordering />
    );
    const optionsButton = container.querySelector(
      '.assessmentHeader__dropdownMenuBtn'
    );
    expect(optionsButton).toHaveClass(
      'assessmentHeader__dropdownMenuBtn--disabled'
    );
  });

  it('does not render the options menu when isCurrentSquad is false', () => {
    const { container } = render(
      <AssessmentHeader {...baseProps} isCurrentSquad={false} />
    );
    expect(
      container.querySelector('.assessmentHeader__dropdownMenuBtn')
    ).not.toBeInTheDocument();
  });

  describe('Permissions', () => {
    it('disables the edit button if user lacks editAssessment permission', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, editAssessment: false }}
        >
          <AssessmentHeader {...baseProps} />
        </PermissionsContext.Provider>
      );

      const optionsButton = container.querySelector(
        '.assessmentHeader__dropdownMenuBtn'
      );
      await user.click(optionsButton);

      const editButton = await screen.findByRole('button', { name: 'Edit' });
      expect(editButton).toHaveClass('tooltipMenu__item--disabled');
    });

    it('disables the delete button if user lacks deleteAssessment permission', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, deleteAssessment: false }}
        >
          <AssessmentHeader {...baseProps} />
        </PermissionsContext.Provider>
      );

      const optionsButton = container.querySelector(
        '.assessmentHeader__dropdownMenuBtn'
      );
      await user.click(optionsButton);

      const deleteButton = await screen.findByRole('button', {
        name: 'Delete',
      });
      expect(deleteButton).toHaveClass('tooltipMenu__item--disabled');
    });
  });
});
