// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useCallback, useEffect, useMemo, useState } from 'react';
import _merge from 'lodash/merge';
import type { RequestStatus } from '@kitman/common/src/types';
import type { PreliminarySchema } from '@kitman/modules/src/Medical/rosters/types';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import getIssueFieldsConfig from '../services/getIssueFieldsConfig';
import type {
  IssueFieldConstraint,
  IssueFormFieldKey,
  IssueFieldIllnessKey,
  IssueFieldInjuryKey,
} from '../types/medical/IssueFormField';
import { isAnnotationInvalid } from '../utils';
import { normalizePreliminarySchema } from '../utils/preliminaryIssueSchema';
import { preliminaryConfigurationFlowIsActive } from '../utils/isFeatureActive';

type ConfigItem = {
  label?: string,
  labelGetter?: () => string,
  validate: Function,
  constraint: IssueFieldConstraint,
  shouldValidate: boolean,
};

type FieldConfig = {
  [IssueFormFieldKey]: ConfigItem,
};

const isFalsy = (value) => !value;
const isEmptyArray = (value) => value.length === 0;
const getFieldValueClientConfig = () => ({
  chronic_issue_onset_date: {
    label: i18n.t('Chronic condition onset date?'),
    validate: isFalsy,
  },
  linked_chronic_issues: {
    label: i18n.t('Occurrence of?'),
    validate: isFalsy,
  },
  issue_type: {
    label: i18n.t('Type'),
    validate: isFalsy,
  },
  athlete_id: {
    label: i18n.t('Athlete'),
    validate: isFalsy,
  },
  reccurrence_id: {
    labelGetter: (selectedIssueType) =>
      selectedIssueType === 'INJURY_RECURRENCE'
        ? i18n.t('Previous injury')
        : i18n.t('Previous illness'),
    validate: isFalsy,
  },
  occurrence_date: {
    labelGetter: (issueIsAContinuation) =>
      issueIsAContinuation ? i18n.t('New record date') : i18n.t('Onset date'),
    validate: isFalsy,
  },
  side_id: {
    label: i18n.t('Side'),
    validate: isFalsy,
  },
  coding_system_side_id: {
    label: i18n.t('Side'),
    validate: isFalsy,
  },
  primary_pathology_id: {
    label: i18n.t('Pathology'),
    validate: isFalsy,
  },
  supplemental_recurrence_id: {
    label: i18n.t('Supplemental recurrence'),
    validate: isFalsy,
  },
  illness_onset_id: {
    label: i18n.t('Onset Type'),
    validate: isFalsy,
  },
  issue_occurrence_onset_id: {
    label: i18n.t('Onset Type'),
    validate: isFalsy,
  },
  events: {
    label: i18n.t('Status'),
    validate: (statuses) => {
      if (!statuses.length) {
        return isEmptyArray(statuses);
      }

      const result = [];

      statuses.forEach((statusItem, index) => {
        if (statusItem.status === '') {
          result.push(`events_${index}`);
        }

        // if status is the same as the previous
        if (index > 0 && statusItem.status === statuses[index - 1].status) {
          result.push(`events_${index}`);
        }
      });

      return result;
    },
  },
  concussion_assessments: {
    label: i18n.t('Attach report(s)'),
    validate: isEmptyArray,
  },
  examination_date: {
    label: i18n.t('Examination date'),
    validate: ({ diagnosisDate, examinationDate }) => {
      if (typeof diagnosisDate !== 'undefined') {
        return diagnosisDate > examinationDate;
      }

      return isFalsy(examinationDate);
    },
  },
  examination_date_basic: {
    label: i18n.t('Examination date'),
    constraint: 'mandatory',
    validate: isFalsy,
  },
  game_id: {
    label: i18n.t('Event'),
    validate: isFalsy,
  },
  training_session_id: {
    label: i18n.t('Event'),
    validate: isFalsy,
  },
  activity_id: {
    label: i18n.t('Mechanism'),
    validate: isFalsy,
  },
  position_when_injured_id: {
    label: i18n.t('Position'),
    validate: isFalsy,
  },
  reported_date: {
    label: i18n.t('Reported date'),
    validate: isFalsy,
  },
  squad: {
    label: i18n.t('Occurred in Squad'),
    validate: isFalsy,
  },
  session_completed: {
    label: i18n.t('Session completed'),
  },
  conditional_questions: {
    label: i18n.t('Additional information'), // Note: custom translation 'Background screen'
    validate: (questions) => {
      // IF V2
      if (window.featureFlags['conditional-fields-v1-stop']) {
        return questions?.some((question) => {
          if (question.answers?.length > 0) {
            return question.answers.some((answer) => {
              if (answer.value) {
                return answer.value === '';
              }

              return true;
            });
          }

          return true;
        });
      }

      // else V1
      return questions.some((question) => {
        if (question.answer) {
          return question.answer.value === '';
        }

        return true;
      });
    },
  },
  presentation_type: {
    label: i18n.t('Presentation'),
    validate: isFalsy,
  },
  issue_contact_type: {
    label: i18n.t('Contact Type'),
    validate: isFalsy,
  },
  // This is a specific case of mechanism used by certain clients
  // activity_id or mechanism is translated differently for them
  injury_mechanism: {
    label: i18n.t('Primary activity at time of injury'),
    validate: isFalsy,
  },
  continuation_issue_id: {
    label: i18n.t('Select injury/ illness'),
    validate: isFalsy,
  },
  annotations: {
    validate: (annotations) =>
      annotations.filter(isAnnotationInvalid).length > 0,
    shouldValidate: true,
  },
  activity_type: {
    label: i18n.t('Event'),
    validate: isFalsy,
    shouldValidate: true,
  },
});

