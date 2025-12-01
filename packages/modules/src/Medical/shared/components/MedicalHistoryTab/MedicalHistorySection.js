// @flow
import type { Node } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  wrapper: css`
    align-items: flex-start;
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    width: 100%;
    padding: 24px;
    padding-bottom: 0;
  `,
  title: css`
    color: ${colors.grey_300};
    font-size: 20px;
    font-weight: 600;
  `,
};

type Props = {
  children: Node,
};

const Header = ({ children }: Props) => {
  return <div css={styles.header}>{children}</div>;
};

const Title = ({ children }: Props) => {
  return <h3 css={styles.title}>{children}</h3>;
};

const Content = ({ children }: Props) => {
  return children;
};

const MedicalHistorySection = ({ children }: Props) => {
  return <section css={styles.wrapper}>{children}</section>;
};

MedicalHistorySection.Header = Header;
MedicalHistorySection.Title = Title;
MedicalHistorySection.Content = Content;

export default MedicalHistorySection;
