// @flow
import moment from 'moment-timezone';
import { filterRehabSessions, getRehabNotes } from '@kitman/services';
import { dateTransferFormat } from '@kitman/common/src/utils/dateFormatter';
import type { IssueType } from '../../types';
import type { RehabSession, RehabDayMode } from './types';

const fetchRehabSessions = (
  issueOccurrenceId: ?number,
  issueType: ?IssueType,
  rehabDayMode: RehabDayMode,
  selectedDate: moment,
  athleteId: number,
  maintenance: boolean,
  includeNotes: boolean
): Promise<Array<RehabSession>> => {
  let startDate;
  let endDate;

  const startSelectedDay = moment(selectedDate).startOf('day');
  const endSelectedDay = moment(selectedDate).endOf('day');

  // Prepare array of the expected dates
  const placeholderSessionDates: Array<moment> = [];
  // Use mode and selectedDate here to create a date range
  switch (rehabDayMode) {
    case '1_DAY': {
      startDate = startSelectedDay;
      placeholderSessionDates.push(startDate);
      endDate = endSelectedDay;

      break;
    }
    case '5_DAY':
    case '7_DAY': {
      startDate = startSelectedDay;
      endDate = moment(startSelectedDay)
        .add(rehabDayMode === '5_DAY' ? 4 : 6, 'days')
        .endOf('day');
      placeholderSessionDates.push(startDate);
      for (let i = 1; i < (rehabDayMode === '5_DAY' ? 5 : 7); i++) {
        placeholderSessionDates.push(
          moment(startSelectedDay).add(i, 'days').startOf('day')
        );
      }

      break;
    }
    default: {
      // 3 DAY
      startDate = startSelectedDay;
      endDate = moment(startSelectedDay).add(2, 'days').endOf('day');
      placeholderSessionDates.push(startDate);
      for (let i = 1; i < 3; i++) {
        placeholderSessionDates.push(
          moment(startSelectedDay).add(i, 'days').startOf('day')
        );
      }

      break;
    }
  }

  let issues;

  if (!maintenance && issueOccurrenceId != null && issueType) {
    issues = [{ issueOccurrenceId, issueType }];
  }

  return Promise.all([
    filterRehabSessions(
      startDate.format(dateTransferFormat),
      endDate.format(dateTransferFormat),
      athleteId,
      issues,
      maintenance
    ),
    includeNotes
      ? getRehabNotes(
          athleteId,
          startDate.format(dateTransferFormat),
          endDate.format(dateTransferFormat),
          maintenance,
          issues || []
        )
      : Promise.resolve([]),
  ]).then(([fetchedRehabData, fetchedAnnotations]) => {
    const requestedSessions = [];
    placeholderSessionDates.forEach((date, index) => {
      const sessionForDate = fetchedRehabData.find((session) => {
        const sessionStart = moment(session.start_time);

        return sessionStart.isSame(date, 'day');
      });

      const annotationsForDate = fetchedAnnotations.filter((annotation) =>
        moment(annotation.annotation_date).isSame(date, 'day')
      );

      if (sessionForDate) {
        sessionForDate.annotations = annotationsForDate;
        requestedSessions.push(sessionForDate);
      } else {
        const placeholderSession: RehabSession = {
          id: -(index + 1),
          start_time: date.format(dateTransferFormat),
          end_time: date.endOf('day').format(dateTransferFormat),
          title: '',
          sections: [
            {
              id: -(index + 1),
              theme_color: null,
              order_index: 1,
              exercise_instances: [],
              isPlaceholderSection: true,
            },
          ],
          annotations: annotationsForDate,
          isPlaceholderSession: true,
          constraints: {
            read_only: false,
          },
        };
        requestedSessions.push(placeholderSession);
      }
    });
    return requestedSessions;
  });
};

export default fetchRehabSessions;
