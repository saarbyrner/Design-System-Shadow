// @flow
import { useState, type ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { withNamespaces } from 'react-i18next';
import { Button } from '@kitman/playbook/components';

import { AppStatus } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import ProfileHeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/ProfileHeaderLayout';

import { add as createToast } from '@kitman/modules/src/Toasts/toastsSlice';
import { ConfirmationModalTranslated as ConfirmationModal } from '@kitman/modules/src/ConditionalFields/shared/components/ConfirmationModal';
import { type I18nProps } from '@kitman/common/src/types/i18n';

import EditableTitle from '@kitman/modules/src/ConditionalFields/shared/components/EditableTitle';
import {
  usePublishVersionMutation,
  useSaveVersionMutation,
} from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import {
  onResetFormState,
  onSetRequestStatus,
} from '../../redux/slices/conditionBuildViewSlice';
import { BackButtonTranslated as BackButton } from '../BackButton';

type Props = {
  rulesetId: string,
  versionId: string,
  title: ?string, // it's possible to create a version without a title
  isPublished: boolean,
  allFieldsAreValid: boolean,
};

const style = {
  title: {
    color: colors.grey_300,
    fontSize: convertPixelsToREM(24),
    fontWeight: 600,
    margin: 0,
  },
};

const VersionAppHeader = ({
  t,
  title,
  rulesetId,
  versionId,
  isPublished,
  allFieldsAreValid,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();

  const [publishConfirmationModalOpen, setPublishConfirmationModalOpen] =
    useState<boolean>(false);

  const [saveVersion, { isLoading: isTitleSaving }] = useSaveVersionMutation();

  const [publishVersion, { isLoading: isVersionPublishing }] =
    usePublishVersionMutation();

  const handlePublish = () => {
    dispatch(onSetRequestStatus({ requestStatus: 'PENDING' }));
    publishVersion({ rulesetId, versionId })
      .then(({ data: { id } }) => {
        dispatch(onResetFormState);
        dispatch(onSetRequestStatus({ requestStatus: 'SUCCESS' }));
        dispatch(
          createToast({
            id: `publishVersion_${id}`,
            title: t('Version published successfully'),
            status: 'SUCCESS',
          })
        );
        setPublishConfirmationModalOpen(false);
      })
      .catch(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'ERROR' }));
        return <AppStatus status="error" isEmbed />;
      });
  };

  const handleOnSubmit = (titleToUpdate: string) => {
    dispatch(onSetRequestStatus({ requestStatus: 'PENDING' }));

    saveVersion({
      rulesetId,
      versionId,
      conditions: null,
      versionName: titleToUpdate,
    })
      .then(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'SUCCESS' }));
        dispatch(onResetFormState());
      })
      .catch(() => {
        dispatch(onSetRequestStatus({ requestStatus: 'ERROR' }));
      });
  };
  const versionName = title || '--';
  return (
    <ProfileHeaderLayout>
      <ProfileHeaderLayout.Actions>
        <BackButton />
      </ProfileHeaderLayout.Actions>
      <ProfileHeaderLayout.Main>
        <ProfileHeaderLayout.Content>
          <h2 style={style.title}>
            {!isPublished ? (
              <EditableTitle
                initialValue={versionName}
                isTitleSaving={isTitleSaving}
                onSubmit={handleOnSubmit}
                title={title}
              />
            ) : (
              versionName
            )}
          </h2>
        </ProfileHeaderLayout.Content>
        <ProfileHeaderLayout.Right>
          {!isPublished && (
            <Button
              onClick={() => setPublishConfirmationModalOpen(true)}
              disabled={!allFieldsAreValid}
              type="primary"
              isLoading={isVersionPublishing}
            >
              {t('Publish')}
            </Button>
          )}
        </ProfileHeaderLayout.Right>
        <ConfirmationModal
          open={publishConfirmationModalOpen}
          modalTitle={t('Publish')}
          modalContent={t(
            'When you publish you can no longer edit this version of the ruleset.'
          )}
          primaryButtonText={t('Publish')}
          onCancel={() => setPublishConfirmationModalOpen(false)}
          onPrimaryAction={handlePublish}
        />
      </ProfileHeaderLayout.Main>
    </ProfileHeaderLayout>
  );
};

export const VersionAppHeaderTranslated: ComponentType<Props> =
  withNamespaces()(VersionAppHeader);

export default VersionAppHeader;
