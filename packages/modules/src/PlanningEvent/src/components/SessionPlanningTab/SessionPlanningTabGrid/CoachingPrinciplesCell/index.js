// @flow
import type { Principle } from '@kitman/common/src/types/Principles';
import { withNamespaces } from 'react-i18next';
import { TextButton, TextTag } from '@kitman/components';
import { getPrincipleNameWithItems } from '@kitman/common/src/utils/planningEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import getStyles from '../style';

type Props = {
  principles: Array<Principle>,
  activityId: number,
  isDisabled: boolean,
  isDraggingPrinciple: boolean,
  showPrinciplesPanel: Function,
  onDeletePrinciple: Function,
};

const CoachingPrinciplesCell = (props: I18nProps<Props>) => {
  const style = getStyles(props.isDraggingPrinciple);

  return (
    <div
      className="sessionPlanningGrid__cell sessionPlanningGrid__cell--principle"
      css={style.cell}
    >
      <span css={style.mobileHeading}>{props.t('Principle')}</span>
      <TextButton
        iconBefore="icon-add"
        type="secondary"
        onClick={() => props.showPrinciplesPanel(props.activityId)}
        isDisabled={props.isDisabled}
        kitmanDesignSystem
        testId="add-principle-button"
      />
      <ul>
        {props.principles.map((principle) => (
          <li key={principle.id}>
            <TextTag
              content={getPrincipleNameWithItems(principle)}
              closeable
              onClose={() =>
                props.onDeletePrinciple(props.activityId, principle.id)
              }
              displayEllipsisWidth={290}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const CoachingPrinciplesCellTranslated = withNamespaces()(
  CoachingPrinciplesCell
);
export default CoachingPrinciplesCell;