const useIssueFields = ({
  issueType,
  skip,
  serverConfig: serverConfigFromProps = {},
}: {
  issueType: 'injury' | 'illness',
  skip: boolean,
  serverConfig?: PreliminarySchema,
}) => {
  const [configResponse, setConfigResponse] = useState({});
  const [fieldConfigRequestStatus, setFieldConfigRequestStatus] =
    useState<RequestStatus>(null);
  const checkIsMounted = useIsMountedCheck();

  useEffect(() => {
    if (!skip && !preliminaryConfigurationFlowIsActive()) {
      setFieldConfigRequestStatus('PENDING');
      getIssueFieldsConfig()
        .then((response) => {
          if (checkIsMounted()) {
            setFieldConfigRequestStatus('SUCCESS');
            setConfigResponse(response);
          }
        })
        .catch(() => {
          if (checkIsMounted()) {
            setFieldConfigRequestStatus('FAILURE');
          }
        });
    }
  }, [skip]);

  const fieldConfig: FieldConfig = useMemo(() => {
    const clientConfig = getFieldValueClientConfig();

    if (preliminaryConfigurationFlowIsActive()) {
      const preliminaryServerConfig = normalizePreliminarySchema(
        serverConfigFromProps,
        clientConfig
      );

      // Order matters here: clientConfig overrides preliminaryServerConfig values (left to right). The empty object prevents mutation of the original objects.
      return _merge({}, preliminaryServerConfig, clientConfig);
    }

    const serverConfig = {
      ...configResponse.common_fields,
      ...configResponse[`${issueType}_fields`],
    };

    return _merge({}, serverConfig, clientConfig);
  }, [issueType, configResponse, serverConfigFromProps]);

  const getFieldConfig = (field: IssueFormFieldKey): ?ConfigItem => {
    return fieldConfig[field];
  };

  const validate = useCallback(
    (
      fields: { [IssueFormFieldKey]: any },
      validation: 'preliminary' | 'full'
    ): Array<IssueFormFieldKey> => {
      const shouldValidate = (config = {}) => {
        if (config.shouldValidate) return true;

        if (validation === 'preliminary') {
          return config.constraint === 'mandatory';
        }

        return (
          config.constraint === 'must_have' || config.constraint === 'mandatory'
        );
      };

      return Object.keys(fields)
        .map((field) => ({ field, value: fields[field] }))
        .reduce((acc, entry) => {
          const { field, value } = entry;
          const config = getFieldConfig(field);

          if (!config || !shouldValidate(config)) {
            return [...acc];
          }

          const validationResult = config.validate(value);
          let validationValues = [...acc];

          if (typeof validationResult === 'boolean' && validationResult) {
            validationValues.push(field);
          } else if (
            Array.isArray(validationResult) &&
            validationResult.length
          ) {
            validationValues = [...validationValues, ...validationResult];
          }

          return validationValues;
        }, []);
    },
    [fieldConfig]
  );

  const isFieldVisible = (field: IssueFormFieldKey): boolean => {
    return !!getFieldConfig(field);
  };

  const getFieldLabel = (field: IssueFormFieldKey, ...args: any): string => {
    const config = getFieldConfig(field);
    if (!config) {
      return '';
    }

    if (typeof config.labelGetter !== 'undefined') {
      return config.labelGetter(...args);
    }

    return config.label || '';
  };

  type ByTypeArgs = {
    injury: IssueFieldInjuryKey,
    illness: IssueFieldIllnessKey,
  };

  const isFieldVisibleByType = ({ injury, illness }: ByTypeArgs) => {
    if (issueType === 'illness') {
      return isFieldVisible(illness);
    }

    return isFieldVisible(injury);
  };

  const getFieldLabelByType = (
    { injury, illness }: ByTypeArgs,
    ...args: any
  ) => {
    if (issueType === 'illness') {
      return getFieldLabel(illness, ...args);
    }

    return getFieldLabel(injury, ...args);
  };

  return {
    validate,
    isFieldVisible,
    isFieldVisibleByType,
    getFieldLabel,
    getFieldLabelByType,
    getFieldConfig,
    fieldConfigRequestStatus,
  };
};

export default useIssueFields;
