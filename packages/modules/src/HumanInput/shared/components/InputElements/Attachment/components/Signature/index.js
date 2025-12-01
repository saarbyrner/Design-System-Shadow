// @flow
import { type ComponentType, useRef, useState, useLayoutEffect } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import type { AttachedFile } from '@kitman/common/src/utils/fileHelper';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { Box, Button, Paper } from '@kitman/playbook/components';
import SignaturePad from 'react-signature-canvas';
import { convertUrlToAttachedFile } from '@kitman/common/src/utils/fileHelper';

type Props = {
  element: HumanInputFormElement,
  onAddAttachment: (attachedFile: AttachedFile) => Promise<void>,
};

const SignatureInput = ({ t, element, onAddAttachment }: I18nProps<Props>) => {
  const sigCanvas = useRef<SignaturePad | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const currentPaperElement = paperRef.current;

    if (!currentPaperElement) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasDimensions({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      });
    });

    resizeObserver.observe(currentPaperElement);

    // Set initial dimensions
    const initialWidth = currentPaperElement.clientWidth;
    const initialHeight = currentPaperElement.clientHeight;
    if (initialWidth > 0 && initialHeight > 0) {
      setCanvasDimensions({
        width: Math.floor(initialWidth),
        height: Math.floor(initialHeight),
      });
    }

    return () => {
      resizeObserver.unobserve(currentPaperElement);
    };
  }, []);

  return (
    <Box>
      <Paper
        elevation={3}
        ref={paperRef}
        sx={{
          width: '100%',
          // Allow a small blank margin so users can scroll around the signature area on smaller (height) screens
          '@media (max-height: 450px)': {
            width: '90%',
          },
          height: '25vw',
          maxHeight: '250px',
          overflow: 'hidden',
        }}
      >
        {canvasDimensions.width > 0 && canvasDimensions.height > 0 && (
          <SignaturePad
            key={`${canvasDimensions.width}-${canvasDimensions.height}`} // Force re-mount on dimension change
            ref={sigCanvas}
            canvasProps={{
              width: canvasDimensions.width,
              height: canvasDimensions.height,
              style: { display: 'block' },
            }}
            onEnd={() => setIsSigned(true)}
          />
        )}
      </Paper>
      <Box display="flex" mt={1} gap={0.5}>
        <Button
          onClick={() => {
            setIsSigned(false);
            sigCanvas.current?.clear();
          }}
          disabled={!isSigned}
        >
          {t('Clear')}
        </Button>
        <Button
          onClick={() => {
            const dataUrl = sigCanvas.current?.toDataURL();
            if (dataUrl) {
              convertUrlToAttachedFile(
                dataUrl,
                'signature.jpeg',
                'image/jpeg',
                element.id
              ).then(onAddAttachment);
            }
          }}
          disabled={!isSigned}
        >
          {t('Sign')}
        </Button>
      </Box>
    </Box>
  );
};

export const SignatureInputTranslated: ComponentType<Props> =
  withNamespaces()(SignatureInput);
export default SignatureInput;
