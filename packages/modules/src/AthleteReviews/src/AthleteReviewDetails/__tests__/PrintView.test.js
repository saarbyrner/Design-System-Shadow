import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import PrintView from '../PrintView';
import { ReviewContentTranslated as ReviewContent } from '../ReviewContent';

jest.mock('../ReviewContent', () => ({
  ReviewContentTranslated: jest.fn(() => null),
}));

describe('PrintView', () => {
  const props = {
    headerEnabled: true,
    selfAssessmentEnabled: false,
    coachingCommentsEnabled: true,
    goalStatusEnabled: false,
    reviewData: { someKey: 'someValue' },
    assessmentData: [{ id: 1, name: 'Assessment Group 1' }],
  };

  it('renders the Printable component and passes props to ReviewContent', () => {
    renderWithProviders(<PrintView {...props} />);

    expect(ReviewContent).toHaveBeenCalledWith(
      expect.objectContaining({
        headerEnabled: true,
        selfAssessmentEnabled: false,
        coachingCommentsEnabled: true,
        goalStatusEnabled: false,
        reviewData: props.reviewData,
        assessmentData: props.assessmentData,
      }),
      {}
    );
  });
});
