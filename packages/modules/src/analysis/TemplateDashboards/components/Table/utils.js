/* eslint-disable max-nested-callbacks */
// @flow
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

import moment from 'moment';
import { capitalize } from 'lodash';

const getGAndMPremierLeagueColumns = () => {
  // TODO: this will be turned into a preference in the near future
  if (window.getFlag('growth-and-maturation-pl-configuration')) {
    return [
      {
        label: i18n.t('Est. adult height'),
        subheading: i18n.t('Lower 50% Conf.'),
        id: 'g_and_m_est_adult_height_l_50',
      },
      {
        label: i18n.t('Est. adult height'),
        subheading: i18n.t('Higher 50% Conf.'),
        id: 'g_and_m_est_adult_height_u_50',
      },
    ];
  }
  return [];
};

const getMirwaldColumns = () => {
  if (window.getFlag('mirwald-calculation')) {
    return [
      {
        label: i18n.t('Status'),
        subheading: i18n.t('Mirwald'),
        id: 'g_and_m_maturity_offset_status',
      },
      { label: i18n.t('Maturity offset'), id: 'g_and_m_maturity_offset' },
      { label: i18n.t('Predicted date of PHV'), id: 'g_and_m_phv_date' },
      { label: i18n.t('Predicted age at PHV'), id: 'g_and_m_phv_age' },
    ];
  }
  return [];
};

export const getGrowthAndMaturationColumns = () => [
  { label: i18n.t('Athlete'), id: 'athlete_id' },
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Position'),
          id: 'position',
        },
      ]
    : []),
  {
    label: i18n.t('Most recent measurement'),
    id: 'most_recent_measurement',
  },
  {
    label: i18n.t('Chrono age'),
    subheading: i18n.t('at measurement'),
    id: 'g_and_m_decimal_age',
  },
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Bio age'),
          subheading: i18n.t('at measurement'),
          id: 'bio_age',
        },
      ]
    : []),
  {
    label: i18n.t('Height'),
    subheading: i18n.t('(cm)'),
    id: 'g_and_m_height',
  },
  {
    label: i18n.t('Weight'),
    subheading: i18n.t('(kg)'),
    id: 'g_and_m_weight',
  },
  ...getMirwaldColumns(),
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('RAE'),
          subheading: i18n.t('DOB quarter'),
          id: 'season_dob_quartile',
        },
      ]
    : []),
  {
    label: i18n.t('% adult height att.'),
    id: 'g_and_m_percent_adult_height_att',
  },
  { label: i18n.t('% adult height Z'), id: 'g_and_m_percent_adult_height_z' },
  {
    label: i18n.t('Maturity status'),
    id: 'g_and_m_khamis_roche_status',
  },
  ...getGAndMPremierLeagueColumns(),
  {
    label: i18n.t('Est. adult height'),
    subheading: i18n.t('(cm)'),
    id: 'g_and_m_est_adult_height',
  },
  {
    label: i18n.t('Est. adult height'),
    subheading: i18n.t('Lower 90% Conf.'),
    id: 'g_and_m_est_adult_height_l_90',
  },
  {
    label: i18n.t('Est. adult height'),
    subheading: i18n.t('Higher 90% Conf.'),
    id: 'g_and_m_est_adult_height_u_90',
  },
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Height velocity'),
          subheading: i18n.t('cm/year'),
          id: 'g_and_m_height_velocity',
        },
      ]
    : []),
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Weight velocity'),
          subheading: i18n.t('kg/year'),
          id: 'g_and_m_weight_velocity',
        },
      ]
    : []),
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Seated height'),
          subheading: i18n.t('cm'),
          id: 'g_and_m_av_seated_height',
        },
      ]
    : []),
  ...(window.getFlag('g-and-m-new-columns')
    ? [
        {
          label: i18n.t('Seated height / height ratio'),
          subheading: i18n.t('%'),
          id: 'g_and_m_seated_height_ratio',
        },
      ]
    : []),
];

export const SortingOrders = {
  asc: 'ASC',
  desc: 'DESC',
};

export const formatToDate = (date: string) =>
  DateFormatter.formatShort(moment(date, DateFormatter.dateTransferFormat));

export const getAthleteById = (
  squadAthletes: Object,
  athleteId: number | string
) => {
  let foundAthlete;
  squadAthletes.squads.forEach((squad) => {
    squad?.position_groups.forEach((positionGroup) => {
      positionGroup?.positions.forEach((position) => {
        const athleteFromSquad = position?.athletes.find(
          (athlete) => athlete.id === athleteId
        );
        if (athleteFromSquad) {
          foundAthlete = athleteFromSquad;
        }
      });
    });
  });

  return foundAthlete;
};

