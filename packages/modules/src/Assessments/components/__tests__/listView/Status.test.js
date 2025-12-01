import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  defaultPermissions,
} from '../../../contexts/PermissionsContext';
import Status from '../../listView/Status';

describe('Status component', () => {
  let baseProps;
  const requestSpy = jest.fn();

  beforeEach(() => {
    requestSpy.mockClear();

    server.use(
      rest.post(
        'http://localhost/assessments/:assessmentId/statuses/calculate_value',
        async (req, res, ctx) => {
          requestSpy(await req.json());
          return res(ctx.status(200), ctx.json({ value: 9 }));
        }
      ),
      rest.post(
        'http://localhost/assessment_groups/:assessmentId/statuses/calculate_value',
        async (req, res, ctx) => {
          requestSpy(await req.json());
          return res(ctx.status(200), ctx.json({ value: 9 }));
        }
      )
    );

    baseProps = {
      assessmentId: 7,
      selectedAthlete: 3,
      status: {
        id: 1,
        source: 'statsports',
        variable: 'total_distance',
        summary: 'sum',
        period_scope: 'last_x_days',
        period_length: 5,
        notes: [
          {
            note: {
              content: 'This is a note',
              edit_history: {
                user: { id: 93600, fullname: 'John Doe' },
                date: '2020-09-24T14:00:00Z',
              },
            },
            users: [{ id: 1, fullname: 'John Doe' }],
          },
        ],
      },
      isCurrentSquad: true,
      onClickDeleteStatus: jest.fn(),
      onClickSaveStatus: jest.fn(),
      users: [{ id: 1, name: 'John Doe' }],
      statusVariables: [
        { source_key: 'statsports|total_distance', name: 'Total distance' },
      ],
      showNotes: true,
      showReordering: false,
      t: i18nextTranslateStub(),
    };
  });

  it('renders the status informations and fetches the score', async () => {
    render(<Status {...baseProps} />);
    expect(
      await screen.findByRole('heading', { name: 'Total distance' })
    ).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a note')).toBeInTheDocument();
    expect(await screen.findByText('9')).toBeInTheDocument();
  });

  it('does not render the note and user if they are null', async () => {
    const propsWithNulls = {
      ...baseProps,
      status: { ...baseProps.status, notes: [{ note: null, users: [] }] },
    };
    render(<Status {...propsWithNulls} />);
    // The component still fetches, so we wait for the score to appear before checking absences
    await screen.findByText('9');
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByText('This is a note')).not.toBeInTheDocument();
  });

  it('deletes the status when clicking the delete button', async () => {
    const user = userEvent.setup();
    render(<Status {...baseProps} />);
    const statusContainer = (await screen.findByText('9')).closest(
      '.assessmentsStatus'
    );
    const optionsButton = within(statusContainer).getByRole('button');
    await user.click(optionsButton);
    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    expect(await screen.findByText('Delete status?')).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    await user.click(confirmButton);
    expect(baseProps.onClickDeleteStatus).toHaveBeenCalledTimes(1);
  });

  it('shows the Status Form when clicking Edit in the menu', async () => {
    const user = userEvent.setup();
    render(<Status {...baseProps} />);
    const statusContainer = (await screen.findByText('9')).closest(
      '.assessmentsStatus'
    );
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
    const optionsButton = within(statusContainer).getByRole('button');
    await user.click(optionsButton);
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await user.click(editButton);
    expect(
      await screen.findByRole('button', { name: 'Save' })
    ).toBeInTheDocument();
  });

  it('hides the notes when showNotes is false', () => {
    render(<Status {...baseProps} showNotes={false} />);
    expect(screen.queryByText('This is a note')).not.toBeInTheDocument();
  });

  it('shows an error icon when fetching the score fails', async () => {
    server.use(
      rest.post(
        'http://localhost/assessments/:assessmentId/statuses/calculate_value',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );
    const { container } = render(<Status {...baseProps} />);
    await waitFor(() => {
      expect(
        container.querySelector('.assessmentsStatus__fetchScoreError')
      ).toBeInTheDocument();
    });
  });

  describe('Permissions', () => {
    it('disables the edit status button without editAssessment permission', async () => {
      const user = userEvent.setup();
      render(
        <PermissionsContext.Provider
          value={{
            ...defaultPermissions,
            editAssessment: false,
            answerAssessment: false,
          }}
        >
          <Status {...baseProps} />
        </PermissionsContext.Provider>
      );
      const statusContainer = (
        await screen.findByRole('heading', { name: 'Total distance' })
      ).closest('.assessmentsStatus');
      const optionsButton = within(statusContainer).getByRole('button');
      await user.click(optionsButton);
      const editButton = await screen.findByRole('button', { name: /edit/i });
      expect(editButton).toHaveClass('tooltipMenu__item--disabled');
    });

    it('disables the delete status buttons without deleteAssessment permission', async () => {
      const user = userEvent.setup();
      render(
        <PermissionsContext.Provider
          value={{ ...defaultPermissions, deleteAssessment: false }}
        >
          <Status {...baseProps} />
        </PermissionsContext.Provider>
      );
      const statusContainer = (
        await screen.findByRole('heading', { name: 'Total distance' })
      ).closest('.assessmentsStatus');
      const optionsButton = within(statusContainer).getByRole('button');
      await user.click(optionsButton);
      const deleteButton = await screen.findByRole('button', {
        name: /delete/i,
      });
      expect(deleteButton).toHaveClass('tooltipMenu__item--disabled');
    });
  });

  describe('[feature-flag] assessments-multiple-athletes', () => {
    beforeEach(() => {
      window.featureFlags['assessments-multiple-athletes'] = true;
    });
    afterEach(() => {
      window.featureFlags['assessments-multiple-athletes'] = false;
    });

    it('fetches data using the assessment_groups endpoint', async () => {
      render(<Status {...baseProps} />);
      expect(await screen.findByText('9')).toBeInTheDocument();
      expect(requestSpy).toHaveBeenCalledWith(
        expect.objectContaining({ athlete_id: 3 })
      );
    });

    describe('when the assessment squad does not match the current squad', () => {
      it('hides action buttons', async () => {
        render(<Status {...baseProps} isCurrentSquad={false} />);
        const statusContainer = (await screen.findByText('9')).closest(
          '.assessmentsStatus'
        );
        expect(
          within(statusContainer).queryByRole('button')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      });
    });
  });
});
