import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemplateList from '../../templateView/TemplateList';

describe('TemplatesList component', () => {
  const props = {
    templates: [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
    ],
    onClickDeleteTemplate: jest.fn(),
    onClickRenameTemplate: jest.fn(),
    t: (key) => key,
  };

  beforeEach(() => {
    props.onClickDeleteTemplate.mockClear();
    props.onClickRenameTemplate.mockClear();
  });

  it('lists the templates', () => {
    render(<TemplateList {...props} />);
    expect(screen.getByText('Template 1')).toBeInTheDocument();
    expect(screen.getByText('Template 2')).toBeInTheDocument();
  });

  it('deletes a template after confirming in the modal', async () => {
    const user = userEvent.setup();
    render(<TemplateList {...props} />);

    const row = screen.getByText('Template 1').closest('tr');

    const deleteButton = row.querySelector(
      '.assessmentsTemplateList__deleteIcon'
    );
    await user.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: 'Delete' });
    await user.click(confirmButton);

    expect(props.onClickDeleteTemplate).toHaveBeenCalledTimes(1);
    expect(props.onClickDeleteTemplate).toHaveBeenCalledWith(1);
  });

  it('renames a template after confirming in the modal', async () => {
    const user = userEvent.setup();
    render(<TemplateList {...props} />);

    const row = screen.getByText('Template 1').closest('tr');

    const editButton = row.querySelector('.assessmentsTemplateList__editIcon');
    await user.click(editButton);

    const nameInput = await screen.findByDisplayValue('Template 1');

    fireEvent.change(nameInput, { target: { value: 'New template name' } });

    const confirmButton = screen.getByRole('button', { name: 'Save' });
    await user.click(confirmButton);

    expect(props.onClickRenameTemplate).toHaveBeenCalledTimes(1);
    expect(props.onClickRenameTemplate).toHaveBeenCalledWith(
      1,
      'New template name'
    );
  });
});
