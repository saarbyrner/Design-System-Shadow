// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { TextLink } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  diagnostic: { id: number, type: string },
  annotationableId: number,
};

const styles = {
  section: css`
    margin-bottom: 16px;
  `,
  title: css`
    margin-bottom: 8px;
    text-transform: capitalize;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
};

const LinkedDiagnostic = (props: I18nProps<Props>) => {
  return (
    <div css={styles.section} data-testid="LinkedDiagnostic|Root">
      <h4 css={styles.title}>{props.t('Linked diagnostic')}</h4>
      <ul css={styles.list} data-testid="LinkedDiagnostic|LinkedDiagnostic">
        <li key={`${props.diagnostic.type}_${props.diagnostic.id}`}>
          <TextLink
            text={props.diagnostic.type}
            href={`/medical/athletes/${props.annotationableId}/diagnostics/${props.diagnostic.id}`}
            kitmanDesignSystem
          />
        </li>
      </ul>
    </div>
  );
};

export const LinkedDiagnosticTranslated: ComponentType<Props> =
  withNamespaces()(LinkedDiagnostic);
export default LinkedDiagnostic;
