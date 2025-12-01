// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { TextLink } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  procedure: { id: number, type: string },
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

const LinkedProcedure = (props: I18nProps<Props>) => {
  return (
    <div css={styles.section} data-testid="LinkedProcedure|Root">
      <h4 css={styles.title}>{props.t('Linked procedure')}</h4>
      <ul css={styles.list} data-testid="LinkedProcedure|LinkedProcedure">
        <li key={`${props.procedure.type}_${props.procedure.id}`}>
          <TextLink
            text={props.procedure.type}
            href={`/medical/procedures/${props.procedure.id}`}
            kitmanDesignSystem
          />
        </li>
      </ul>
    </div>
  );
};

export const LinkedProcedureTranslated: ComponentType<Props> =
  withNamespaces()(LinkedProcedure);
export default LinkedProcedure;
