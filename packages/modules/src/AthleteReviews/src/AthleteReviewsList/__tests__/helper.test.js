import reviewListData from '@kitman/modules/src/AthleteReviews/src/shared/services/mocks/data/athlete_reviews';
import { renderReviewListRows } from '../helper';

describe('helper', () => {
  const staffUsers = [
    {
      id: 1236,
      firstname: 'Stuart',
      lastname: "O'Brien",
      fullname: "Stuart O'Brien",
    },
  ];
  it('correctly renders review list rows', () => {
    const reviewListRows = renderReviewListRows({
      reviewList: [
        {
          ...reviewListData[0],
          athlete_review_type_name: 'A',
          squad_name: 'Chelsea FC',
        },
      ],
      staffUsers,
    });

    expect(reviewListRows).toEqual([
      {
        description: 'A review description',
        due_date: 'October 27, 2024',
        id: 1,
        menu: 1,
        review_type: 'A',
        squad: 'Chelsea FC',
        staff: "Stuart O'Brien",
        start_date: 'January 31, 2024',
        status: 'completed',
      },
    ]);
  });
});
