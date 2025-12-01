import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import AssessmentWidget from '../AssessmentWidget';
import PermissionsContext, {
  defaultPermissions,
} from '../../contexts/PermissionsContext';

const renderWithPermissions = (
  ui,
  { providerProps, ...renderOptions } = {}
) => {
  return render(
    <PermissionsContext.Provider {...providerProps}>
      {ui}
    </PermissionsContext.Provider>,
    renderOptions
  );
};

describe('AssessmentWidget component', () => {
  const baseProps = {
    viewType: 'LIST',
    selectedAthlete: 1,
    assessment: {
      id: 1,
      athletes: [{ id: 212, fullname: 'John Doe' }],
      assessment_template: { id: 1, name: 'Template name' },
      assessment_date: '2020-06-05',
      name: 'Assessment 1',
      items: [
        {
          id: 1,
          item_type: 'AssessmentMetric',
          item: { training_variable: { id: 1 }, answers: [] },
        },
        {
          id: 2,
          item_type: 'AssessmentMetric',
          item: { training_variable: { id: 2 }, answers: [] },
        },
      ],
    },
    assessmentTemplates: [{ id: 1, name: 'Template name' }],
    organisationTrainingVariables: [
      { id: 12, training_variable: { id: 3, name: 'Sleep duration' } },
    ],
    saveAssessmentItem: jest.fn(),
    onClickDeleteAssessment: jest.fn(),
    onClickSaveTemplate: jest.fn(),
    onClickUpdateTemplate: jest.fn(),
    fetchItemAnswers: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {
      'standard-date-formatting': false,
      'assessments-multiple-athletes': false,
      'game-ts-assessment-area': false,
    };
  });

  const openMenu = async (container) => {
    const menuButton = container.querySelector(
      '.assessmentWidget__dropdownMenuBtn'
    );
    await userEvent.click(menuButton);
  };

  describe('when the standard-date-formatting flag is off', () => {
    it('renders the assessment details with the old date format', () => {
      render(<AssessmentWidget {...baseProps} />);
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
      expect(
        screen.getByText('5 Jun 2020 | Template name')
      ).toBeInTheDocument();
    });
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });
    it('renders the assessment details with the new date format', () => {
      render(<AssessmentWidget {...baseProps} />);
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
      expect(
        screen.getByText('Jun 5, 2020 | Template name')
      ).toBeInTheDocument();
    });
  });

  describe('when assessments-multiple-athletes flag is on', () => {
    beforeEach(() => {
      window.featureFlags['assessments-multiple-athletes'] = true;
    });
    it('renders the assessment details using assessment_group_date', () => {
      const propsWithGroupDate = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          assessment_group_date: '2020-06-05',
        },
      };
      render(<AssessmentWidget {...propsWithGroupDate} />);
      expect(screen.getByText('Assessment 1')).toBeInTheDocument();
      expect(
        screen.getByText('5 Jun 2020 | Template name')
      ).toBeInTheDocument();
    });
  });

  describe('when clicking the delete assessment option', () => {
    it('shows a confirmation and calls the delete handler on confirm', async () => {
      const { container } = render(<AssessmentWidget {...baseProps} />);
      await openMenu(container);

      await userEvent.click(await screen.findByText('Delete assessment'));

      expect(await screen.findByText('Delete form?')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));

      expect(baseProps.onClickDeleteAssessment).toHaveBeenCalledWith(1);
    });
  });

  describe('Permissions', () => {
    it('disables the delete button if user lacks deleteAssessment permission', async () => {
      const providerProps = {
        value: { ...defaultPermissions, deleteAssessment: false },
      };
      const { container } = renderWithPermissions(
        <AssessmentWidget {...baseProps} />,
        { providerProps }
      );
      await openMenu(container);
      expect(
        (await screen.findByText('Delete assessment')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
    });

    it('disables template buttons if user lacks manageAssessmentTemplate permission', async () => {
      const providerProps = {
        value: { ...defaultPermissions, manageAssessmentTemplate: false },
      };
      const { container } = renderWithPermissions(
        <AssessmentWidget {...baseProps} />,
        { providerProps }
      );
      await openMenu(container);
      expect(
        (await screen.findByText('Update template')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
      expect(
        (await screen.findByText('Create template')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
    });

    it('disables edit and reorder buttons if user lacks editAssessment permission', async () => {
      const providerProps = {
        value: { ...defaultPermissions, editAssessment: false },
      };
      const { container } = renderWithPermissions(
        <AssessmentWidget {...baseProps} />,
        { providerProps }
      );
      await openMenu(container);
      expect(
        (await screen.findByText('Reorder')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
      expect(
        (await screen.findByText('Edit details')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
    });

    it('disables creation buttons if user lacks createAssessment permission', async () => {
      const providerProps = {
        value: { ...defaultPermissions, createAssessment: false },
      };
      const { container } = renderWithPermissions(
        <AssessmentWidget {...baseProps} />,
        { providerProps }
      );
      await openMenu(container);
      expect(
        (await screen.findByText('Add section')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
      expect(
        (await screen.findByText('Add metric')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
      expect(
        (await screen.findByText('Add status')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
    });
  });

  describe('when viewType is LIST', () => {
    it('expands to show an individual assessment on click', async () => {
      const { container } = render(
        <AssessmentWidget {...baseProps} viewType="LIST" />
      );

      expect(container.querySelector('.individualAssessment')).toBeNull();

      await userEvent.click(screen.getByText('Assessment 1'));

      expect(
        container.querySelector('.individualAssessment')
      ).toBeInTheDocument();
    });

    it('disables the reorder button when there are less than 2 items', async () => {
      const propsWithOneItem = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          items: [{ id: 1, item: { answers: [] } }],
        },
      };
      const { container } = render(
        <AssessmentWidget {...propsWithOneItem} viewType="LIST" />
      );
      await openMenu(container);
      expect(
        (await screen.findByText('Reorder')).closest('button')
      ).toHaveClass('tooltipMenu__item--disabled');
    });
  });

  describe('when viewType is GRID', () => {
    it('does not expand by default when it is the first assessment', () => {
      render(
        <AssessmentWidget {...baseProps} viewType="GRID" isFirstAssessment />
      );
      expect(
        screen.queryByTestId('grouped-assessment')
      ).not.toBeInTheDocument();
    });

    it('expands to show a grouped assessment on click', async () => {
      const { container } = render(
        <AssessmentWidget {...baseProps} viewType="GRID" />
      );

      expect(container.querySelector('.groupedAssessment')).toBeNull();

      await userEvent.click(screen.getByText('Assessment 1'));

      expect(container.querySelector('.groupedAssessment')).toBeInTheDocument();
    });

    it('calls fetchItemAnswers on expand if answers are missing', async () => {
      const propsWithoutAnswers = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          items: [
            {
              id: 1,
              item_type: 'AssessmentMetric',
              item: { training_variable: { id: 1 } },
            },
          ],
        },
      };

      const { container } = render(
        <AssessmentWidget {...propsWithoutAnswers} viewType="GRID" />
      );

      await userEvent.click(screen.getByText('Assessment 1'));

      await waitFor(() => {
        expect(
          container.querySelector('.groupedAssessment')
        ).toBeInTheDocument();
      });

      expect(baseProps.fetchItemAnswers).toHaveBeenCalled();
    });

    it('does not call fetchItemAnswers on expand if answers are present', async () => {
      const propsWithAnswers = {
        ...baseProps,
        assessment: {
          ...baseProps.assessment,
          items: [{ id: 1, item: { answers: [{ value: 1 }] } }],
        },
      };

      const { container } = render(
        <AssessmentWidget {...propsWithAnswers} viewType="GRID" />
      );

      await userEvent.click(screen.getByText('Assessment 1'));

      await waitFor(() => {
        expect(
          container.querySelector('.groupedAssessment')
        ).toBeInTheDocument();
      });

      expect(baseProps.fetchItemAnswers).not.toHaveBeenCalled();
    });
  });
});
