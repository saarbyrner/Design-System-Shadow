// @flow
import type { Node } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { getTryoutAthletes } from '@kitman/services/';
import debounce from 'lodash/debounce';
import i18n from '@kitman/common/src/utils/i18n';
import { TextLink, UserAvatar } from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';

import { headerStyle } from '../../CommonGridStyle';

import type {
  InitialData,
  RequestState,
  Filters,
  GridConfig,
  Row,
  Column,
  ReturnType,
  TryoutAthlete,
} from '../types';

const tryoutEmptyTableText = i18n.t('No tryout athletes for this period');
const nflEmptyTableText = i18n.t('No shared players for this period');

const gridId = 'AthleteTryoutsGrid';

const initialData: InitialData = {
  athletes: [],
  meta: {
    next_page: 1,
    current_page: 1,
    prev_page: 1,
    total_count: 1,
    total_pages: 1,
  },
};

const formatDate = (date: moment): string => {
  return DateFormatter.formatStandard({ date });
};

const useTryoutAthletes = (): ReturnType => {
  const [request, setRequest] = useState<RequestState>({
    status: 'DORMANT',
    data: initialData,
    error: null,
  });

  const isForNFL = window.organisationSport === 'nfl';
  const [filteredSearchParams, setFilteredSearchParams] = useState<Filters>({
    athlete_name: '',
  });

  const updateRequest = (partialRequest: $Shape<RequestState>) => {
    setRequest((state) => ({
      ...state,
      ...partialRequest,
    }));
  };
  const athleteJoinedData = isForNFL
    ? i18n.t('Shared date')
    : i18n.t('Joined date');
  const emptyTableText = isForNFL ? nflEmptyTableText : tryoutEmptyTableText;
  const columns: Array<Column> = useMemo(
    () => [
      {
        id: 'athlete',
        row_key: 'athlete',
        content: (
          <div css={headerStyle.headerCell}>
            <span>{i18n.t('Athlete')}</span>
          </div>
        ),
        isHeader: true,
      },
      {
        id: 'parent_organisation',
        row_key: 'parent_organisation',
        content: (
          <div css={headerStyle.headerCell}>
            <span>{i18n.t('Parent club')}</span>
          </div>
        ),
        isHeader: true,
      },
      {
        id: 'athlete_joined_date',
        row_key: 'athlete_joined_date',
        content: (
          <div css={headerStyle.headerCell}>
            <span>{athleteJoinedData}</span>
          </div>
        ),
        isHeader: true,
      },
      {
        id: 'trial_expires_date',
        row_key: 'trial_expires_date',
        content: (
          <div css={headerStyle.headerCell}>
            <span>{i18n.t('Expires')}</span>
          </div>
        ),
        isHeader: true,
      },
    ],
    []
  );

  const renderAthleteCell = (athlete: TryoutAthlete) => {
    return (
      <div css={headerStyle.athleteCell}>
        <div css={headerStyle.imageContainer}>
          <UserAvatar
            url={athlete.avatar_url}
            firstname={athlete.fullname}
            displayInitialsAsFallback
            size="MEDIUM"
          />
        </div>
        <div css={headerStyle.detailsContainer}>
          <TextLink
            text={athlete.fullname}
            href={`/medical/athletes/${athlete.id}`}
            kitmanDesignSystem
          />
        </div>
      </div>
    );
  };

  const renderOrgCell = (athlete: TryoutAthlete) => {
    return (
      <div css={headerStyle.organisationWrapper}>
        {athlete.organisations.map((org, index) => {
          return (
            <div
              css={headerStyle.organisationCell}
              key={`${athlete.id}_${athlete.organisations[index].id}`}
            >
              <div css={headerStyle.imageContainer}>
                <UserAvatar
                  url={org.logo_full_path}
                  firstname={org.name}
                  displayInitialsAsFallback
                  size="EXTRA_SMALL"
                />
              </div>
              <div css={headerStyle.detailsContainer}>{org.name}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDateCell = (athlete: TryoutAthlete, isDepartedDate: boolean) => {
    if (isDepartedDate) {
      return (
        <div css={headerStyle.departedDateCell}>
          {athlete.trial_record.left_at === '-1'
            ? i18n.t('Indefinite')
            : formatDate(moment(athlete.trial_record.left_at))}
        </div>
      );
    }
    return (
      <div css={headerStyle.departedDateCell}>
        {formatDate(moment(athlete.trial_record.joined_at))}
      </div>
    );
  };

  const buildCellContent = (
    { row_key: rowKey },
    athlete
  ): Node | Array<Node> => {
    switch (rowKey) {
      case 'athlete':
        return renderAthleteCell(athlete);
      case 'parent_organisation':
        return renderOrgCell(athlete);
      case 'athlete_joined_date':
        return renderDateCell(athlete, false);
      case 'trial_expires_date':
        return renderDateCell(athlete, true);
      default:
        return <span css={headerStyle.defaultCell}>{athlete[rowKey]}</span>;
    }
  };

  const buildRowData = (athletes): Array<Row> => {
    return athletes.map((athlete) => ({
      id: athlete.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent(column, athlete),
      })),
      classnames: {
        athlete__row: true,
      },
    }));
  };

  const onFetchTryoutAthletes = (filters: Filters) => {
    updateRequest({
      status: 'PENDING',
      data: initialData,
    });

    return getTryoutAthletes(filters).then(
      (data) => {
        updateRequest({
          status: 'SUCCESS',
          data,
        });
      },
      (error) => {
        updateRequest({
          status: 'ERROR',
          error,
        });
      }
    );
  };

  const rows = useMemo(
    () => buildRowData(request.data.athletes),
    [request.data.athletes]
  );

  const grid: GridConfig = {
    rows,
    columns,
    emptyTableText,
    id: gridId,
  };

  const handleFilteredSearch = (newFilters) => {
    onFetchTryoutAthletes({
      ...filteredSearchParams,
      ...newFilters,
    });
  };

  const handleDebounceSearch = useMemo(
    () => debounce(handleFilteredSearch, 400),
    []
  );

  const onUpdateFilter = (partialFilter: $Shape<Filters>) => {
    setFilteredSearchParams((state) => ({
      ...state,
      ...partialFilter,
    }));
  };

  useEffect(() => {
    handleDebounceSearch(filteredSearchParams);
  }, [filteredSearchParams]);

  return {
    requestStatus: request.status,
    onFetchTryoutAthletes,
    filteredSearchParams,
    onUpdateFilter,
    grid,
  };
};

export default useTryoutAthletes;
