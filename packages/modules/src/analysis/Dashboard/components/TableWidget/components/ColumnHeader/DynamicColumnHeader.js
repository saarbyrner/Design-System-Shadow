// @flow
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { searchParams } from '@kitman/common/src/utils';
import { InfoTooltip, TooltipMenu } from '@kitman/components';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  columnName: string,
  onClickDeleteRow: () => void,
  onClickEditRow: () => void,
  canManageDashboard: boolean,
  isHistoricPopulation: boolean,
  squads: Array<string>,
};

const DynamicColumnHeader = ({
  columnName,
  onClickDeleteRow,
  onClickEditRow,
  isHistoricPopulation,
  t,
}: I18nProps<Props>) => {
  const isPivoted =
    window.getFlag('table-updated-pivot') && !!searchParams('pivot');

  const populationNameClasses = classNames(
    'tableWidget__rowHeader--populationName',
    'tableWidget__rowHeader--populationName--narrow'
  );

  const historicPopulationLabel = (
    <span className="tableWidget__rowHeader--contextSquad">
      {t('Historical squad')}
    </span>
  );

  return (
    <TooltipMenu
      placement="bottom-start"
      menuItems={[
        {
          description: t('Edit'),
          icon: 'icon-edit',
          isDisabled: isPivoted,
          onClick: onClickEditRow,
        },
        {
          description: t('Delete Row(s)'),
          icon: 'icon-bin',
          isDisabled: isPivoted,
          onClick: onClickDeleteRow,
          isDestructive: true,
        },
      ]}
      tooltipTriggerElement={
        <div className="dynamicHeaderWrapper">
          <div className="tableWidget__rowHeader--dynamicContainer">
            <InfoTooltip content={columnName} placement="bottom-start">
              <div>
                <span className={populationNameClasses}>{columnName}</span>

                {window.getFlag('rep-historic-reporting') &&
                  isHistoricPopulation &&
                  historicPopulationLabel}
              </div>
            </InfoTooltip>
          </div>
          <i className="tableWidget__rowHeader--burgerMenu icon-more" />
        </div>
      }
      kitmanDesignSystem
    />
  );
};

export default DynamicColumnHeader;
export const DynamicColumnHeaderTranslated =
  withNamespaces()(DynamicColumnHeader);
