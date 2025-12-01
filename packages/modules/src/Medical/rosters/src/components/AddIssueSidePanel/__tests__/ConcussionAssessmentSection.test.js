import { screen, waitFor } from '@testing-library/react';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';

import getAthleteAssessments from '../../../services/getAthleteAssessments';
import ConcussionAssessmentSection from '../ConcussionAssessmentSection';

jest.mock('../../../services/getAthleteAssessments');

const mockedConcussionAssessments = [
  {
    date: '2022-06-06T15:00:00Z',
    form: {
      category: 'concussion',
      created_at: '2022-05-10T15:47:00Z',
      enabled: true,
      group: 'scat5',
      id: 3,
      key: 'return_to_play',
      name: 'Return to play',
      updated_at: '2022-05-10T15:47:00Z',
    },
    id: 5,
  },
  {
    date: '2022-06-07T15:00:00Z',
    form: {
      category: 'concussion',
      created_at: '2022-05-10T15:47:00Z',
      enabled: true,
      group: 'scat5',
      id: 4,
      key: 'daily_symptom_checklist',
      name: 'Daily symptom checklist',
      updated_at: '2022-05-10T15:47:00Z',
    },
    id: 4,
  },
];

describe('ConcussionAssessmentSection', () => {
  let props;

  beforeAll(() => {
    setI18n(i18n);
  });

  beforeEach(() => {
    props = {
      athleteId: 1,
      showAssessmentReportSelector: false,
      attachedConcussionAssessments: [],
      setShowAssessmentReportSelector: jest.fn(),
      onUpdateAttachedConcussionAssessments: jest.fn(),
      invalidFields: [],
      t: (key) => key,
    };
    getAthleteAssessments.mockResolvedValue(mockedConcussionAssessments);
  });

  it('renders', () => {
    renderWithUserEventSetup(<ConcussionAssessmentSection {...props} />);
    expect(
      screen.getByText('Was a concussion assessment performed at the scene?')
    ).toBeInTheDocument();
  });

  it('does not display the assessment selector by default', () => {
    renderWithUserEventSetup(<ConcussionAssessmentSection {...props} />);
    expect(screen.queryByLabelText('Attach report(s)')).not.toBeInTheDocument();
  });

  describe('when the user clicks "Yes"', () => {
    it('calls setShowAssessmentReportSelector', async () => {
      const { user } = renderWithUserEventSetup(
        <ConcussionAssessmentSection {...props} />
      );
      const yesButton = screen.getByRole('button', { name: 'Yes' });
      await user.click(yesButton);
      expect(props.setShowAssessmentReportSelector).toHaveBeenCalledWith(true);
    });
  });

  describe('when showAssessmentReportSelector is true', () => {
    beforeEach(() => {
      props.showAssessmentReportSelector = true;
    });

    it('displays a loading indicator while fetching assessments', () => {
      renderWithUserEventSetup(<ConcussionAssessmentSection {...props} />);
      expect(screen.getByText('Loading ...')).toBeInTheDocument();
    });

    it('displays the assessment selector when the request is successful', async () => {
      renderWithUserEventSetup(<ConcussionAssessmentSection {...props} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Attach report(s)')).toBeInTheDocument();
      });
    });

    it('displays the assessment report names and date in the assessment selector dropdown', async () => {
      const { user } = renderWithUserEventSetup(
        <ConcussionAssessmentSection {...props} />
      );
      await waitFor(() => {
        expect(screen.getByLabelText('Attach report(s)')).toBeInTheDocument();
      });

      await user.click(screen.getByLabelText('Attach report(s)'));

      expect(
        screen.getByText('Return to play Jun 06, 2022')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Daily symptom checklist Jun 07, 2022')
      ).toBeInTheDocument();
    });

    it('calls the correct callback when updating selected assessments', async () => {
      const { user, rerender } = renderWithUserEventSetup(
        <ConcussionAssessmentSection {...props} />
      );
      const selectControl = await screen.findByLabelText('Attach report(s)');

      // Open menu and select first option
      await user.click(selectControl);
      const option1 = await screen.findByText('Return to play Jun 06, 2022');
      await user.click(option1);

      expect(props.onUpdateAttachedConcussionAssessments).toHaveBeenCalledWith([
        5,
      ]);

      // Re-render with updated props
      rerender(
        <ConcussionAssessmentSection
          {...props}
          attachedConcussionAssessments={[5]}
        />
      );

      // Re-open menu and select second option
      await user.click(selectControl);
      const option2 = await screen.findByText(
        'Daily symptom checklist Jun 07, 2022'
      );
      await user.click(option2);

      expect(
        props.onUpdateAttachedConcussionAssessments
      ).toHaveBeenLastCalledWith([5, 4]);
    });

    it('displays an error message if the request fails', async () => {
      getAthleteAssessments.mockRejectedValue(new Error('API Error'));
      renderWithUserEventSetup(<ConcussionAssessmentSection {...props} />);
      await waitFor(() => {
        expect(screen.getByText('error')).toBeInTheDocument();
      });
    });
  });
});
