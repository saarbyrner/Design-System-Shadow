import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as useEventTrackingHook from '@kitman/common/src/hooks/useEventTracking';
import DevelopmentGoalForm from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<DevelopmentGoalForm />', () => {
  const mockTrackEvent = jest.fn();

  const defaultProps = {
    developmentGoalTypes: [],
    principles: [],
    athletes: [
      {
        label: 'Position Group',
        options: [
          { label: 'Athlete 1', value: 1 },
          { label: 'Athlete 2', value: 2 },
          { label: 'Athlete 3', value: 3 },
        ],
      },
    ],
    isOpen: true,
    requestStatus: null,
    initialFormData: {
      id: null,
      athlete_id: null,
      description: '',
      development_goal_type_ids: [],
      principle_ids: [],
      start_time: null,
      close_time: null,
      copy_to_athlete_ids: [],
    },
    onClickCloseSidePanel: jest.fn(),
    onValidationSuccess: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const getAthleteField = () =>
    screen.getByTestId('DevelopmentGoalForm|AthleteRow').querySelector('input');
  const getDescriptionField = () => screen.getByRole('textbox', { name: '' });
  const getTypeField = () =>
    screen.getByTestId('DevelopmentGoalForm|TypeRow').querySelector('input');
  const getPrincipleField = () =>
    screen
      .queryByTestId('DevelopmentGoalForm|PrincipleRow')
      ?.querySelector('input');
  const getStartDateField = () => screen.getByLabelText('Start date');
  const getCloseDateField = () => screen.getByLabelText('Close date');

  beforeEach(() => {
    jest.clearAllMocks();
    useEventTrackingHook.default.mockReturnValue({
      trackEvent: mockTrackEvent,
    });
  });

  it('renders a side panel', () => {
    render(<DevelopmentGoalForm {...defaultProps} />);

    expect(screen.getByText('Add Development Goal')).toBeInTheDocument();
  });

  it('renders the correct title when editing a development goal', () => {
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        initialFormData={{ ...defaultProps.initialFormData, id: 10 }}
      />
    );

    expect(screen.getByText('Edit Development Goal')).toBeVisible();
  });

  it('does not render the principle field as optional', () => {
    render(<DevelopmentGoalForm {...defaultProps} />);

    expect(getPrincipleField()).toBeUndefined();
  });

  it('renders the close date field as optional', () => {
    render(<DevelopmentGoalForm {...defaultProps} />);

    expect(screen.getByText('Optional')).toBeInTheDocument();
  });

  it('renders a clear button for the close date field', () => {
    render(<DevelopmentGoalForm {...defaultProps} />);

    expect(getCloseDateField()).toBeInTheDocument();
  });

  it('calls onClickCloseSidePanel when closing the side panel', async () => {
    const user = userEvent.setup();
    render(<DevelopmentGoalForm {...defaultProps} />);

    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(defaultProps.onClickCloseSidePanel).toHaveBeenCalledTimes(1);
  });

  it('calls onClickCloseSidePanel when clicking the cancel button', async () => {
    const user = userEvent.setup();
    render(<DevelopmentGoalForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(defaultProps.onClickCloseSidePanel).toHaveBeenCalledTimes(1);
  });

  it('calls onClickSave with the correct arguments and tracking event when filling the form and clicking save', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      developmentGoalTypes: [{ label: 'Type 1', value: 1 }],
      initialFormData: {
        ...defaultProps.initialFormData,
        athlete_id: 10,
        description: 'Development Goal Description',
        development_goal_type_ids: [1],
        start_time: '2020-01-01T00:00:00+00:00',
      },
    };

    render(<DevelopmentGoalForm {...props} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(props.onValidationSuccess).toHaveBeenCalled();
    expect(mockTrackEvent).toHaveBeenCalledWith('Add development goal');
  });

  it('shows the form errors on save', async () => {
    const user = userEvent.setup();
    render(<DevelopmentGoalForm {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(getAthleteField()).toBeInTheDocument();
    });

    expect(getDescriptionField()).toBeInTheDocument();
    expect(getTypeField()).toBeInTheDocument();
    expect(getStartDateField()).toBeInTheDocument();
  });

  it('resets the form when closing the panel', () => {
    const { rerender } = render(<DevelopmentGoalForm {...defaultProps} />);

    // Close the panel
    rerender(<DevelopmentGoalForm {...defaultProps} isOpen={false} />);

    // Reopen the panel
    rerender(<DevelopmentGoalForm {...defaultProps} isOpen />);

    const fields = [
      getAthleteField(),
      getDescriptionField(),
      getStartDateField(),
      getCloseDateField(),
    ];

    fields.forEach((field) => {
      expect(field).toHaveValue('');
    });
  });

  it('disables all the panel content when the development goal is saving', () => {
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        requestStatus="LOADING"
        areCoachingPrinciplesEnabled
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(cancelButton).toBeDisabled();
    expect(saveButton).toBeDisabled();

    const fieldsToDisable = [
      getAthleteField(),
      getDescriptionField(),
      getTypeField(),
      getStartDateField(),
      getCloseDateField(),
    ];

    fieldsToDisable.forEach((field) => {
      expect(field).toBeDisabled();
    });
  });

  it("disables the athlete field if `formMode` is 'EDIT'", () => {
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        initialFormData={{ ...defaultProps.initialFormData, id: 1 }}
        areCoachingPrinciplesEnabled
      />
    );

    expect(getAthleteField()).toBeDisabled();
  });

  it("enables the athlete field if `formMode` is 'CREATE'", () => {
    render(
      <DevelopmentGoalForm {...defaultProps} areCoachingPrinciplesEnabled />
    );

    expect(getAthleteField()).toBeEnabled();
  });

  it('shows an error message when the request fails', () => {
    render(<DevelopmentGoalForm {...defaultProps} requestStatus="FAILURE" />);

    expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument();
  });

  it('calls onClickSave with the correct arguments when editing a development goal and clicking save', async () => {
    const user = userEvent.setup();
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        initialFormData={{
          id: 1,
          athlete_id: 1,
          description: 'Description',
          development_goal_type_ids: [1],
          principle_ids: [],
          start_time: '2020-01-01',
          close_time: '2020-01-02',
          copy_to_athlete_ids: [],
        }}
      />
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    expect(defaultProps.onValidationSuccess).toHaveBeenCalledWith({
      id: 1,
      athlete_id: 1,
      description: 'Description',
      development_goal_type_ids: [1],
      principle_ids: [],
      start_time: '2020-01-01',
      close_time: '2020-01-02',
      copy_to_athlete_ids: [],
    });
  });

  it("unselects an athlete from the 'copy to athletes' dropdown if being selected in the main athlete dropdown", async () => {
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        initialFormData={{
          ...defaultProps.initialFormData,
          copy_to_athlete_ids: [2],
        }}
      />
    );

    expect(
      screen.getByTestId('DevelopmentGoalForm|CopyToAthleteRow')
    ).toBeInTheDocument();
    expect(screen.getByText('Athlete 2')).toBeInTheDocument();
  });

  it('shows the correct terminology when developmentGoalTerminology exists', async () => {
    const user = userEvent.setup();
    render(
      <DevelopmentGoalForm
        {...defaultProps}
        developmentGoalTerminology="Custom terminology"
      />
    );

    expect(screen.getByText('Add Custom terminology')).toBeInTheDocument();
    expect(screen.getByText('Custom terminology')).toBeVisible();

    const copyToAthleteBtn = screen.getByRole('button', {
      name: 'Copy to more athletes',
    });
    await user.click(copyToAthleteBtn);

    expect(
      screen.getByText(
        'Copying to more athletes will create separate versions of the Custom terminology.'
      )
    ).toBeInTheDocument();
  });

  describe('When areCoachingPrinciplesEnabled is enabled', () => {
    it('shows the form errors on save', async () => {
      const user = userEvent.setup();
      render(
        <DevelopmentGoalForm {...defaultProps} areCoachingPrinciplesEnabled />
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(getDescriptionField()).toBeInTheDocument();
      expect(getTypeField()).toBeInTheDocument();
      expect(getPrincipleField()).toBeInTheDocument();
      expect(getStartDateField()).toBeInTheDocument();
    });

    it('renders the principle field as optional', () => {
      render(
        <DevelopmentGoalForm {...defaultProps} areCoachingPrinciplesEnabled />
      );

      expect(getPrincipleField()).toBeInTheDocument();
      expect(screen.getAllByText('Optional')).toHaveLength(2);
    });

    it('resets the form when closing the panel', () => {
      const { rerender } = render(
        <DevelopmentGoalForm {...defaultProps} areCoachingPrinciplesEnabled />
      );

      // Close the panel
      rerender(
        <DevelopmentGoalForm
          {...defaultProps}
          areCoachingPrinciplesEnabled
          isOpen={false}
        />
      );

      // Reopen the panel
      rerender(
        <DevelopmentGoalForm
          {...defaultProps}
          areCoachingPrinciplesEnabled
          isOpen
        />
      );

      const fields = [
        getAthleteField(),
        getDescriptionField(),
        getPrincipleField(),
        getStartDateField(),
        getCloseDateField(),
      ];

      fields.forEach((field) => {
        expect(field).toHaveValue('');
      });
    });

    it('calls onClickSave with the correct arguments when filling the form and clicking save', async () => {
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        areCoachingPrinciplesEnabled: true,
        developmentGoalTypes: [{ label: 'Type 1', value: 1 }],
        principles: [{ label: 'Principle 1', value: 1 }],
        initialFormData: {
          ...defaultProps.initialFormData,
          athlete_id: 10,
          description: 'Development Goal Description',
          development_goal_type_ids: [1],
          start_time: '2020-01-01T00:00:00+00:00',
        },
      };

      render(<DevelopmentGoalForm {...props} />);

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(props.onValidationSuccess).toHaveBeenCalled();
      expect(mockTrackEvent).toHaveBeenCalledWith('Add development goal');
    });

    it('calls onClickSave with the correct arguments when editing a development goal and clicking save', async () => {
      const user = userEvent.setup();
      render(
        <DevelopmentGoalForm
          {...defaultProps}
          areCoachingPrinciplesEnabled
          initialFormData={{
            id: 1,
            athlete_id: 1,
            description: 'Description',
            development_goal_type_ids: [1],
            principle_ids: [],
            start_time: '2020-01-01',
            close_time: '2020-01-02',
            copy_to_athlete_ids: [],
          }}
        />
      );

      const saveButton = screen.getByRole('button', { name: 'Save' });
      await user.click(saveButton);

      expect(defaultProps.onValidationSuccess).toHaveBeenCalledWith({
        id: 1,
        athlete_id: 1,
        description: 'Description',
        development_goal_type_ids: [1],
        principle_ids: [],
        start_time: '2020-01-01',
        close_time: '2020-01-02',
        copy_to_athlete_ids: [],
      });
    });
  });
});
