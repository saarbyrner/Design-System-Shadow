// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { PAGE_MARGIN_PX } from '../constants';

const style = (width: number, height: number) => ({
  hiddenDashboardWrapper: css`
    height: 0;
    width: 0;
    overflow: hidden;
    align-items: center;
  `,
  pdfEmbedSection: css`
    width: 100%;
    height: calc(100vh - 170px);
    position: relative;
    border-radius: 3px;
    overflow: hidden;
  `,
  creatingPdfNotification: css`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 16px;
    text-align: center;
    background-color: ${colors.neutral_100};
    z-index: 2;
    opacity: 0.9;
  `,
  pdfPreviewWrapper: css`
    width: 100%;
    height: calc(100vh - 170px);
    position: relative;
    overflow: auto;
    background-color: rgb(82, 86, 89);
    border-radius: 4px;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  `,
  embedLoader: css`
    position: absolute;
    // Deliberately using a rgba for a transparent background
    background-color: rgba(255, 255, 255, 0.3);
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    padding-top: 100px;
  `,
  page: css`
    width: ${width - PAGE_MARGIN_PX}px;
    min-height: ${height - PAGE_MARGIN_PX}px;
    position: relative;
    margin-bottom: ${PAGE_MARGIN_PX}px;
    padding: ${PAGE_MARGIN_PX}px;
    overflow: hidden;
    background-color: white;
  `,
  pageMarker: css`
    position: absolute;
    top: ${height -
    1}px; // removing 1 px so the dashed line is split across the different pages
    left: 0;
    right: 0;
    // dotted margin on top of the page
    border-top: 2px dashed rgb(82, 86, 89);
  `,
  embed: css`
    width: 100%;
    height: 100%;
  `,
});

export default style;
