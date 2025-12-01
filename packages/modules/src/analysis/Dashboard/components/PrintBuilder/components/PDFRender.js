// @flow
import type { ComponentType } from 'react';
import { useState, useRef, useLayoutEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { css } from '@emotion/react';
import { withSize } from 'react-sizeme';
import { jsPDF as JSPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import type { Squad } from '@kitman/common/src/types/Squad';
import type {
  SquadAthletesSelection,
  SquadAthletes,
} from '@kitman/components/src/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import useIsMountedCheck from '@kitman/common/src/hooks/useIsMountedCheck';
import {
  Typography,
  Button,
  CircularProgress,
} from '@kitman/playbook/components';
import { colors } from '@kitman/common/src/variables';
import type { User } from '@kitman/modules/src/analysis/Dashboard/types';
import WidgetRenderer from '@kitman/modules/src/analysis/Dashboard/containers/WidgetRenderer';
import { PAGE_MARGIN_PX } from '../constants';
import { getDefaultGridProps, handleContentOverflow } from '../utils';
import { useSettings } from './SettingsContext';
import styleWithProps from './style';
import type { PrintLayout } from '../types';

type Props = {
  hasChanges: boolean,
  pages: Array<Object>,
  pageWidth: number,
  pageHeight: number,
  squads: Array<Squad>,
  annotationTypes: Array<Object>,
  appliedSquadAthletes?: SquadAthletesSelection,
  pivotedDateRange?: Object,
  pivotedTimePeriod?: string,
  pivotedTimePeriodLength?: ?number,
  currentUser: User,
  squadAthletes: SquadAthletes,
  dashboardPrintLayout: PrintLayout,
  dashboardTitle: string,
};

// The withSizeHOC helps with hiding the version of the dashboard which will
// be converted to a canvas for the pdf
const withSizeHOC = withSize({ monitorWidth: true, monitorHeight: true });
const DashboardGridLayout = withSizeHOC(WidthProvider(GridLayout));

function PDFRender(props: I18nProps<Props>) {
  const styles = styleWithProps(props.pageWidth, props.pageHeight);
  const pageRefs = useRef([]);
  const containerRef = useRef(null);
  const [pageZoom, setPageZoom] = useState(1);
  const isMounted = useIsMountedCheck();
  const [isRendering, setIsRendering] = useState(false);
  const {
    settings: { orientation },
  } = useSettings();
  const renderPdf = useDebouncedCallback(async () => {
    const currentPageZoom = pageZoom;
    if (pageZoom !== 1) {
      setPageZoom(1);
    }
    const addImage = async (page) => {
      let canvas;
      try {
        canvas = await html2canvas(page, { useCORS: true });
      } catch {
        canvas = null;
      }
      return canvas;
    };

    const pageCanvases = await Promise.all(pageRefs.current.map(addImage));

    const doc = new JSPDF({
      orientation,
      unit: 'px',
      format: [props.pageWidth, props.pageHeight],
    });
    pageCanvases.forEach((canvas, index) => {
      if (canvas === null) {
        return;
      }

      if (index !== 0) {
        doc.addPage();
      }
      handleContentOverflow(doc, canvas, props.pageWidth, props.pageHeight);
    });
    doc.save(`${props.dashboardTitle}.pdf`);
    setIsRendering(false);

    if (isMounted()) {
      setIsRendering(false);
    }

    if (currentPageZoom !== 1) {
      setPageZoom(currentPageZoom);
    }
  }, 1000);

  useLayoutEffect(() => {
    setTimeout(() => {
      if (containerRef.current !== null) {
        const width = containerRef.current.clientWidth - 20;
        if (width < props.pageWidth) {
          setPageZoom(width / props.pageWidth);
        }
      }
    });
  }, [props.pageWidth]);

  return (
    <div ref={containerRef} css={styles.pdfPreviewWrapper}>
      {isRendering && (
        <div css={styles.creatingPdfNotification}>
          <Typography variant="h6" padding={2}>
            {props.t('Creating PDF')}
          </Typography>
          <CircularProgress />
        </div>
      )}
      <div
        css={css`
          position: sticky;
          top: 0;
          left: 0;
          padding: 0 ${PAGE_MARGIN_PX}px;
          background-color: rgb(82, 86, 89);
          z-index: 1;
        `}
      >
        <Typography
          variant="h6"
          padding={2}
          css={css`
            display: flex;
            justify-content: space-between;
            padding: 16px 0;
            color: ${colors.white};
          `}
        >
          {props.t('PDF Preview')}
          <Button
            color="secondary"
            onClick={() => {
              renderPdf();
              setIsRendering(true);
            }}
          >
            {props.t('Download PDF')}
          </Button>
        </Typography>
      </div>

      <div
        css={css`
          padding: 0 20px;
          transform: scale(${pageZoom});
          transform-origin: top left;
        `}
      >
        {props.pages.map((page, index) => (
          <div
            key={page.number}
            ref={(el) => {
              pageRefs.current[index] = el;
            }}
            css={styles.page}
          >
            <DashboardGridLayout
              className="layout"
              compactType="vertical"
              isDraggable={false}
              isDroppable={false}
              isResizable={false}
              layout={page.layout}
              {...getDefaultGridProps()}
            >
              {page.widgets.map((widgetData) => (
                <div key={widgetData.id}>
                  <WidgetRenderer
                    widgetData={widgetData}
                    squadAthletes={props.squadAthletes}
                    squads={props.squads}
                    annotationTypes={props.annotationTypes}
                    currentUser={props.currentUser}
                    appliedSquadAthletes={props.appliedSquadAthletes}
                    pivotedDateRange={props.pivotedDateRange}
                    pivotedTimePeriod={props.pivotedTimePeriod}
                    pivotedTimePeriodLength={props.pivotedTimePeriodLength}
                  />
                </div>
              ))}
            </DashboardGridLayout>
            {!isRendering && <div css={styles.pageMarker} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export const PDFRenderTranslated: ComponentType<Props> =
  withNamespaces()(PDFRender);
export default PDFRender;
