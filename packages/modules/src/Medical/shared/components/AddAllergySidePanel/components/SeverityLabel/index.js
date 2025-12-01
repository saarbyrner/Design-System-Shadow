// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import severityLabelColour from '@kitman/common/src/utils/severityLabelColour';
import type { ComponentType } from 'react';

import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

const style = {
  severityPreview: css`
    justify-self: start;
    grid-column: 2 / 3;
    padding-top: 16px;
  `,
  label: css`
    color: ${colors.grey_100};
    display: block;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    margin-bottom: 4px;
  `,
  content: css`
    font-size: 14px;
    display: inline-block;
    padding: 0px 4px;
    border-radius: 3px;
  `,
};

export type Props = {
  label: string,
  severity: string,
  showPreviewLabel?: boolean,
};

const fontColourToSet = (severity) =>
  severity === 'severe' ? colors.white : colors.grey_400;

const SeverityLabel = (props: I18nProps<Props>) => {
  const { label, severity, showPreviewLabel } = props;
  return (
    <div css={style.severityPreview}>
      {showPreviewLabel && (
        <label css={style.label}>{props.t('Preview')}</label>
      )}
      <div
        data-testid="SeverityLabel|Title"
        css={style.content}
        style={{
          backgroundColor: `${severityLabelColour(severity)}`,
          color: `${fontColourToSet(severity)}`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SeverityLabelTranslated: ComponentType<Props> =
  withNamespaces()(SeverityLabel);

export default SeverityLabel;
