import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { buildTemplates } from '../test_utils';
import FormList from '../../components/FormList';

describe('Questionnaire Templates <FormList /> component', () => {
  let user;
  let baseProps;
  const templates = buildTemplates(5);
  const templateIds = Object.keys(templates);

  beforeEach(() => {
    user = userEvent.setup();
    window.featureFlags = {}; // Reset feature flags for each test

    baseProps = {
      templates,
      rename: jest.fn(),
      duplicate: jest.fn(),
      delete: jest.fn(),
      toggleStatus: jest.fn(),
      onClickOpenSidePanel: jest.fn(),
      onClickColumnSorting: jest.fn(),
      column: 'name',
      direction: 'desc',
      t: i18nextTranslateStub(),
    };
  });

  it('renders the correct number of template rows', () => {
    render(<FormList {...baseProps} />);

    const rows = screen.getAllByRole('row');

    expect(rows).toHaveLength(Object.keys(templates).length + 1); // +1 for the header row
  });

  it('displays the template data correctly in the rows', () => {
    render(<FormList {...baseProps} />);

    const rows = screen.getAllByRole('row');

    // Check the content of the first row
    const firstRow = rows[1];
    const firstTemplateId = templateIds[0];
    const firstTemplate = templates[firstTemplateId];

    // Check status toggle, name, and last edited by
    expect(
      within(firstRow).getByRole('switch', { checked: firstTemplate.active })
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByRole('link', { name: firstTemplate.name })
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText(new RegExp(firstTemplate.last_edited_by, 'i'))
    ).toBeInTheDocument();
  });

  it('calls props.onClickColumnSorting when the "Form name" header is clicked', async () => {
    render(<FormList {...baseProps} />);

    const nameHeader = screen.getByRole('columnheader', { name: 'Form name' });
    await user.click(nameHeader);

    expect(baseProps.onClickColumnSorting).toHaveBeenCalledTimes(1);
    expect(baseProps.onClickColumnSorting).toHaveBeenCalledWith('name', 'asc'); // Flips from 'desc'
  });

  it('calls props.onClickColumnSorting when the "Last edited" header is clicked', async () => {
    render(<FormList {...baseProps} />);

    const lastEditedHeader = screen.getByRole('columnheader', {
      name: 'Last edited',
    });
    await user.click(lastEditedHeader);

    expect(baseProps.onClickColumnSorting).toHaveBeenCalledTimes(1);
    // This is a new column, so the component logic defaults it to 'desc'
    expect(baseProps.onClickColumnSorting).toHaveBeenCalledWith(
      'last_edited',
      'desc'
    );
  });

  it('calls props.toggleStatus when a template status is toggled', async () => {
    render(<FormList {...baseProps} />);

    const firstTemplateId = templateIds[0];
    const firstTemplate = templates[firstTemplateId];
    const rows = screen.getAllByRole('row');
    const firstRow = rows[1]; // First row after header

    const toggleSwitch = within(firstRow).getByRole('switch');
    await user.click(toggleSwitch);

    expect(baseProps.toggleStatus).toHaveBeenCalledTimes(1);
    expect(baseProps.toggleStatus).toHaveBeenCalledWith(firstTemplate);
  });

  describe('Row Actions', () => {
    it('calls props.rename when the user clicks the rename action', async () => {
      render(<FormList {...baseProps} />);
      const rows = screen.getAllByRole('row');
      const actionMenuButton = within(rows[1]).getByRole('button');

      await user.click(actionMenuButton);

      const renameAction = screen.getByRole('button', {
        name: /rename/i,
      });

      await user.click(renameAction);

      expect(baseProps.rename).toHaveBeenCalledTimes(1);
      expect(baseProps.rename).toHaveBeenCalledWith(
        templates[templateIds[0]].id
      );
    });

    it('calls props.duplicate when the user clicks the duplicate action', async () => {
      render(<FormList {...baseProps} />);
      const rows = screen.getAllByRole('row');
      const actionMenuButton = within(rows[1]).getByRole('button');

      await user.click(actionMenuButton);

      const duplicateAction = screen.getByRole('button', {
        name: /duplicate/i,
      });
      await user.click(duplicateAction);

      expect(baseProps.duplicate).toHaveBeenCalledTimes(1);
    });

    it('calls props.delete when the user clicks the delete action on an inactive template', async () => {
      const inactiveTemplate = { ...templates[templateIds[0]], active: false };
      const props = {
        ...baseProps,
        templates: { [inactiveTemplate.id]: inactiveTemplate },
      };
      render(<FormList {...props} />);
      const row = screen.getAllByRole('row')[1]; // First data row
      const actionMenuButton = within(row).getByRole('button');

      await user.click(actionMenuButton);
      const deleteAction = screen.getByRole('button', {
        name: /delete/i,
      });
      await user.click(deleteAction);
      expect(baseProps.delete).toHaveBeenCalledTimes(1);
      expect(baseProps.delete).toHaveBeenCalledWith(inactiveTemplate.id);
    });

    it('does not show the delete action for an active template', async () => {
      const activeTemplate = { ...templates[templateIds[0]], active: true };
      const props = {
        ...baseProps,
        templates: { [activeTemplate.id]: activeTemplate },
      };
      render(<FormList {...props} />);
      const row = screen.getAllByRole('row')[1];
      const actionMenuButton = within(row).getByRole('button');
      await user.click(actionMenuButton);
      expect(
        screen.queryByRole('button', { name: /delete/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('[feature-flag] forms-scheduling', () => {
    beforeEach(() => {
      window.featureFlags['forms-scheduling'] = true;
    });

    it('shows the schedule action and calls onClickOpenSidePanel when clicked', async () => {
      render(<FormList {...baseProps} />);
      const rows = screen.getAllByRole('row');
      const actionMenuButton = within(rows[1]).getByRole('button');

      await user.click(actionMenuButton);
      const scheduleAction = screen.getByRole('button', {
        name: /schedule/i,
      });
      await user.click(scheduleAction);

      expect(baseProps.onClickOpenSidePanel).toHaveBeenCalledTimes(1);
    });
  });

  describe('when forms-scheduling is disabled', () => {
    beforeEach(() => {
      window.featureFlags['forms-scheduling'] = false;
    });

    it('does not show the schedule action', async () => {
      render(<FormList {...baseProps} />);
      const rows = screen.getAllByRole('row');
      const actionMenuButton = within(rows[1]).getByRole('button');

      await user.click(actionMenuButton);

      expect(
        screen.queryByRole('button', { name: /schedule/i })
      ).not.toBeInTheDocument();
    });
  });
});
