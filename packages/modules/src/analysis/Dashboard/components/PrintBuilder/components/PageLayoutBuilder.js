// @flow
import { css } from '@emotion/react';
import { useRef, type ComponentType, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import { colors } from '@kitman/common/src/variables';
import { DragIndicator } from '@kitman/playbook/icons';
import {
  getGraphTitles,
  formatGraphTitlesToString,
} from '@kitman/modules/src/analysis/shared/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLayoutUpdater from '../hooks/useLayoutUpdater';
import type { Pages } from '../types';
import { isOverlapping, getDefaultGridProps } from '../utils';
import { PAGE_MARGIN_PX } from '../constants';

const DashboardGridLayout = WidthProvider(GridLayout);

type Props = {|
  pages: Pages,
  pageHeightPx: number,
  pageWidthPx: number,
  pageHeight: number,
  pageWidth: number,
  onUpdateLayout: Function,
|};

const INITIAL_ACTIVE_DRAG = {
  pageFrom: -1,
  pageTo: -1,
  layoutItem: null,
};

const DragHandle = () => {
  const [isDragging, setIsDragging] = useState(false);
  const cursor = isDragging ? 'grabbing' : 'grab';
  return (
    <div
      className="js-PageLayoutBuilder--draggable"
      css={css`
        cursor: ${cursor};
      `}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <DragIndicator />
    </div>
  );
};

const LAYOUT_SCALE = 0.4;

function PageLayoutBuilder(props: I18nProps<Props>) {
  const layoutPageRefs = useRef([]);
  const [activeDrag, setActiveDrag] = useState(INITIAL_ACTIVE_DRAG);
  const { moveItemToNewPage, updateLayoutOnPage } = useLayoutUpdater(
    props.pages,
    props.onUpdateLayout
  );

  const getWidgetName = (widgetGraphData) => {
    const {
      widget_type: widgetType,
      widget_render: widgetRender,
      widget,
    } = widgetGraphData;

    switch (widgetType) {
      case 'development_goal':
        return props.t('Development Goals');
      case 'header':
        return widgetRender.widget_name;
      default:
        if (widgetRender.name) return widgetRender.name;
        if (widget.name) return widget.name;

        return formatGraphTitlesToString(getGraphTitles(widgetRender));
    }
  };

  return (
    <div
      css={css`
        max-height: calc(100vh - 350px);
        overflow: auto;
        background-color: grey;
        padding: 10px;
      `}
    >
      {props.pages.map((page, index) => (
        <div
          key={page.number}
          ref={(el) => {
            layoutPageRefs.current[index] = el;
          }}
          css={css`
            min-height: ${props.pageHeightPx * LAYOUT_SCALE}px;
            width: ${props.pageWidthPx * LAYOUT_SCALE}px;
            padding: ${PAGE_MARGIN_PX * LAYOUT_SCALE}px;
            border: solid 1px white;
            background-color: white;
            position: relative;
            margin: 10px auto;

            .react-draggable-dragging {
              z-index: 15 !important;
            }
          `}
        >
          {activeDrag.pageTo === page.number &&
            activeDrag.pageFrom !== page.number && (
              <div
                css={css`
                  position: absolute;
                  top: ${PAGE_MARGIN_PX * LAYOUT_SCALE}px;
                  bottom: ${PAGE_MARGIN_PX * LAYOUT_SCALE}px;
                  left: ${PAGE_MARGIN_PX * LAYOUT_SCALE}px;
                  right: ${PAGE_MARGIN_PX * LAYOUT_SCALE}px;
                  background-color: white;
                  opacity: 0.8;
                  border: dashed 2px grey;
                  z-index: 10;
                `}
              />
            )}
          <DashboardGridLayout
            width={props.pageWidthPx}
            allowOverlap={false}
            compactType="vertical"
            draggableHandle=".js-PageLayoutBuilder--draggable"
            onDrag={(...args) => {
              let overLapIndex = -1;
              const draggingElement = args[5];

              layoutPageRefs.current.forEach((ref, idx) => {
                const pageElement = ref;
                const overlapping = isOverlapping(draggingElement, pageElement);

                if (overlapping) {
                  overLapIndex = idx;
                }
              });

              setActiveDrag({
                pageFrom: page.number,
                pageTo: overLapIndex + 1,
                layoutItem: args[1],
              });
            }}
            onDragStop={() => {
              const { pageFrom, pageTo, layoutItem } = activeDrag;

              if (pageFrom === pageTo || pageTo === -1 || layoutItem == null) {
                return;
              }

              moveItemToNewPage(pageFrom, pageTo, layoutItem);
              setActiveDrag(INITIAL_ACTIVE_DRAG);
            }}
            onLayoutChange={(layout) => {
              if (activeDrag.pageTo === -1) {
                return;
              }
              updateLayoutOnPage(page.number, layout);
            }}
            onResizeStop={(layout) => {
              updateLayoutOnPage(page.number, layout);
            }}
            resizeHandle={(_, ref) => {
              return (
                <div
                  ref={ref}
                  css={css`
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    cursor: se-resize;
                  `}
                >
                  <i className="icon-resize" />
                </div>
              );
            }}
            isResizable
            layout={page.layout}
            {...getDefaultGridProps(LAYOUT_SCALE)}
            useCSSTransforms
          >
            {page.widgets.map((widgetData) => {
              return (
                <div
                  key={widgetData.id}
                  data-id={widgetData.id}
                  css={css`
                    border: solid 1px ${colors.cool_light_grey};
                    border-radius: 3px;
                    background-color: ${colors.white};
                  `}
                >
                  <div
                    css={css`
                      font-size: 12px;
                      padding: 5px;
                      font-weight: bold;
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <DragHandle />
                    {getWidgetName(widgetData)}
                  </div>
                </div>
              );
            })}
          </DashboardGridLayout>
          <div
            css={css`
              position: absolute;
              top: ${props.pageHeightPx * LAYOUT_SCALE}px;
              left: 0;
              right: 0;
              // dotted margin on top of the page
              border-top: 2px dashed grey;
            `}
          />
        </div>
      ))}
    </div>
  );
}

export const PageLayoutBuilderTranslated: ComponentType<Props> =
  withNamespaces()(PageLayoutBuilder);
export default PageLayoutBuilder;
