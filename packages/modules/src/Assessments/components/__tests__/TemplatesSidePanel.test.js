import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TemplatesSidePanel from '../TemplatesSidePanel';

describe('TemplatesSidePanel component', () => {
  const baseProps = {
    templates: [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ],
    onClickClose: jest.fn(),
    onClickDeleteTemplate: jest.fn(),
    onClickRenameTemplate: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists all the templates', () => {
    render(<TemplatesSidePanel {...baseProps} />);

    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
  });

  it('deletes a template after user confirmation', async () => {
    const user = userEvent.setup();
    const { container } = render(<TemplatesSidePanel {...baseProps} />);

    const deleteButtons = container.querySelectorAll(
      '.assessmentsTemplateList__deleteIcon'
    );

    await user.click(deleteButtons[0]);

    const confirmButton = await screen.findByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    expect(baseProps.onClickDeleteTemplate).toHaveBeenCalledTimes(1);
    expect(baseProps.onClickDeleteTemplate).toHaveBeenCalledWith(1);
  });

  it('renames a template after user submission', async () => {
    const user = userEvent.setup();
    const { container } = render(<TemplatesSidePanel {...baseProps} />);

    const renameButtons = container.querySelectorAll(
      '.assessmentsTemplateList__editIcon'
    );

    await user.click(renameButtons[0]);
    const nameInput = await screen.findByDisplayValue('Template 1');

    await user.clear(nameInput);
    fireEvent.change(nameInput, { target: { value: 'New template name' } });

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(baseProps.onClickRenameTemplate).toHaveBeenCalledTimes(1);
    expect(baseProps.onClickRenameTemplate).toHaveBeenCalledWith(
      1,
      'New template name'
    );
  });
});
