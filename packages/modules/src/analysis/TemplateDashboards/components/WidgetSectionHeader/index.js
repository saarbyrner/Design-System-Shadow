// @flow
import { css } from '@emotion/react';

const styles = {
  sectionHeader: css`
    h3 {
      margin-bottom: unset;
    }
  `,
};

type Props = {
  widgetId: string | number,
  widgetTitle: string,
};

function WidgetSectionHeader(props: Props) {
  return props.widgetId === 'player_care_header' ? (
    <div
      css={styles.sectionHeader}
      key={props.widgetId}
      data-intercom-target="Player Care"
    >
      <h3>{props.widgetTitle}</h3>
    </div>
  ) : (
    <div css={styles.sectionHeader} key={props.widgetId}>
      <h3>{props.widgetTitle}</h3>
    </div>
  );
}

export default WidgetSectionHeader;
