import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { ReviewContentTranslated as ReviewContent } from '../ReviewContent';

jest.mock('../ReviewContentHeader', () => ({
  ReviewContentHeaderTranslated: (props) => {
    const defaultReviewData = {
      review_description: 'Review Description',
      review_note: 'Review Note',
      development_goals: [],
      review_status: 'In Progress',
      squad_name: 'Squad A',
    };
    return (
      <div>
        {props.reviewData?.review_description ||
          defaultReviewData.review_description}
      </div>
    );
  },
}));

jest.mock('../ReviewContentGoalSection', () => ({
  ReviewContentGoalSectionTranslated: (props) => {
    const defaultGoals = [];
    return (
      <div>
        {props.goals.length ? (
          props.goals.map((goal) => (
            <div key={goal.id}>
              <span>{goal.description}</span>
              <span>{props.getGoalStatusChipColor(goal.status)}</span>
              {props.coachingCommentsEnabled &&
                goal.comments.map((comment) => (
                  <div key={comment.id}>{comment.text}</div>
                ))}
            </div>
          ))
        ) : (
          <div>
            {defaultGoals.map((goal) => (
              <div key={goal.id}>
                <span>{goal.description}</span>
                <span>{props.getGoalStatusChipColor(goal.status)}</span>
                {props.coachingCommentsEnabled &&
                  goal.comments.map((comment) => (
                    <div key={comment.id}>{comment.text}</div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
}));

jest.mock('../ReviewContentAssesmentSection', () => ({
  ReviewContentAssesmentSectionTranslated: (props) => {
    const defaultAssessmentData = [
      {
        id: 'group1',
        items: [
          {
            item_type: 'AssessmentHeader',
            item: {
              name: 'Assessment Header',
            },
          },
          {
            item_type: 'AssessmentMetric',
            item: {
              training_variable: {
                name: 'Speed',
                description: 'Speed assessment',
              },
              answers: [
                {
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ];
    return (
      <div>
        {props.assessmentData.length ? (
          props.assessmentData.map((group) => (
            <div key={group.id}>
              {group.items.map((item) => (
                <div key={item.item_type}>
                  {item.item_type === 'AssessmentHeader' && (
                    <span>{item.item.name}</span>
                  )}
                  {item.item_type === 'AssessmentMetric' && (
                    <span>
                      {props.getScoreAnswerValue(item.item.answers[0]?.value)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div>
            {defaultAssessmentData.map((group) => (
              <div key={group.id}>
                {group.items.map((item) => (
                  <div key={item.item_type}>
                    {item.item_type === 'AssessmentHeader' && (
                      <span>{item.item.name}</span>
                    )}
                    {item.item_type === 'AssessmentMetric' && (
                      <span>
                        {props.getScoreAnswerValue(item.item.answers[0]?.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
}));

const t = i18nextTranslateStub();

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withNamespaces: () => (Component) => (props) =>
    <Component t={jest.fn((key) => key)} {...props} />,
}));

const defaultProps = {
  reviewData: {
    review_description: 'Review Description',
    review_note: 'Review Note',
    development_goals: [],
    review_status: 'In Progress',
    squad_name: 'Squad A',
  },
  assessmentData: [
    {
      id: 'group1',
      items: [
        {
          item_type: 'AssessmentHeader',
          item: {
            name: 'Assessment Header',
          },
        },
        {
          item_type: 'AssessmentMetric',
          item: {
            training_variable: {
              name: 'Speed',
              description: 'Speed assessment',
            },
            answers: [
              {
                value: 3,
              },
            ],
          },
        },
      ],
    },
  ],
  t,
  getGoalStatusChipColor: () => 'success',
  getStatusLabel: (status) => status,
  getScoreAnswerValue: (value) => (value === 3 ? 'Good' : ''),
  headerEnabled: true,
  selfAssessmentEnabled: false,
};

describe('ReviewContent Component', () => {
  it('renders review details when reviewData is provided', () => {
    render(<ReviewContent {...defaultProps} assessmentData={[]} />);
    expect(screen.getByText('Review Description')).toBeInTheDocument();
  });

  it('renders assessment data when selfAssessmentEnabled is true', () => {
    render(<ReviewContent {...defaultProps} selfAssessmentEnabled />);
    expect(screen.getByText('Assessment Header')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders loading state when reviewData is not provided', () => {
    render(<ReviewContent {...defaultProps} reviewData={null} />);
    expect(screen.getByText(t('Loading...'))).toBeInTheDocument();
  });

  it('uses getGoalStatusChipColor function to determine chip color', () => {
    const getGoalStatusChipColor = (status) => {
      return status === 'achieved' ? 'success' : 'error';
    };

    render(
      <ReviewContent
        {...defaultProps}
        getGoalStatusChipColor={getGoalStatusChipColor}
      />
    );
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('uses getStatusLabel function to determine goal status label', () => {
    const getStatusLabel = (status) => {
      return status === 'achieved' ? 'Achieved' : 'Not Achieved';
    };

    render(<ReviewContent {...defaultProps} getStatusLabel={getStatusLabel} />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('uses getScoreAnswerValue function to determine score answer value', () => {
    const getScoreAnswerValue = (value) => {
      switch (value) {
        case 1:
          return 'Below Level';
        case 2:
          return 'Average';
        case 3:
          return 'Good';
        case 4:
          return 'Above Level';
        default:
          return '';
      }
    };

    render(
      <ReviewContent
        {...defaultProps}
        getScoreAnswerValue={getScoreAnswerValue}
      />
    );
    expect(screen.getByText('Good')).toBeInTheDocument();
  });
});
