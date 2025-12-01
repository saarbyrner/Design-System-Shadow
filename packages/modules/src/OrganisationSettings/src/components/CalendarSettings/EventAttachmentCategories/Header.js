// @flow
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';

import { TextButton } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import SkeletonButton from '../EventTypes/Skeletons/SkeletonButton';
import { pageModeEnumLike } from '../utils/enum-likes';
import { headerMarginBottomRem } from '../utils/consts';
import type { PageMode } from '../utils/types';
import commonStyles, { createHeaderStyles } from '../utils/styles';

const headerStyles = createHeaderStyles({
  marginBottomRem: headerMarginBottomRem,
});

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

export type TranslatedProps = I18nProps<Props>;
const Header = ({
  t,
  isSaveButtonDisabled,
  isLoading,
  pageMode,
  onCancel,
  onEdit,
  onSave,
  onExitArchive,
  onViewArchive,
}: TranslatedProps) => {
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
      <TextButton
        kitmanDesignSystem
        text={t('Edit')}
        type="primary"
        onClick={onEdit}
      />
      <TextButton
        kitmanDesignSystem
        text={t('View Archive')}
        type="primary"
        onClick={onViewArchive}
      />
    </>
  );

  const exitArchiveButton = (
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
        return exitArchiveButton;
      }
      default: {
        return <div />;
      }
    }
  };

  return (
    <div css={headerStyles}>
      <h3 className="kitmanHeading--L2">
        {pageMode === pageModeEnumLike.Archive
          ? t('Archived Upload Categories')
          : t('Upload Categories')}
      </h3>
      <div css={commonStyles.headerButtons}>{renderButtons()}</div>
    </div>
  );
};

export const HeaderTranslated: ComponentType<Props> = withNamespaces()(Header);
export default Header;
