// @flow
import type { ComponentType } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';

const styles = {
  section: css`
    margin-bottom: 16px;
  `,
  titleWrapper: css`
    display: flex;
    justify-content: space-between;
  `,
  title: css`
    margin-bottom: 8px;
    text-transform: capitalize;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
  `,
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `,
};

export type MetaDataType = {
  text: string,
  value: string | number,
  options?: ?Array<Object>,
};

type Props = {
  metaData: Array<MetaDataType>,
};

const MetaData = (props: Props) => {
  return (
    <section>
      <div css={styles.grid}>
        {props.metaData.map((item) => (
          <div css={styles.section} key={item.value}>
            <div css={styles.titleWrapper}>
              <h4 css={styles.title} data-testid="MetaData|Title">
                {item.text}
              </h4>
            </div>
            <div data-testid="MetaData|Value">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const MetaDataTranslated: ComponentType<Props> =
  withNamespaces()(MetaData);
export default MetaData;
