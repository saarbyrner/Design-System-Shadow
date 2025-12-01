// @flow
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import type { StaffUserType } from '@kitman/services/src/services/medical/getStaffUsers';
import type { Review } from '../shared/services/searchReviewList';
import type { StatusLabelsEnumLikeKeys } from '../shared/types';

type ReviewListRow = {
  description: string,
  due_date: ?string,
  id: number,
  menu: number,
  review_type: ?string,
  squad: ?string,
  staff: string,
  start_date: string,
  status: StatusLabelsEnumLikeKeys,
};
export const renderReviewListRows = ({
  reviewList,
  staffUsers,
}: {
  reviewList: Array<Review>,
  staffUsers: Array<StaffUserType>,
}): Array<ReviewListRow> => {
  return reviewList.map(
    ({
      athlete_review_type_name: athleteReviewTypeName,
      end_date: endDate,
      id: reviewId,
      review_description: reviewDescription,
      review_status: reviewStatus,
      squad_name: squadName,
      start_date: startDate,
      user_ids: userIds,
    }) => ({
      id: reviewId,
      start_date: formatStandard({
        date: moment(startDate),
        displayLongDate: true,
      }),
      due_date: formatStandard({
        date: moment(endDate),
        displayLongDate: true,
      }),
      review_type: athleteReviewTypeName,
      description: reviewDescription,
      staff: staffUsers
        .filter(({ id }) => userIds.includes(id))
        .map(({ fullname }) => fullname)
        .join(', '),
      squad: squadName,
      status: reviewStatus,
      menu: reviewId,
    })
  );
};