export const formatGrowthAndMaturationData = (
  row: Object,
  columnId: string
) => {
  if (!row[columnId] && columnId !== 'g_and_m_percent_adult_height_att') {
    return '-';
  }

  switch (columnId) {
    case 'most_recent_measurement':
    case 'g_and_m_phv_date':
      return formatToDate(row[columnId]);
    case 'g_and_m_decimal_age':
      return row[columnId].toFixed(1);
    case 'g_and_m_maturity_offset':
      return row[columnId] > 0
        ? `+${row[columnId].toFixed(3)}`
        : row[columnId].toFixed(3);
    case 'date_of_birth_quarter':
      return `Q${row[columnId]}`;
    case 'g_and_m_maturity_offset_status':
    case 'g_and_m_khamis_roche_status':
      return capitalize(row[columnId]);
    case 'g_and_m_phv_age':
      return row[columnId].toFixed(1);
    case 'g_and_m_percent_adult_height_att':
      return row[columnId] !== null && row[columnId] !== undefined
        ? row[columnId].toFixed(1)
        : 'N/A';
    case 'g_and_m_est_adult_height_l_50':
    case 'g_and_m_est_adult_height_u_50':
    case 'g_and_m_est_adult_height_l_90':
    case 'g_and_m_est_adult_height_u_90':
    case 'g_and_m_est_adult_height':
    case 'g_and_m_height_velocity':
    case 'g_and_m_weight_velocity':
    case 'g_and_m_seated_height_ratio':
      return row[columnId].toFixed(2);
    case 'g_and_m_percent_adult_height_z':
      return row[columnId] > 0
        ? `+${row[columnId].toFixed(2)}`
        : row[columnId].toFixed(2);
    case 'season_dob_quartile':
      return `Q${row[columnId]}`;
    default:
      return row[columnId];
  }
};

export const sortData = (
  rows: Array<Object>,
  allSquadAthletes: Object,
  sortingOrder: string,
  sortProp?: string
) => {
  const dataToSort = [...rows];

  if (!sortProp) return rows;

  switch (sortingOrder) {
    case SortingOrders.asc:
      dataToSort.sort((a, b) => {
        if (sortProp === 'athlete_id') {
          const athleteA = getAthleteById(allSquadAthletes, a[sortProp]);
          const athleteB = getAthleteById(allSquadAthletes, b[sortProp]);
          if (athleteA && athleteB && athleteA.fullname > athleteB.fullname) {
            return 1;
          }
          if (athleteA && athleteB && athleteA.fullname < athleteB.fullname)
            return -1;
          return 0;
        }
        if (a[sortProp] === null) {
          return 1;
        }
        if (b[sortProp] === null) {
          return -1;
        }
        if (a[sortProp] > b[sortProp]) return 1;
        if (a[sortProp] < b[sortProp]) return -1;
        return 0;
      });
      break;
    case SortingOrders.desc:
      dataToSort.sort((a, b) => {
        if (sortProp === 'athlete_id') {
          const athleteA = getAthleteById(allSquadAthletes, a[sortProp]);
          const athleteB = getAthleteById(allSquadAthletes, b[sortProp]);
          if (athleteA && athleteB && athleteA.fullname < athleteB.fullname)
            return 1;
          if (athleteA && athleteB && athleteA.fullname > athleteB.fullname)
            return -1;
          return 0;
        }
        if (a[sortProp] === null) {
          return 1;
        }
        if (b[sortProp] === null) {
          return -1;
        }
        if (a[sortProp] < b[sortProp]) return 1;
        if (a[sortProp] > b[sortProp]) return -1;
        return 0;
      });
      break;
    default:
      return rows;
  }

  return dataToSort;
};

export const formatCSVData = (
  squadAthletes: Object,
  tableData: Array<Object>
) => {
  const formattedData = tableData.reduce((accumulator, currentVal) => {
    const formattedRow = {};

    const columnsArr = getGrowthAndMaturationColumns();

    columnsArr.forEach((column) => {
      const prop = column.subheading
        ? `${column.label}\n${column.subheading}`
        : column.label;

      const value =
        column.id === 'athlete_id'
          ? getAthleteById(squadAthletes, currentVal[column.id])?.fullname
          : formatGrowthAndMaturationData(currentVal, column.id);

      formattedRow[prop] = value;
    });

    return [...accumulator, formattedRow];
  }, []);

  return formattedData;
};

// Conditional formatting
const PRE_PHV = 90;
const POST_PHV = 93;

const emptyCellColours = { bg: colors.white, txt: colors.grey_300 };

export const handlePHVCellColourCoding = (value: string) => {
  if (parseFloat(value) >= PRE_PHV && parseFloat(value) <= POST_PHV)
    return { bg: colors.red_200, txt: colors.white };
  return emptyCellColours;
};

export const handleHeightAndWeightVelocityColourCoding = (value: string) => {
  if (parseFloat(value) > 8) return { bg: colors.red_200, txt: colors.white };
  return emptyCellColours;
};
