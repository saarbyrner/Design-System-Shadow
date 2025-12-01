import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AssessmentsList from '../AssessmentsList';
import PermissionsContext, {
  defaultPermissions,
} from '../../contexts/PermissionsContext';

describe('AssessmentsList component', () => {
  const baseProps = {
    assessments: [
      { id: 1, name: 'Assessment 1', items: [] },
      { id: 2, name: 'Assessment 2', items: [] },
    ],
    filteredTemplates: [],
    assessmentTemplates: [],
    organisationTrainingVariables: [],
    isLoading: false,
    t: i18nextTranslateStub() || 'Add Form',
    fetchAssessments: jest.fn(),
  };

  it('renders a no assessment tile when the athlete has no assessments', () => {
    render(<AssessmentsList {...baseProps} assessments={[]} isFullyLoaded />);
    const noAssessmentButton = screen.getByText(
      (content, element) =>
        element.textContent === 'Add form' &&
        element.classList.contains(
          'assessmentsNoAssessment__addAssessmentBtnLabel'
        )
    );
    expect(noAssessmentButton).toBeInTheDocument();
  });

  it('renders a message when no assessments match the template filter', () => {
    render(
      <AssessmentsList
        {...baseProps}
        assessments={[]}
        filteredTemplates={[1]}
        isFullyLoaded
      />
    );
    expect(
      screen.getByText('No forms meet filter criteria')
    ).toBeInTheDocument();
  });

  it('renders a loader when isLoading is true', () => {
    render(
      <AssessmentsList
        {...baseProps}
        assessments={[]}
        isLoading
        isFullyLoaded
      />
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders a list of assessments', () => {
    render(<AssessmentsList {...baseProps} />);
    expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    expect(screen.getByText('Assessment 2')).toBeInTheDocument();
  });

  it('shows and hides the assessment form when adding an assessment', async () => {
    const user = userEvent.setup();
    render(<AssessmentsList {...baseProps} assessments={[]} isFullyLoaded />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const addBtn = screen.getByText(
      (content, element) =>
        element.textContent === 'Add form' &&
        element.classList.contains(
          'assessmentsNoAssessment__addAssessmentBtnLabel'
        )
    );
    await user.click(addBtn);

    const modal = await screen.findByRole('dialog', { name: 'Modal' });
    expect(modal).toBeInTheDocument();

    const closeButton = modal.querySelector('.reactModal__closeBtn');
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the assessment form with correct data when clicking Edit', async () => {
    const user = userEvent.setup();
    render(<AssessmentsList {...baseProps} />);

    const assessmentWidget = screen
      .getByText('Assessment 1')
      .closest('.assessmentWidget');

    const moreOptionsButton = within(assessmentWidget).getByRole('button', {
      name: '', // The icon-only button
    });
    await user.click(moreOptionsButton);

    const editDetailsButton = await screen.findByRole('button', {
      name: 'Edit details',
    });
    await user.click(editDetailsButton);

    const saveButton = await screen.findByRole('button', { name: 'Save' });
    expect(saveButton).toBeInTheDocument();
  });

  it('shows and hides the templates side panel', async () => {
    const user = userEvent.setup();
    render(
      <AssessmentsList
        {...baseProps}
        assessmentTemplates={[{ id: 99, name: 'My Template' }]}
      />
    );

    expect(screen.queryByText('Templates')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const panelTitle = await screen.findByText('Templates');
    expect(panelTitle).toBeInTheDocument();

    const closeButton = screen.getByTestId('panel-close-button');
    await user.click(closeButton);

    expect(screen.queryByText('Templates')).not.toBeInTheDocument();
  });

  describe('When the user does not have create permission', () => {
    it('disables the create assessment button', () => {
      const permissions = {
        ...defaultPermissions,
        createAssessment: false,
        createAssessmentFromTemplate: false,
      };
      render(
        <PermissionsContext.Provider value={permissions}>
          <AssessmentsList {...baseProps} assessments={[]} isFullyLoaded />
        </PermissionsContext.Provider>
      );

      const addBtnParent = screen.getByText(
        (content, element) =>
          element.textContent === 'Add form' &&
          element.classList.contains(
            'assessmentsNoAssessment__addAssessmentBtnLabel'
          )
      ).parentElement;

      expect(addBtnParent).toHaveClass(
        'assessmentsNoAssessment__addAssessmentBtn--disabled'
      );
    });
  });

  describe('When the assessments-grid-view feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['assessments-grid-view'] = true;
    });
    afterEach(() => {
      window.featureFlags['assessments-grid-view'] = false;
    });

    describe('When there are no assessments', () => {
      it('renders the no assessments warning text', () => {
        render(
          <AssessmentsList {...baseProps} assessments={[]} isFullyLoaded />
        );
        expect(screen.getByText('No assessments')).toBeInTheDocument();
      });

      it('does not render the assessments header', () => {
        render(
          <AssessmentsList {...baseProps} assessments={[]} isFullyLoaded />
        );
        expect(
          screen.queryByRole('button', { name: 'Edit templates' })
        ).not.toBeInTheDocument();
      });
    });
  });
});
