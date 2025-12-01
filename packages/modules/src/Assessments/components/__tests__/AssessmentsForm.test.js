import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  buildEvent,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import AssessmentForm from '../AssessmentForm';

const defaultPermissions = {
  createAssessment: true,
  createAssessmentFromTemplate: true,
};

describe('AssessmentForm component', () => {
  const baseProps = {
    onClickSubmit: jest.fn(),
    onClickClose: jest.fn(),
    orgTimezone: 'UTC',
    permissions: defaultPermissions,
    assessmentTemplates: [{ id: 1, name: 'Template name' }],
    participationLevels: [{ id: 1, name: 'No participation' }],
    turnaroundList: [],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {
      'assessments-multiple-athletes': false,
      'game-ts-assessment-area': false,
    };
  });

  it('renders the form inside a modal dialog', () => {
    renderWithRedux(<AssessmentForm {...baseProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('hides the session selector dropdown if an event prop has been provided', () => {
    renderWithRedux(<AssessmentForm {...baseProps} event={buildEvent()} />);
    expect(
      screen.queryByText('Date, Game or Training Session')
    ).not.toBeInTheDocument();
  });

  it('populates fields with existing data when editing an assessment', () => {
    const assessmentData = {
      id: 1,
      assessment_template: { id: 1, name: 'Template name' },
      name: 'Existing Assessment',
      assessment_date: '2025-09-01T12:00:00+00:00',
    };

    renderWithRedux(
      <AssessmentForm
        {...baseProps}
        assessment={assessmentData}
        event={undefined}
      />
    );

    expect(screen.getByLabelText(/^name$/i)).toHaveValue('Existing Assessment');

    expect(screen.getAllByText('Template name')[0]).toBeInTheDocument();
  });

  it('disables the save button if required fields are missing', () => {
    renderWithRedux(
      <AssessmentForm
        {...baseProps}
        event={buildEvent()}
        permissions={{
          createAssessment: false,
          createAssessmentFromTemplate: true,
        }}
      />
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });
});
