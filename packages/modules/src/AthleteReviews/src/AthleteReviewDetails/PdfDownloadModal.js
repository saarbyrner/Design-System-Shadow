// @flow
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@kitman/playbook/components';
import type { Element } from 'react';

type PdfDownloadModalProps = {
  isOpen: boolean,
  onClose: () => void,
  title: string,
  dialogContent: Element<any>,
};

const PdfDownloadModal = ({
  isOpen,
  onClose,
  title,
  dialogContent,
}: PdfDownloadModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="pdf-download-dialog-title"
      aria-describedby="pdf-download-dialog-description"
    >
      <DialogTitle id="pdf-download-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {dialogContent}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PdfDownloadModal;
