// @flow
import { uniqueId } from 'lodash';
import { isValidElement } from 'react';
import type { Node, Element } from 'react';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import type { RuleSet } from '../../types';

const styles = {
  ruleset: {
    container: css`
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 300px;
      margin-top: 10px;
    `,
    rule: css`
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1px solid ${colors.neutral_300};
    `,
    title: css`
      display: grid;
      color: ${colors.grey_300};
      font-size: 16px;
      font-weight: 600;
      grid-template-columns: 1fr;
    `,
    description: css`
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
    `,
    field: css`
      color: ${colors.grey_300};
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
    }`,
    fieldTitle: css`
      color: ${colors.grey_300};
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      margin-right: 4px;
    }`,
    expectedHeaders: css`
      color: ${colors.grey_200};
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }`,
    providedHeaders: css`
      color: ${colors.red_100};
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }`,
  },
};

type Props = {
  ruleset: { [key: string]: ?RuleSet } | Element<any>,
};

const Ruleset = (props: Props): Node => {
  const renderRule = (key: string) => {
    return (
      <div css={styles.ruleset.rule} key={uniqueId()}>
        <div css={styles.ruleset.title}>{key}</div>
        <div css={styles.ruleset.field}>
          <span css={styles.ruleset.fieldTitle}>{i18n.t('Description')}: </span>
          {props.ruleset[key]?.description}
        </div>
        <div css={styles.ruleset.field}>
          <span css={styles.ruleset.fieldTitle}>{i18n.t('Example')}: </span>
          {props.ruleset[key]?.exampleText}
        </div>
        {props.ruleset[key] && props.ruleset[key].exampleList.length > 0 && (
          <div css={styles.ruleset.field}>
            <span css={styles.ruleset.fieldTitle}>
              {i18n.t('Accepted values')}:{' '}
            </span>
            <ul>
              {props.ruleset[key]?.exampleList.map((i) => (
                <li key={uniqueId()}>{i}</li>
              ))}
            </ul>
          </div>
        )}
        <br />
      </div>
    );
  };

  const getRuleSetType = (): Array<Node> | Element<any> => {
    if (
      !isValidElement(props.ruleset) &&
      typeof props.ruleset === 'object' &&
      props.ruleset
    ) {
      return Object.keys(props.ruleset).map((key) => renderRule(key));
    }
    // $FlowIgnore ruleset will be a React node at his point
    return props.ruleset;
  };

  return <div css={styles.ruleset.container}>{getRuleSetType()}</div>;
};

export default Ruleset;
