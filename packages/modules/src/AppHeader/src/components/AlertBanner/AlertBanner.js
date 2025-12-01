// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

type Props = {
  bannerColor: string,
  iconClassName: string,
  iconColor: string,
  bannerMessage: string,
};

const AlertBanner = (props: Props) => {
  const styles = {
    wrapper: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: ${props.bannerColor};
      padding: 15px;
      position: sticky;
      top: 50px;
    `,
    iconColor: css`
      margin-right: 8px;
      color: ${props.iconColor};
    `,
    bannerMessage: css`
      flex: 1;
      margin-right: auto;
      margin-bottom: 0px;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: ${colors.grey_300};
    `,
  };

  return (
    <div css={styles.wrapper}>
      <i
        className={props.iconClassName}
        css={styles.iconColor}
        data-testid="AlertBannerIcon"
      />
      <p css={styles.bannerMessage}>{props.bannerMessage}</p>
    </div>
  );
};

export default AlertBanner;
