// @flow
import type { ComponentType, Node } from 'react';
import { colors } from '@kitman/common/src/variables';
import { css } from '@emotion/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getScrollThreshold } from './utils';

type Props = {
  onReachingEnd: Function,
  children: Node,
  hasMore: boolean,
  itemsLength: number,
  nextPage?: number | null,
  scrollableTarget?: string,
};

const style = {
  loadingText: css`
    color: ${colors.neutral_300};
    font-size: 14px;
    font-weight: normal;
    line-height: 20px;
    margin-top: 24px;
    text-align: center;
  `,
};

const InfiniteScrollLayout = (props: I18nProps<Props>) => {
  return (
    <InfiniteScroll
      dataLength={props.itemsLength}
      next={props.onReachingEnd}
      hasMore={props.hasMore}
      scrollThreshold={
        window.featureFlags['fix-lazy-load-debounce']
          ? getScrollThreshold(props.nextPage || null)
          : 0.8
      }
      scrollableTarget={props.scrollableTarget}
      loader={<div css={style.loadingText}>{props.t('Loading')} ...</div>}
    >
      {props.itemsLength > 0 && props.children}
    </InfiniteScroll>
  );
};

export const InfiniteScrollLayoutTranslated: ComponentType<Props> =
  withNamespaces()(InfiniteScrollLayout);
export default InfiniteScrollLayout;
