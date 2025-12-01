// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useEffect, useRef, useState, useCallback } from 'react';
import { setupPDFWorker } from '@kitman/components/src/PdfViewer/setupPDFWorker';
import { Document, Page } from 'react-pdf';
import Thumbnail from '@kitman/components/src/PdfViewer/src/components/Thumbnail';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Tooltip,
  IconButton,
  Stack,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import styles from '@kitman/components/src/PdfViewer/src/styles';
import {
  MODE_KEY,
  containerWidthDefault,
  thumbnailWidth,
  containerOffset,
  previewOffset,
  widthDeltaThreshold,
} from '@kitman/components/src/PdfViewer/src/consts';
import { convertUrlToFile } from '@kitman/common/src/utils/fileHelper';
import type { ModeKey } from '@kitman/components/src/PdfViewer/src/types';

type Props = {
  forceShowPreview?: boolean,
  height?: number,
  thumbnailsContainerOffsetRight?: number,
  thumbnailsContainerHeightAdjustment?: number,
  isThumbnailsContainerPositionFixed?: boolean,
  fileUrl: string,
  initialPreviewVisible?: boolean,
  mode?: ModeKey,
  onPdfLoadSuccessCallback?: (numPages: number) => void,
  onPdfFetchErrorCallback?: (error: ?Error) => void,
  onPdfLoadErrorCallback?: (error: ?Error) => void,
  isDownloadable?: boolean,
};

const getPdfUrl = (href: string): string => {
  try {
    const url = new URL(href);
    if (url.hostname.includes('imgix')) {
      // Sending the dl param will tell Imgix to let the browser download the pdf directly
      url.searchParams.set('dl', '');
      return url.toString();
    }
    return href;
  } catch {
    return href;
  }
};

setupPDFWorker();

const options = {
  standardFontDataUrl: '/standard_fonts/',
  /*
   * Determines if strings can be evaluated as JavaScript
   * https://github.com/advisories/GHSA-87hq-q4gp-9wr4
   */
  isEvalSupported: false,
};

