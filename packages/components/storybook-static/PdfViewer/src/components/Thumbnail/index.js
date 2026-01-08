// @flow
import { useState, useEffect } from 'react';
import { Page } from 'react-pdf';
import styles from '@kitman/components/src/PdfViewer/src/styles';
import { zIndices } from '@kitman/common/src/variables';
import {
  Box,
  CircularProgress,
  Link,
  Popper,
  Typography,
  ClickAwayListener,
} from '@kitman/playbook/components';
import {
  MODE_KEY,
  thumbnailWidth,
  thumbnailOnHoverWidth,
  popoverOffsetRight,
} from '@kitman/components/src/PdfViewer/src/consts';
import type { ModeKey } from '@kitman/components/src/PdfViewer/src/types';

type Props = {
  index: number,
  width?: number,
  active: boolean,
  mode?: ModeKey,
  onClick: (index: number) => void,
};

type Offset = {
  top: number,
  left: number,
};

/*
  A temporary thumbnail component as the older version of react-pdf we are using (to avoid node update), doesn't provide a thumbnail.
  When we are able to upgrade to the latest version, we will replace this component with react-pdf's Thumbnail.
  The newer version has Thumbnails that do not register themselves as "link target" which the page is scrolled to upon clicking an internal PDF link.
  For Faxing and Scanning projects, we are not expecting to have PDF's with links so this will serve our initial needs.
*/
const Thumbnail = ({
  index,
  width = thumbnailWidth,
  active = false,
  mode = MODE_KEY.full,
  onClick,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<?HTMLElement>(null);
  const [thumbnailClicked, setThumbnailClicked] = useState<number>(0);
  const [thumbnailOffset, setThumbnailOffset] = useState<Offset>({
    top: 0,
    left: 0,
  });

  const resetState = () => {
    setAnchorEl(null);
    setThumbnailClicked(0);
    setThumbnailOffset({
      top: 0,
      left: 0,
    });
  };

  /*
    Set back to default on unmount
  */
  useEffect(
    () => () => {
      resetState();
    },
    []
  );

  const openThumbnailPreview = (event) => {
    if (mode !== MODE_KEY.thumbnail) {
      return;
    }
    setAnchorEl(event.currentTarget);
    setThumbnailClicked(index + 1);
    const rect = event?.currentTarget?.getBoundingClientRect();
    const top = event.clientY - rect.top;
    const left = rect.right + popoverOffsetRight;
    setThumbnailOffset({ top, left });
  };

  const onClickAway = () => {
    if (mode !== MODE_KEY.thumbnail) {
      return;
    }
    resetState();
  };

  const pageComponent = (
    <Box>
      <Page
        key={`page_${index}`}
        css={styles.thumbnailPage}
        pageNumber={index + 1}
        width={width}
        loading={<CircularProgress />}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onClick={openThumbnailPreview}
      />
      <Typography variant="caption" component="div" sx={{ pt: '5px' }}>
        {index + 1}
      </Typography>
    </Box>
  );

  return (
    <Box css={[styles.thumbnail, active && styles.thumbnailActive]}>
      {mode === MODE_KEY.full ? (
        <Link
          component="div"
          underline="none"
          onClick={(e) => {
            e.preventDefault();
            onClick(index);
          }}
          sx={{ cursor: 'pointer' }}
        >
          {pageComponent}
        </Link>
      ) : (
        pageComponent
      )}

      {mode === MODE_KEY.thumbnail && anchorEl && thumbnailClicked !== 0 && (
        <Popper
          id="thumbnail_popover"
          anchorEl={anchorEl}
          open
          sx={{
            zIndex: zIndices.popover,
            top: `${thumbnailOffset.top}px !important`,
            left: `${thumbnailOffset.left}px !important`,
          }}
          transition
        >
          <ClickAwayListener onClickAway={onClickAway}>
            <Page
              key={`pageHovered_${index}`}
              css={styles.thumbnailPage}
              pageNumber={thumbnailClicked}
              width={thumbnailOnHoverWidth}
              loading={<CircularProgress />}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </ClickAwayListener>
        </Popper>
      )}
    </Box>
  );
};

export default Thumbnail;
