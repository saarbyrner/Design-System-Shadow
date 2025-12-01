import {
  render,
  screen,
  within,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import StatusForm from '../../listView/StatusForm';
import PermissionsContext, {
  defaultPermissions,
} from '../../../contexts/PermissionsContext';

// MSW Server Setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Status Form component', () => {
  const baseProps = {
    assessmentId: 7,
    selectedAthlete: 3,
    onClickClose: jest.fn(),
    onClickSaveStatus: jest.fn(),
    users: [{ id: 1, name: 'John Doe' }],
    statusVariables: [
      {
        source_key: 'statsports|total_distance',
        name: 'Total distance',
        type: 'number',
      },
      {
        source_key: 'statsports|body_weight',
        name: 'Body Weight',
        type: 'number',
      },
    ],
    t: (key) => key,
  };

  const statusFixture = {
    id: 1,
    notes: [{ id: 1, note: { content: 'This is a note' }, users: [{ id: 1 }] }],
    period_length: 5,
    period_scope: 'last_x_days',
    source: 'statsports',
    summary: 'sum',
    variable: 'total_distance',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
    baseProps.onClickSaveStatus.mockClear();

    server.use(
      rest.post('*/statuses/calculate_value', (req, res, ctx) => {
        return res(ctx.json({ value: 9 }));
      })
    );
  });

  const getDropdownButtonByLabel = (name) => {
    const label = screen.getByText(name);
    const container = label.closest('.dropdown');
    return container.querySelector('button');
  };

  it('has the note and user fields optional', async () => {
    render(<StatusForm {...baseProps} />);
    const user = userEvent.setup();
    await user.click(getDropdownButtonByLabel('Data Source'));
    await user.click(await screen.findByText('Total distance'));
    await user.click(getDropdownButtonByLabel('Calculation'));
    await user.click(await screen.findByText('Sum'));
    const periodInput = screen.getByRole('spinbutton');
    fireEvent.change(periodInput, { target: { value: '5' } });

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(baseProps.onClickSaveStatus).toHaveBeenCalled();
  });

  it('disables the calculation field when a metric is not selected', () => {
    render(<StatusForm {...baseProps} />);
    expect(getDropdownButtonByLabel('Calculation')).toBeDisabled();
  });

  it('populates the calculation dropdown with correct items', async () => {
    render(<StatusForm {...baseProps} />);
    const user = userEvent.setup();
    await user.click(getDropdownButtonByLabel('Data Source'));
    await user.click(await screen.findByText('Total distance'));

    await user.click(getDropdownButtonByLabel('Calculation'));

    expect(await screen.findByText('Last Value')).toBeInTheDocument();
    expect(await screen.findByText('Sum')).toBeInTheDocument();
    expect(await screen.findByText('Mean')).toBeInTheDocument();
  });

  describe('Permissions', () => {
    it('disables fields when user does not have create permission', () => {
      const permissions = { ...defaultPermissions, createAssessment: false };
      render(
        <PermissionsContext.Provider value={permissions}>
          <StatusForm {...baseProps} />
        </PermissionsContext.Provider>
      );
      expect(getDropdownButtonByLabel('Data Source')).toBeDisabled();
    });

    it('disables fields when editing without edit permission', () => {
      const permissions = { ...defaultPermissions, editAssessment: false };
      render(
        <PermissionsContext.Provider value={permissions}>
          <StatusForm {...baseProps} status={statusFixture} />
        </PermissionsContext.Provider>
      );
      expect(getDropdownButtonByLabel('Data Source')).toBeDisabled();
    });

    it('disables note fields when user does not have answer permission', () => {
      const permissions = { ...defaultPermissions, answerAssessment: false };
      const { container } = render(
        <PermissionsContext.Provider value={permissions}>
          <StatusForm {...baseProps} />
        </PermissionsContext.Provider>
      );
      const commentLabel = container.querySelector('.textarea__label');
      const commentTextarea = commentLabel.nextElementSibling;
      expect(commentTextarea).toBeDisabled();
    });

    it('disables note fields for protected statuses without permission', () => {
      const permissions = {
        ...defaultPermissions,
        viewProtectedMetrics: false,
      };
      const { container } = render(
        <PermissionsContext.Provider value={permissions}>
          <StatusForm
            {...baseProps}
            status={{ ...statusFixture, is_protected: true }}
          />
        </PermissionsContext.Provider>
      );
      const commentLabel = container.querySelector('.textarea__label');
      const commentTextarea = commentLabel.nextElementSibling;
      expect(commentTextarea).toBeDisabled();
    });
  });

  describe('Editing a status', () => {
    it('populates the fields with existing status values', () => {
      render(<StatusForm {...baseProps} status={statusFixture} />);

      expect(screen.getByText('Total distance')).toBeInTheDocument();

      const selectedCalculation = screen.getByText(
        (content, element) =>
          element.textContent === 'Sum' &&
          element.classList.contains('customDropdown__value')
      );
      expect(selectedCalculation).toBeInTheDocument();

      const selectedUser = screen.getByText(
        (content, element) =>
          element.textContent.trim() === 'John Doe' &&
          element.classList.contains('customDropdown__value')
      );
      expect(selectedUser).toBeInTheDocument();

      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('This is a note')).toBeInTheDocument();
    });

    it('saves the status with existing data when clicking save', async () => {
      render(<StatusForm {...baseProps} status={statusFixture} />);
      const user = userEvent.setup();

      const expectedPayload = {
        id: 1,
        notes: [
          {
            id: 1,
            note: 'This is a note',
            user_ids: [1],
          },
        ],
        period_length: 5,
        period_scope: 'last_x_days',
        source: 'statsports',
        summary: 'sum',
        variable: 'total_distance',
      };

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSaveStatus).toHaveBeenCalledTimes(1);
      expect(baseProps.onClickSaveStatus).toHaveBeenCalledWith(expectedPayload);
    });

    it('resets the calculation when selecting a new metric', async () => {
      const user = userEvent.setup();
      render(<StatusForm {...baseProps} status={statusFixture} />);

      const selectedValue = screen.getByText((content, element) => {
        return (
          element.tagName.toLowerCase() === 'span' &&
          element.classList.contains('customDropdown__value') &&
          content.trim() === 'Sum'
        );
      });
      expect(selectedValue).toBeInTheDocument();

      await user.click(getDropdownButtonByLabel('Data Source'));
      await user.click(await screen.findByText('Body Weight'));

      expect(selectedValue).not.toHaveTextContent('Sum');
    });

    it('clears the user dropdown when clicking its clear button', async () => {
      render(<StatusForm {...baseProps} status={statusFixture} />);
      const user = userEvent.setup();

      const userDropdownContainer = screen
        .getByText('User')
        .closest('.dropdown');

      const selectedUserValue = within(userDropdownContainer).getByText(
        (content, element) =>
          element.classList.contains('customDropdown__value') &&
          content.trim() === 'John Doe'
      );
      expect(selectedUserValue).toBeInTheDocument();

      await user.click(within(userDropdownContainer).getByText('clear'));

      expect(selectedUserValue).not.toHaveTextContent('John Doe');
    });
  });

  describe('Saving a new status', () => {
    it('saves the new status with all data when clicking save', async () => {
      const user = userEvent.setup();
      const { container } = render(<StatusForm {...baseProps} />);

      await user.click(getDropdownButtonByLabel('Data Source'));
      await user.click(await screen.findByText('Total distance'));

      await user.click(getDropdownButtonByLabel('Calculation'));
      await user.click(await screen.findByText('Sum'));

      const periodInput = screen.getByRole('spinbutton');
      fireEvent.change(periodInput, { target: { value: '5' } });

      await user.click(getDropdownButtonByLabel('User'));
      await user.click(await screen.findByText('John Doe'));

      const commentLabel = container.querySelector('.textarea__label');
      const commentTextarea = commentLabel.nextElementSibling;
      fireEvent.change(commentTextarea, { target: { value: 'New note' } });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSaveStatus).toHaveBeenCalledWith({
        id: null,
        source: 'statsports',
        variable: 'total_distance',
        summary: 'sum',
        period_scope: 'last_x_days',
        period_length: 5,
        notes: [{ id: null, note: 'New note', user_ids: [1] }],
      });
    });
  });

  describe('API Calls and Dependent Fields', () => {
    it('fetches the status score only when the form becomes valid', async () => {
      const requestSpy = jest.fn();
      const user = userEvent.setup();
      server.use(
        rest.post('*/statuses/calculate_value', async (req, res, ctx) => {
          requestSpy();
          return res(ctx.json({ value: 9 }));
        })
      );
      render(<StatusForm {...baseProps} />);

      await user.click(getDropdownButtonByLabel('Data Source'));
      await user.click(await screen.findByText('Total distance'));
      expect(requestSpy).not.toHaveBeenCalled();

      await user.click(getDropdownButtonByLabel('Calculation'));
      await user.click(await screen.findByText('Sum'));
      expect(requestSpy).not.toHaveBeenCalled();

      const periodInput = screen.getByRole('spinbutton');
      fireEvent.change(periodInput, { target: { value: '5' } });

      expect(await screen.findByText('9')).toBeInTheDocument();
      expect(requestSpy).toHaveBeenCalledTimes(1);
    });

    it('shows an error icon when fetching the score fails', async () => {
      server.use(
        rest.post('*/statuses/calculate_value', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      const { container } = render(
        <StatusForm {...baseProps} status={statusFixture} />
      );

      await waitFor(() => {
        const errorIcon = container.querySelector(
          '.assessmentsStatusForm__fetchScoreError'
        );
        expect(errorIcon).toBeInTheDocument();
      });
    });
  });

  describe('Feature Flags', () => {
    it('fetches score with athlete_id when ff is on', async () => {
      window.featureFlags['assessments-multiple-athletes'] = true;
      const requestSpy = jest.fn();
      server.use(
        rest.post(
          '*/assessment_groups/7/statuses/calculate_value',
          async (req, res, ctx) => {
            requestSpy(await req.json());
            return res(ctx.json({ value: 9 }));
          }
        )
      );

      render(<StatusForm {...baseProps} status={statusFixture} />);
      await waitFor(() => expect(requestSpy).toHaveBeenCalled());
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({ athlete_id: 3 })
      );
    });

    it('saves the new status with all data when clicking save', async () => {
      const user = userEvent.setup();
      const { container } = render(<StatusForm {...baseProps} />);

      await user.click(getDropdownButtonByLabel('Data Source'));
      await user.click(await screen.findByText('Total distance'));

      await user.click(getDropdownButtonByLabel('Calculation'));
      await user.click(await screen.findByText('Sum'));

      const periodInput = screen.getByRole('spinbutton');
      fireEvent.change(periodInput, { target: { value: '5' } });

      await user.click(getDropdownButtonByLabel('User'));
      await user.click(await screen.findByText('John Doe'));

      const commentLabel = container.querySelector('.textarea__label');
      const commentTextarea = commentLabel.nextElementSibling;
      fireEvent.change(commentTextarea, { target: { value: 'New note' } });

      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(baseProps.onClickSaveStatus).toHaveBeenCalledWith({
        id: null,
        source: 'statsports',
        variable: 'total_distance',
        summary: 'sum',
        period_scope: 'last_x_days',
        period_length: 5,
        notes: [{ id: null, note: 'New note', user_ids: [1] }],
      });
    });

    it('renders a rich text editor when ff is on', () => {
      window.featureFlags['rich-text-editor'] = true;
      const { container } = render(<StatusForm {...baseProps} />);

      expect(container.querySelector('.richTextEditor')).toBeInTheDocument();
    });
  });
});
