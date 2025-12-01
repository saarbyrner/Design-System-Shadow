// @flow
import { withNamespaces } from 'react-i18next';
import { Fragment, useState, useEffect, useMemo, useCallback } from 'react';
import type { ComponentType } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { InputTextField } from '@kitman/components';

import {
  onUpdateActiveCondition,
  type ValidationStatus,
} from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';

import {
  selectActiveCondition,
  selectAllConditions,
  selectValidationStatus,
} from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import { useFetchPredicateOptionsQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';

import styles from '@kitman/modules/src/ConditionalFields/VersionLevel/src/components/VersionBuildViewTab/styles';
import type {
  RequiredFieldsAndValues,
  ActiveCondition,
} from '@kitman/modules/src/ConditionalFields/shared/types';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import { OperandListTranslated as OperandList } from '../OperandList';

type Props = {
  isPublished: boolean,
  setRequiredFieldsAndValues: (
    value:
      | RequiredFieldsAndValues
      | ((prev: RequiredFieldsAndValues) => RequiredFieldsAndValues)
  ) => void,
};

const PredicateBuild = ({
  isPublished,
  t,
  setRequiredFieldsAndValues,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const activeConditionValidationStatus: ValidationStatus = useSelector(
    selectValidationStatus
  );

  const { data: organisation } = useGetOrganisationQuery();

  const {
    isLoading: arePredicateOptionsLoading,
    isError: didPredicateOptionsError,
  } = useFetchPredicateOptionsQuery(organisation.id, {
    skip: !organisation.id,
  });

  const activeCondition: ActiveCondition = useSelector(selectActiveCondition);

  const allConditions: Array<ActiveCondition> =
    useSelector(selectAllConditions);

  // Local state for the input value and invalid flag
  const [nameInput, setNameInput] = useState(activeCondition.name || '');
  const [isInvalid, setIsInvalid] = useState(false);

  // Memoize existing names to optimize performance
  const existingNames = useMemo(
    () =>
      allConditions
        .filter((condition) => condition.id !== activeCondition.id)
        .map((condition) => condition.name.toLowerCase()),
    [allConditions, activeCondition.id]
  );

  // Handle input changes with local state to ensure good performance
  const handleNameChange = useCallback(({ target }) => {
    setNameInput(target.value);
    setRequiredFieldsAndValues((prev: RequiredFieldsAndValues) => {
      return {
        ...prev,
        ruleName: !!target.value,
      };
    });
  }, []);

  // Debounce validation and dispathing updates
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedName = nameInput.trim();

      // Check if the input is empty
      if (!trimmedName) {
        setIsInvalid(true);
        return;
      }

      // check if the name already exists
      if (existingNames.includes(trimmedName.toLowerCase())) {
        setIsInvalid(true);
      } else {
        // Name is valid
        setIsInvalid(false);

        // Only dispatch if the name has actualy changed
        if (trimmedName !== activeCondition.name) {
          dispatch(
            onUpdateActiveCondition({ key: 'name', value: trimmedName })
          );
        }
      }
    }, 500);

    // cleanup
    return () => {
      clearTimeout(handler);
    };
  }, [nameInput, existingNames, activeCondition.name]);

  // Sync local state with activeCondition.name if it changes elswhere
  useEffect(() => {
    setNameInput(activeCondition.name || '');
  }, [activeCondition.name]);

  return (
    <Fragment>
      <div css={styles.conditionFormRow2}>
        <InputTextField
          label={t('Rule name')}
          value={nameInput}
          onChange={handleNameChange}
          disabled={
            arePredicateOptionsLoading ||
            didPredicateOptionsError ||
            isPublished
          }
          invalid={
            (activeConditionValidationStatus === 'PENDING' && !nameInput) ||
            isInvalid
          }
          customValidationText={t('This field requires a unique value')}
          displayValidationText
          kitmanDesignSystem
        />
      </div>
      <hr css={[styles.hrWide, styles.conditionFormRow3]} />
      <OperandList isPublished={isPublished} />
    </Fragment>
  );
};

export const PredicateBuildTranslated: ComponentType<{}> =
  withNamespaces()(PredicateBuild);

export default PredicateBuild;
