// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { TextButton } from '@kitman/components';
import { pageModeEnumLike } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/enum-likes';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { PageMode } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/types';
import commonStyles, {
  createHeaderStyles,
} from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/styles';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import SkeletonButton from '../CalendarSettings/EventTypes/Skeletons/SkeletonButton';
import {
  headerMarginBottomRemEditMode,
  headerMarginBottomRemViewArchiveMode,
} from './utils/consts';

type ClickEventCallback = (
  event: SyntheticEvent<HTMLButtonElement>
) => Promise<void> | void;

type Props = {
  pageMode: PageMode,
  isSaveButtonDisabled: boolean,
  isLoading: boolean,
  onSave: ClickEventCallback,
  onCancel: ClickEventCallback,
  onEdit: ClickEventCallback,
  onExitArchive: ClickEventCallback,
  onViewArchive: ClickEventCallback,
};

const Header = ({
  t,
  isSaveButtonDisabled,
  pageMode,
  isLoading,
  onCancel,
  onEdit,
  onSave,
  onExitArchive,
  onViewArchive,
}: I18nProps<Props>) => {
  const { data: permissions } = useGetPermissionsQuery();

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
      {permissions?.eventLocationSettings.canEditEventLocations && (
        <TextButton
          kitmanDesignSystem
          text={t('Edit')}
          type="primary"
          onClick={onEdit}
        />
      )}
      <TextButton
        kitmanDesignSystem
        text={t('View Archive')}
        type="secondary"
        onClick={onViewArchive}
      />
    </>
  );

  const archiveButton = (
    <TextButton
      kitmanDesignSystem
      text={t('Exit Archive')}
      type="primary"
      onClick={onExitArchive}
    />
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
        return archiveButton;
      }
      default: {
        return <div />;
      }
    }
  };

  const title =
    pageMode === pageModeEnumLike.Archive
      ? t('Archived Locations')
      : t('Locations');

  const headerStyles = createHeaderStyles({
    marginBottomRem:
      pageMode === pageModeEnumLike.Edit
        ? headerMarginBottomRemEditMode
        : headerMarginBottomRemViewArchiveMode,
  });

  return (
    <div css={headerStyles}>
      <h3 className="kitmanHeading--L2">{title}</h3>
      <div css={commonStyles.headerButtons}>{renderButtons()}</div>
    </div>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
