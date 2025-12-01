// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { TextButton, TooltipMenu } from '@kitman/components';
import styles, {
  createHeaderStyles,
} from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import SkeletonButton from './Skeletons/SkeletonButton';
import { pageModeEnumLike } from '../utils/enum-likes';
import { headerMarginBottomRem } from '../utils/consts';
import { useGetCalendarSettingsPermissions } from '../utils/hooks';
import type { PageMode } from '../utils/types';

type ClickEventCallback = (
  event: SyntheticEvent<HTMLButtonElement>
) => Promise<void> | void;

const headerStyles = createHeaderStyles({
  marginBottomRem: headerMarginBottomRem,
});

type Props = {
  pageMode: PageMode,
  isSaveButtonDisabled: boolean,
  isLoading: boolean,
  onSave: ClickEventCallback,
  onCancel: ClickEventCallback,
  onEdit: ClickEventCallback,
  onArchive: () => Promise<void>,
  onExitArchive: ClickEventCallback,
  onUnarchive: () => Promise<void>,
  onViewArchive: ClickEventCallback,
};

const Header = ({
  t,
  isSaveButtonDisabled,
  isLoading,
  pageMode,
  onArchive,
  onCancel,
  onEdit,
  onSave,
  onExitArchive,
  onUnarchive,
  onViewArchive,
}: I18nProps<Props>) => {
  const { canArchiveCustomEvents, canEditCustomEvents } =
    useGetCalendarSettingsPermissions();

  const viewArchiveText = t('View Archive');

  const editButtons = (
    <>
      <TextButton
        kitmanDesignSystem
        text={t('Save')}
        type="primary"
        isDisabled={isSaveButtonDisabled}
        onClick={onSave}
      />
      <TextButton
        kitmanDesignSystem
        text={t('Cancel')}
        type="secondary"
        onClick={onCancel}
      />
    </>
  );

  const viewButtons = (
    <>
      {canEditCustomEvents && (
        <TextButton
          kitmanDesignSystem
          text={t('Edit')}
          type="primary"
          onClick={onEdit}
        />
      )}
      {canArchiveCustomEvents && (
        <TextButton
          kitmanDesignSystem
          text={t('Archive')}
          type="secondary"
          onClick={onArchive}
        />
      )}
      {canEditCustomEvents || canArchiveCustomEvents ? (
        <TooltipMenu
          placement="bottom-start"
          menuItems={[
            {
              description: viewArchiveText,
              onClick: onViewArchive,
            },
          ]}
          tooltipTriggerElement={
            <TextButton iconAfter="icon-more" kitmanDesignSystem />
          }
          kitmanDesignSystem
        />
      ) : (
        <TextButton
          kitmanDesignSystem
          text={viewArchiveText}
          type="primary"
          onClick={onViewArchive}
        />
      )}
    </>
  );

  const archiveButtons = (
    <>
      <TextButton
        kitmanDesignSystem
        text={t('Exit Archive')}
        type="primary"
        onClick={onExitArchive}
      />
      {canArchiveCustomEvents && (
        <TextButton
          kitmanDesignSystem
          text={t('Unarchive')}
          type="secondary"
          onClick={onUnarchive}
        />
      )}
    </>
  );

  const renderButtons = () => {
    if (isLoading) {
      return (
        <>
          <SkeletonButton />
          <SkeletonButton />
        </>
      );
    }
    switch (pageMode) {
      case pageModeEnumLike.Edit: {
        return editButtons;
      }
      case pageModeEnumLike.View: {
        return viewButtons;
      }
      case pageModeEnumLike.Archive: {
        return archiveButtons;
      }
      default: {
        return <div />;
      }
    }
  };

  const title =
    pageMode === pageModeEnumLike.Archive
      ? t('Archived Event Types')
      : t('Event Types');

  return (
    <div css={headerStyles}>
      <h3 className="kitmanHeading--L2">{title}</h3>
      <div css={styles.headerButtons}>{renderButtons()}</div>
    </div>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
