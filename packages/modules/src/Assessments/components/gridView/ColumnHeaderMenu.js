// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';

import { TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  name: string,
  onDelete: Function,
};

const ColumnHeaderMenu = (props: I18nProps<Props>) => {
  const [isTriggerShowed, setIsTriggerShowed] = useState(false);
  const [isMenuShowed, setIsMenuShowed] = useState(false);

  return (
    <div
      className="groupedAssessment__columnHeaderMenu"
      role="button"
      tabIndex={0}
      onMouseLeave={() => !isMenuShowed && setIsTriggerShowed(false)}
    >
      <button
        className="groupedAssessment__columnHeaderMenuDisplayer"
        type="button"
        onMouseEnter={() => setIsTriggerShowed(true)}
      >
        {props.name}
      </button>
      <TooltipMenu
        placement="bottom-end"
        offset={[0, 5]}
        menuItems={[
          {
            description: props.t('Delete'),
            onClick: props.onDelete,
          },
        ]}
        onVisibleChange={(isVisible) => {
          setIsMenuShowed(isVisible);
          setIsTriggerShowed(isVisible);
        }}
        tooltipTriggerElement={
          <button
            type="button"
            className={classnames(
              'groupedAssessment__columnHeaderMenuTrigger',
              {
                'groupedAssessment__columnHeaderMenuTrigger--showed':
                  isTriggerShowed,
              }
            )}
          >
            <i className="icon-more" />
          </button>
        }
        kitmanDesignSystem
      />
    </div>
  );
};

export default ColumnHeaderMenu;
export const ColumnHeaderMenuTranslated = withNamespaces()(ColumnHeaderMenu);