const PdfViewer = ({
  height,
  forceShowPreview = false,
  thumbnailsContainerOffsetRight = 0,
  thumbnailsContainerHeightAdjustment = 0,
  isThumbnailsContainerPositionFixed = false,
  fileUrl,
  initialPreviewVisible = true,
  mode = MODE_KEY.full,
  onPdfLoadSuccessCallback,
  onPdfFetchErrorCallback,
  onPdfLoadErrorCallback,
  t,
  isDownloadable = false,
}: I18nProps<Props>) => {
  const pageScroll = useRef<any>();
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<?Blob | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(
    initialPreviewVisible
  );
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [clickedIndex, setClickedIndex] = useState<number>(0);
  const [isClickEvent, setIsClickEvent] = useState<boolean>(false);
  const lastWidthRef = useRef<number>(0);

  const isCanvasMode = window.featureFlags['pdf-viewer-render-mode-canvas'];

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    onPdfLoadSuccessCallback?.(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    onPdfLoadErrorCallback?.(error);
  };

  useEffect(() => {
    const pdfViewerContainer = document.querySelector('.pdfViewerContainer');
    if (!(pdfViewerContainer && window.ResizeObserver)) {
      setWidth(containerWidthDefault - containerOffset);
      return;
    }
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const newWidth = entry.contentRect.width - containerOffset;
        // Only update if the change is significant (more than 5px difference)
        if (Math.abs(newWidth - lastWidthRef.current) > widthDeltaThreshold) {
          lastWidthRef.current = newWidth;
          setWidth(newWidth);
        }
      });
    });

    observer.observe(pdfViewerContainer);
    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, []);

  // ref: https://github.com/wojtekmaj/react-pdf/issues/334
  useEffect(() => {
    setIsPdfLoading(true);
    convertUrlToFile(fileUrl, '', '')
      .then((response) => {
        setPdfBlob(response);
        setIsPdfLoading(false);
      })
      .catch((error) => {
        setPdfBlob(null);
        setIsPdfLoading(false);
        onPdfFetchErrorCallback?.(error);
      });
  }, [fileUrl]);

  /*
    Set back to default on unmount
  */
  useEffect(
    () => () => {
      setTotalPages(0);
      setActiveIndex(0);
      setClickedIndex(0);
    },
    []
  );

  /*
    Fix for the black flash when changing pages
    https://github.com/wojtekmaj/react-pdf/issues/1340#issuecomment-1483869537
  */
  const containerRef = useRef();
  const hidePageCanvas = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) canvas.style.visibility = 'hidden';
  }, [containerRef]);
  const showPageCanvas = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) canvas.style.visibility = 'visible';
  }, [containerRef]);

  const onPageLoadSuccess = useCallback(() => {
    hidePageCanvas();
  }, [hidePageCanvas]);
  const onPageRenderSuccess = useCallback(() => {
    showPageCanvas();
  }, [showPageCanvas]);
  const onPageRenderError = useCallback(() => {
    showPageCanvas();
  }, [showPageCanvas]);

  const onScroll = () => {
    // current scroll position
    const scrollTop = pageScroll.current?.scrollTop;
    // get offsets for all pages
    const pageOffsets = [
      ...document.querySelectorAll('.react-pdf__Page.PdfViewerPage'),
    ]
      .map((page, index) => ({ index, offsetTop: page.offsetTop }))
      .reverse();

    if (scrollTop !== null) {
      // get current pages in range
      const pagesInRange = pageOffsets.filter(
        (pageOffset) => scrollTop >= pageOffset.offsetTop
      );

      // if there are pages in range
      if (pagesInRange.length) {
        // set first page in range as active
        setActiveIndex(pagesInRange[0].index + 1);
      } else {
        // reset active index
        setActiveIndex(0);
      }
    }
  };

  const renderSidePreviewToggle = () => (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {isPreviewVisible && (
        <Typography variant="caption" pl={1}>
          {t('Page {{currentPage}} of {{totalPages}}', {
            currentPage: activeIndex + 1,
            totalPages,
          })}
        </Typography>
      )}

      <Stack direction="row" alignItems="center">
        {isDownloadable && isPreviewVisible && (
          <Tooltip title={t('Download PDF')}>
            <IconButton
              component="a"
              href={getPdfUrl(fileUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{
                width: '2rem',
                height: '2rem',
              }}
            >
              <KitmanIcon name={KITMAN_ICON_NAMES.Download} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          title={isPreviewVisible ? t('Hide side preview') : t('Side preview')}
        >
          <IconButton
            sx={{
              marginLeft: isDownloadable && isPreviewVisible ? '0' : '0.5rem',
            }}
            onClick={() => setIsPreviewVisible(!isPreviewVisible)}
          >
            <KitmanIcon name={KITMAN_ICON_NAMES.ViewSidebarOutlined} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <Box className="pdfViewerContainer">
      {isPdfLoading && <CircularProgress />}
      {!isPdfLoading && !pdfBlob && t('Failed to load PDF file.')}
      {!isPdfLoading && pdfBlob && (
        <Document
          /*
        Fix for error when rendering different PDF urls repeatedly
        https://github.com/wojtekmaj/react-pdf/issues/974
      */
          key={isCanvasMode ? `${fileUrl}_${mode}` : fileUrl}
          inputRef={containerRef}
          file={pdfBlob}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onSourceError={onDocumentLoadError}
          loading={<CircularProgress />}
          options={options}
          /*
           * renderMode="canvas" caused the first pages to disappear when changing
           * tabs after some time, changing to renderMode="svg" seemed to fix this
           */
          renderMode={isCanvasMode ? 'canvas' : 'svg'}
        >
          <Box css={styles.pdfContainer}>
            {mode === MODE_KEY.full && (
              <Box css={styles.pagesContainer}>
                <Box
                  ref={pageScroll}
                  css={styles.pages}
                  sx={{ height: height || '100%' }}
                  onScroll={onScroll}
                >
                  {Array.from(new Array(totalPages), (el, index) => (
                    <Box key={`page_${index || 0}`}>
                      <Page
                        className="PdfViewerPage"
                        css={styles.page}
                        inputRef={(ref) => {
                          if (ref && isClickEvent && clickedIndex === index) {
                            ref.scrollIntoView({ block: 'start' });
                            /*
                             * scrollIntoView above scrolls to the exact position of the element
                             * this adds some offset so that the top of the page is visible
                             */
                            window.scrollBy(0, -60);
                            setIsClickEvent(false);
                          }
                        }}
                        pageNumber={index + 1}
                        width={width}
                        loading={<CircularProgress />}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        onLoadSuccess={onPageLoadSuccess}
                        onRenderSuccess={onPageRenderSuccess}
                        onRenderError={onPageRenderError}
                      />
                      {index + 1 !== totalPages && <Divider />}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <Box
              css={[
                styles.thumbnailsContainer,
                mode === MODE_KEY.full
                  ? {
                      right: `${thumbnailsContainerOffsetRight}px`,
                      height: `calc(100% - ${thumbnailsContainerHeightAdjustment}px)`,
                      position: isThumbnailsContainerPositionFixed
                        ? 'fixed'
                        : 'absolute',
                      overflowY: 'auto',
                    }
                  : {},
              ]}
            >
              {mode === MODE_KEY.full && renderSidePreviewToggle()}
              <Box
                css={styles.thumbnails}
                sx={{
                  p: mode === MODE_KEY.thumbnail && '8px',
                  px: '8px',
                  height:
                    isPreviewVisible && height != null
                      ? `${height - previewOffset}px`
                      : 'unset',
                  display:
                    forceShowPreview || isPreviewVisible ? 'flex' : 'none',
                }}
              >
                {Array.from(new Array(totalPages), (el, index) => (
                  <Thumbnail
                    key={`thumb_${index}`}
                    index={index}
                    width={thumbnailWidth}
                    active={mode === MODE_KEY.full && index === activeIndex}
                    mode={mode}
                    onClick={(pageIndex) => {
                      setIsClickEvent(true);
                      setClickedIndex(pageIndex);
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Document>
      )}
    </Box>
  );
};

export const PdfViewerTranslated: ComponentType<Props> =
  withNamespaces()(PdfViewer);
export default PdfViewer;
