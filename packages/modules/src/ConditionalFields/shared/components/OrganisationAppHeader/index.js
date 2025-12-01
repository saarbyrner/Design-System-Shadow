// @flow
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { AppStatus, TextButton } from '@kitman/components';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { RequestStatus } from '@kitman/common/src/types';

import { add as createToast } from '@kitman/modules/src/Toasts/toastsSlice';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { useUpdateOwnerRulesetsMutation } from '../../services/conditionalFields';
import type { OrgLevelProps } from '../../types';

const style = {
  organisationHeader: css`
    background-color: ${colors.p06};
    margin-bottom: 0;
    ${!window.featureFlags['update-perf-med-headers'] && ` padding: 24px;`}
    ${window.featureFlags['update-perf-med-headers'] &&
    `padding: 1.58em 1.70em 1.14em`}
  `,
  head: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  `,
  actions: css`
    margin-right: 24px;
  `,
};

const OrganisationAppHeader = ({
  organisationId,
  t,
}: I18nProps<OrgLevelProps>) => {
  const dispatch = useDispatch();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);

  const locationAssign = useLocationAssign();
  const [updateOwnerRulesets, metaData] = useUpdateOwnerRulesetsMutation();
  const { isError, isLoading } = metaData;
  const { trackEvent } = useEventTracking();

  const handleUpdateOwnerRulesets = () => {
    setRequestStatus('PENDING');

    trackEvent(
      performanceMedicineEventNames.addRuleset,
      determineMedicalLevelAndTab()
    );

    updateOwnerRulesets()
      .then((data) => {
        const { error } = data;
        if (error) {
          /** TODO: Fail Gracefully
           *  need to work out with product
           *  how they want errors to happen
           *  for now will crash app
           */
          setRequestStatus('FAILURE');
        } else {
          const { data: responseData } = data;
          setRequestStatus('SUCCESS');
          // will always be version 1 when creating a new ruleset
          const targetURL = `/administration/conditional_fields/organisations/${organisationId}/rulesets/${responseData?.id}/versions/1`;
          // redirect to "version level" of newly created ruleset
          locationAssign(targetURL);
          dispatch(
            createToast({
              id: `createRuleset_${responseData?.id}`,
              title: t('Ruleset created successfully'),
              status: 'SUCCESS',
            })
          );
        }
      })
      .catch(() =>
        /** TODO: Fail Gracefully
         *  need to work out with product
         *  how they want errors to happen
         *  for now will crash app
         */
        setRequestStatus('FAILURE')
      );
  };

  const renderContent = () => {
    if (requestStatus === 'FAILURE' || isError)
      return <AppStatus status="error" />;

    return (
      <div css={style.head}>
        <h2 css={style.title}>{t('Logic builder')}</h2>
        <div css={style.actions}>
          <TextButton
            onClick={handleUpdateOwnerRulesets}
            text={t('Add ruleset')}
            type="primary"
            isLoading={requestStatus === 'PENDING' || isLoading}
            kitmanDesignSystem
          />
        </div>
      </div>
    );
  };
  return <header css={style.organisationHeader}>{renderContent()} </header>;
};

export const OrganisationAppHeaderTranslated: ComponentType<OrgLevelProps> =
  withNamespaces()(OrganisationAppHeader);
export default OrganisationAppHeader;
