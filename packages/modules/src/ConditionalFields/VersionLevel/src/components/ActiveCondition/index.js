// @flow
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { AppStatus, LoadingSpinner, TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';

import { selectRequestStatus } from '@kitman/modules/src/ConditionalFields/shared/redux/selectors/conditionBuildView';
import type { RequiredFieldsAndValues } from '@kitman/modules/src/ConditionalFields/shared/types';

import { onAddQuestion } from '@kitman/modules/src/ConditionalFields/shared/redux/slices/conditionBuildViewSlice';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { ActiveConditionHeaderTranslated as ActiveConditionHeader } from './components/ActiveConditionHeader';
import { PredicateBuildTranslated as PredicateBuildComponent } from './components/PredicateBuild';
import QuestionsComponentList from './components/QuestionsList';

import styles from '../VersionBuildViewTab/styles';

type Props = {
  isPublished: boolean,
  requiredFieldsAndValues: RequiredFieldsAndValues,
  setRequiredFieldsAndValues: (
    value:
      | RequiredFieldsAndValues
      | ((prev: RequiredFieldsAndValues) => RequiredFieldsAndValues)
  ) => void,
};

const ActiveCondition = ({
  isPublished,
  t,
  requiredFieldsAndValues,
  setRequiredFieldsAndValues,
}: I18nProps<Props>) => {
  const requestStatus = useSelector(selectRequestStatus);
  const dispatch = useDispatch();

  const renderContent = () => {
    switch (requestStatus) {
      case 'FAILURE':
        return <AppStatus status="error" isEmbed />;
      case 'PENDING':
        return (
          <div css={styles.loaderWrapper}>
            <LoadingSpinner size={88} color={colors.grey_400} />
          </div>
        );
      case 'SUCCESS':
        return (
          <div>
            <ActiveConditionHeader isPublished={isPublished} />
            <div css={styles.conditionForm}>
              <PredicateBuildComponent
                isPublished={isPublished}
                requiredFieldsAndValues={requiredFieldsAndValues}
                setRequiredFieldsAndValues={setRequiredFieldsAndValues}
              />
            </div>
            <hr css={[styles.hr, styles.conditionFormRow3]} />
            <QuestionsComponentList
              isPublished={isPublished}
              requiredFieldsAndValues={requiredFieldsAndValues}
              setRequiredFieldsAndValues={setRequiredFieldsAndValues}
            />
            <div css={[styles.addQuestionButton]}>
              <TextButton
                text={`+ ${t('Add question')}`}
                onClick={() => {
                  dispatch(onAddQuestion());
                }}
                isDisabled={isPublished}
                type="subtle"
                kitmanDesignSystem
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return renderContent();
};

export const ActiveConditionComponentTranslated =
  withNamespaces()(ActiveCondition);

export default ActiveCondition;
