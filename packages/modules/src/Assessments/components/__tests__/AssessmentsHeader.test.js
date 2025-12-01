import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AssessmentsHeader from '../AssessmentsHeader';
import PermissionsContext, {
  defaultPermissions,
} from '../../contexts/PermissionsContext';

describe('AssessmentsHeader component', () => {
  const baseProps = {
    assessmentTemplates: [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' },
      { id: 3, name: 'Template 3' },
    ],
    filteredTemplates: [],
    onApplyTemplateFilter: jest.fn(),
    onClickAddAssessment: jest.fn(),
    t: i18nextTranslateStub(),
  };

  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    baseProps.onApplyTemplateFilter.mockClear();
    baseProps.onClickAddAssessment.mockClear();
  });

  it('displays the add button with the correct text', () => {
    renderWithRedux(<AssessmentsHeader {...baseProps} />);
    expect(screen.getByText('Add form')).toBeInTheDocument();
  });

  it('calls the correct prop when clicking the add assessment button', async () => {
    const user = userEvent.setup();
    renderWithRedux(<AssessmentsHeader {...baseProps} />);

    await user.click(screen.getByText('Add form'));
    expect(baseProps.onClickAddAssessment).toHaveBeenCalledTimes(1);
  });

  it('disables the edit template button and the filter template dropdown when there are no templates', () => {
    renderWithRedux(
      <AssessmentsHeader {...baseProps} assessmentTemplates={[]} />
    );

    expect(screen.getByRole('button', { name: 'Edit' })).toHaveClass(
      'assessmentsHeader__editTemplates--disabled'
    );

    expect(screen.getByTestId('DropdownWrapper')).toHaveClass(
      'dropdownWrapper--disabled'
    );
  });

  it('renders filtered template names as the dropdown title', () => {
    renderWithRedux(
      <AssessmentsHeader {...baseProps} filteredTemplates={[1, 2, null]} />
    );

    expect(
      screen.getByText('Template 1, Template 2, Unidentified')
    ).toBeInTheDocument();
  });

  describe('When the user does not have the create or create from template permission', () => {
    it('disables the create assessment button', () => {
      const permissions = {
        ...defaultPermissions,
        createAssessment: false,
        createAssessmentFromTemplate: false,
      };
      renderWithRedux(
        <PermissionsContext.Provider value={permissions}>
          <AssessmentsHeader {...baseProps} />
        </PermissionsContext.Provider>
      );

      const addFormButton = screen.getByText('Add form');
      expect(addFormButton.parentElement).toHaveClass(
        'assessmentsHeader__addAssessmentBtn--disabled'
      );
    });
  });

  describe('When the user does not have the manage template permission', () => {
    it('disables the edit template button', () => {
      const permissions = {
        ...defaultPermissions,
        createAssessment: false,
        createAssessmentFromTemplate: false,
      };
      renderWithRedux(
        <PermissionsContext.Provider value={permissions}>
          <AssessmentsHeader {...baseProps} />
        </PermissionsContext.Provider>
      );

      const addFormButton = screen.getByText('Add form');
      expect(addFormButton.parentElement).toHaveClass(
        'assessmentsHeader__addAssessmentBtn--disabled'
      );
    });
  });

  describe('when the assessments-grid-view feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags = { 'assessments-grid-view': true };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('does not render the template filter actions', () => {
      renderWithRedux(<AssessmentsHeader {...baseProps} />);
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('display the add button with the correct text', () => {
      renderWithRedux(<AssessmentsHeader {...baseProps} />);
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('renders filter templates title when there are no selected templates', () => {
      renderWithRedux(
        <AssessmentsHeader {...baseProps} filteredTemplates={[]} />
      );

      expect(screen.getByText('Filter templates')).toBeInTheDocument();
    });

    describe('When the user does not have the createAssessment permission', () => {
      it('disables the add button', () => {
        const permissions = {
          ...defaultPermissions,
          createAssessment: false,
        };
        renderWithRedux(
          <PermissionsContext.Provider value={permissions}>
            <AssessmentsHeader {...baseProps} />
          </PermissionsContext.Provider>
        );

        expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
      });
    });
  });
});
