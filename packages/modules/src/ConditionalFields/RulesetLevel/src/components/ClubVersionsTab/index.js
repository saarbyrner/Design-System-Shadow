// @flow
import { useDispatch } from 'react-redux';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';

import { AppStatus, TextButton } from '@kitman/components';

import { add as createToast } from '@kitman/modules/src/Toasts/toastsSlice';

import TabLayout from '@kitman/components/src/TabLayout';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useUpdateOwnerVersionsMutation } from '../../../../shared/services/conditionalFields';

import ConditionalFieldsGrid from '../../../../shared/components/ConditionalFieldsGrid';

import useVersionsGrid from '../../../../shared/hooks/useVersionsGrid';

import type { RulesetLevelProps } from '../../../../shared/types';

const style = {
  actions: css`
    margin-right: 24px;
  `,
};

const ClubVersionsTab = ({
  organisationId,
  rulesetId,
  t,
}: I18nProps<RulesetLevelProps>) => {
  const dispatch = useDispatch();

  const { ruleset, grid, isRulesetError, isRulesetFetching } = useVersionsGrid({
    organisationId,
    rulesetId,
  });

  const [updateOwnerVersions] = useUpdateOwnerVersionsMutation();

  const handleUpdateOwnerVersions = () => {
    updateOwnerVersions({ rulesetId }).then(({ data: { id } }) => {
      dispatch(
        createToast({
          id: `createVersion_${id}`,
          title: 'Version created successfully',
          status: 'SUCCESS',
        })
      );
    });
  };

  const renderContent = () => {
    if (isRulesetError) {
      return <AppStatus status="error" />;
    }
    if (isRulesetFetching) {
      return <TabLayout.Loading />;
    }
    return (
      <ConditionalFieldsGrid
        gridId={grid.id}
        grid={grid}
        isFullyLoaded
        emptyTableText={grid.emptyTableText}
        rowActions={null}
        isLoading={isRulesetFetching}
      />
    );
  };

  return (
    <TabLayout>
      <TabLayout.Body>
        <TabLayout.Header>
          <TabLayout.Title>{t('Versions')}</TabLayout.Title>
          <div css={style.actions}>
            <TextButton
              onClick={handleUpdateOwnerVersions}
              text={t('Add version')}
              type="secondary"
              isDisabled={!ruleset?.versions?.[0]?.published_at} // can only have one 'inactive' version at a time
              kitmanDesignSystem
            />
          </div>
        </TabLayout.Header>
        <TabLayout.Content>{renderContent()}</TabLayout.Content>
      </TabLayout.Body>
    </TabLayout>
  );
};

export const ClubVersionsTabTranslated = withNamespaces()(ClubVersionsTab);
export default ClubVersionsTab;
