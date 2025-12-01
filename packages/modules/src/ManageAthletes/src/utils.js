// @flow

import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { getAthletesPolicies } from '@kitman/services';
import type { Squad } from '@kitman/services/src/services/getActiveSquad';
import type { ViewType } from './types';

export const INITIAL_ATHLETES_PAGE = 1;
export const ATHLETES_PER_PAGE = 25;

export const VIEW_TYPE = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
};

export const exportInsuranceDetails = ({
  activeSquad,
  viewType,
  searchQuery,
}: {
  activeSquad: Squad,
  viewType: ViewType,
  searchQuery: string,
}): Promise<any> => {
  const isActive = viewType === VIEW_TYPE.Active;

  return new Promise<void>((resolve: (value: any) => void, reject) => {
    getAthletesPolicies(isActive, searchQuery)
      .then((response) => {
        const fileName = [
          activeSquad.name.replace(/ /g, '_'),
          i18n.t('Insurance Details').replace(/ /g, '_'),
          moment(new Date()).format('M_MMM_YYYY'),
        ].join('-');

        const getCoverage = (policy) => {
          const coverageMap = {
            covers_dental: i18n.t('Dental'),
            covers_medical: i18n.t('Medical'),
            covers_rx: i18n.t('Prescription'),
            covers_vision: i18n.t('Vision'),
          };
          return Object.keys(coverageMap)
            .reduce((acc, curr) => {
              const newVal = [...acc];
              if (policy[curr]) {
                newVal.push(coverageMap[curr]);
              }

              return newVal;
            }, [])
            .join(',');
        };

        const dataToExport = response.flatMap((athlete) => {
          if (athlete.policies.length) {
            return athlete.policies.map((policy) => {
              return {
                ...athlete,
                ...policy,
                hasPolicy: true,
              };
            });
          }

          return [{ ...athlete, hasPolicy: false }];
        });

        const nullIfNoPolicy = (callback) => (policy) =>
          policy.hasPolicy ? callback(policy) : null;

        const booleanToYesNo = (field) => (policy) =>
          policy[field] ? i18n.t('Yes') : i18n.t('No');

        const getOptionalFields = () => {
          return isActive
            ? [
                { label: i18n.t('Position'), value: 'position' },
                {
                  label: i18n.t('Squads'),
                  value: (userPolicy) => {
                    return userPolicy.athlete_squads
                      .map(({ name }) => name)
                      .join(', ');
                  },
                },
              ]
            : [];
        };

        downloadCSV(fileName, dataToExport, {
          fields: [
            { label: i18n.t('Athlete'), value: 'fullname' },
            { label: i18n.t('Username'), value: 'username' },
            ...getOptionalFields(),
            {
              label: i18n.t('Creation Date'),
              value: (policy) =>
                formatStandard({
                  date: moment(policy.created_at),
                  displayLongDate: true,
                }),
            },

            { label: i18n.t('Policy number'), value: 'policy_number' },
            { label: i18n.t('Group number'), value: 'group_number' },
            {
              label: i18n.t('Start date'),
              value: (policy) =>
                formatStandard({
                  date: moment(policy.effective_from, 'YYYY-MM-DD'),
                  displayLongDate: true,
                }),
            },
            {
              label: i18n.t('Expiry date'),
              value: (policy) =>
                formatStandard({
                  date: moment(policy.expires_on, 'YYYY-MM-DD'),
                  displayLongDate: true,
                }),
            },
            { label: i18n.t('Policy coverage'), value: getCoverage },
            { label: i18n.t('Policy type'), value: 'policy_type' },
            { label: i18n.t('Contract code'), value: 'contr_code' },
            {
              label: i18n.t('Authorisation phone number'),
              value: (policy) => policy.auth_phone_number?.number,
            },
            {
              label: i18n.t('Deductible currency'),
              value: 'deductible_currency',
            },
            {
              label: i18n.t('Deductible amount'),
              value: 'deductible',
            },
            {
              label: i18n.t('Primary policy'),
              value: nullIfNoPolicy(booleanToYesNo('is_primary')),
            },
            {
              label: i18n.t('Notify employer'),
              value: nullIfNoPolicy(booleanToYesNo('emp_notify')),
            },
            {
              label: i18n.t('Authorization required'),
              value: nullIfNoPolicy(booleanToYesNo('auth_req')),
            },
            {
              label: i18n.t('Prescription drug BIN #'),
              value: 'rx_bin',
            },
            {
              label: i18n.t('Prescription group BIN #'),
              value: 'rx_group',
            },
            {
              label: i18n.t('Prescription group PCN #'),
              value: 'rx_pcn',
            },
            {
              label: i18n.t('Place of service code'),
              value: 'serv_code',
            },
            {
              label: i18n.t('Policy holder'),
              value: nullIfNoPolicy((policy) => {
                if (
                  policy.policy_owner_relation === 'self' ||
                  policy.policy_owner_relation == null
                ) {
                  return i18n.t('Athlete');
                }
                return i18n.t('Other');
              }),
            },
            {
              label: i18n.t('Policy owner ID'),
              value: 'policy_owner_id',
            },
            {
              label: i18n.t('Policy holder: First name'),
              value: 'policy_owner_firstname',
            },
            {
              label: i18n.t('Policy holder: Last name'),
              value: 'policy_owner_lastname',
            },
            {
              label: i18n.t('Policy holder: Relationship to athlete'),
              value: 'policy_owner_relation',
            },
            {
              label: i18n.t('Insurance provider'),
              value: 'provider',
            },
            {
              label: i18n.t('Insurance provider phone number'),
              value: (policy) => policy.provider_phone_number?.number,
            },
            {
              label: i18n.t('Insurance provider address'),
              value: 'provider_address',
            },
            {
              label: i18n.t('Notes'),
              value: 'notes',
            },
          ],
        });

        resolve();
      })
      .catch(reject);
  });
};
