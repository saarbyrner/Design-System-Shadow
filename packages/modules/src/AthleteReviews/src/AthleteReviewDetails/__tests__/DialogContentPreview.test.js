import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import DialogContentPreview from '../DialogContentPreview';
import { ReviewContentTranslated as ReviewContent } from '../ReviewContent';

jest.mock('../ReviewContent', () => ({
  ReviewContentTranslated: jest.fn(() => null),
}));

describe('DialogContentPreview', () => {
  const props = {
    headerEnabled: true,
    selfAssessmentEnabled: false,
    coachingCommentsEnabled: true,
    goalStatusEnabled: false,
    reviewData: { someKey: 'someValue' },
    assessmentData: [{ id: 1, name: 'Assessment Group 1' }],
  };

  it('renders ReviewContent and passes the correct props', () => {
    renderWithProviders(<DialogContentPreview {...props} />);

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
