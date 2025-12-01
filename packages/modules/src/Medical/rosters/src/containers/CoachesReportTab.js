// @flow
import { useEffect } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveSquad } from '@kitman/services';
import { setCoachesReportComment } from '@kitman/services/src/services/medical';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import {
  getPersistedCommentsFilters,
  setPersistedCommentsFilters,
} from '@kitman/modules/src/Medical/shared/utils/CommentsFilters';
import { CoachesReportTabTranslated as CoachesReportTab } from '../components/CoachesReportTab';
import {
  fetchCoachesReportGrid,
  setCommentsGridRequestStatus,
  updateCoachesReportFilters,
  updateComment,
  requestCommentsGridSuccess,
  requestCommentsGridFailure,
} from '../redux/actions';

type Props = {
  permissions: {},
};

export default (props: Props) => {
  const dispatch = useDispatch();
  const grid = useSelector((state) => state.commentsGrid);

  const requestStatus = useSelector(
    (state) => state.app?.commentsGridRequestStatus
  );

  const filters = useSelector(
    (state) => state.commentsFilters && state.commentsFilters
  );

  const setFilters = (updatedFilters) => {
    dispatch(updateCoachesReportFilters(updatedFilters));

    if (Array.isArray(updatedFilters.squads)) {
      setPersistedCommentsFilters(
        ['squads', 'positions', 'availabilities', 'issues'],
        updatedFilters,
        'roster'
      );
    }
  };

  useEffect(() => {
    const persistedFilters = getPersistedCommentsFilters(
      filters,
      ['squads', 'positions', 'availabilities', 'issues'],
      'roster'
    );

    if (persistedFilters?.squads?.length) {
      setFilters({
        ...persistedFilters,
      });
    } else {
      getActiveSquad()
        .then(({ id }) => {
          setFilters({
            squads: id ? [id] : [],
            athlete_name: '',
            availabilities: [],
            issues: [],
            positions: [],
          });
        })
        .catch(() => {
          setFilters({
            squads: [],
            athlete_name: '',
            availabilities: [],
            issues: [],
            positions: [],
          });
        });
    }
  }, []);

  const addEditComment = (rowData, inputValue) => {
    setCoachesReportComment({
      athlete_id: rowData.id,
      comment: inputValue || '',
      comment_date: DateFormatter.formatStandard({
        date: moment(),
      }),
    }).then(
      () => {
        // Update redux state
        dispatch(updateComment(inputValue, rowData.id));
        dispatch(requestCommentsGridSuccess());
      },
      () => {
        dispatch(requestCommentsGridFailure());
      }
    );
    return rowData;
  };

  return (
    <div data-testid="CoachesReportTab|Container">
      <CoachesReportTab
        permissions={props.permissions}
        fetchGrid={(reset, nextId, currentDate) =>
          dispatch(fetchCoachesReportGrid(reset, nextId, currentDate))
        }
        addEditComment={addEditComment}
        grid={grid}
        filters={filters}
        requestStatus={requestStatus}
        onFiltersUpdate={setFilters}
        onSetRequestStatus={(status) =>
          dispatch(setCommentsGridRequestStatus(status))
        }
        t={i18n.t}
      />
    </div>
  );
};
