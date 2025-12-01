// @flow
import { PARSE_STATE } from '@kitman/modules/src/shared/MassUpload/utils/consts';
import type { ParseState } from '@kitman/modules/src/shared/MassUpload/types';
import colors from '@kitman/common/src/variables/colors';

const stepperHeight = 72.92;
const toggleButtonContainerHeight = 60.5;

const getStyles = ({
  headerHeight,
  parseState,
  isIntegrationSelected,
  hasIntegrationErrored,
}: {
  headerHeight: number,
  parseState: ParseState,
  isIntegrationSelected?: boolean,
  hasIntegrationErrored?: boolean,
}) => ({
  uploaderContainer: {
    width: '100%',
    margin: 'auto',
    height: `calc(100vh - ${headerHeight + stepperHeight}px)`,
    textAlign: 'center',
    background: 'white',
    display: 'flex',
    justifyContent: parseState === PARSE_STATE.Dormant && 'center',
    flexDirection: 'column',
    position: 'relative',

    '& .MuiDataGrid-root': {
      height: `calc(100vh - ${
        headerHeight + stepperHeight + toggleButtonContainerHeight
      }px)`,
    },

    '& .MuiAlert-message': { textAlign: 'left' },

    '& .filepond--wrapper': {
      width: '100%',
      border: '1px dashed rgba(59, 73, 96, 0.12)',
      borderRadius: '4px',
      padding: '48px 0px',
    },

    '& .filepond--root': {
      marginBottom: 0,
    },

    '& .filepond--panel-root': {
      backgroundColor: 'transparent',
    },

    '& .filepond--drop-label': {
      background: 'white',
      // Bellow is applied conditionally via FilePond when
      // not allowMultiple and a file has been attached. Bit
      // hacky, but ensuring it stays visible
      transform: 'initial !important',
      opacity: 'initial !important',
      visibility: 'initial !important',
      pointerEvents: 'initial !important',

      svg: {
        fontSize: '24px',
        mb: 1,
      },

      label: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      },
    },

    '& .filepond--credits': {
      display: 'none',
    },

    '& .filepond--list': {
      display: 'none',
    },
  },
  integrationButtonContainer: {
    width: '616px', // 3 x Button width + flex gap
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: '8px',
    rowGap: '14px',
    margin: '0 auto',
    paddingTop: '32px',
  },
  integrationButton: {
    width: '200px',
    height: '100px',
    border: hasIntegrationErrored
      ? `2px solid ${colors.red_100}`
      : `1px solid ${colors.grey_disabled}`,
    boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
    background: isIntegrationSelected ? colors.grey_200 : 'initial',
    color: isIntegrationSelected ? colors.white : colors.grey_200,
    '&:hover': {
      background: isIntegrationSelected && colors.grey_200,
      border: hasIntegrationErrored
        ? `2px solid ${colors.red_100}`
        : `1px solid ${colors.grey_disabled}`,
      boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)',
    },
  },
  integrationImg: {
    maxWidth: '160px',
    filter: isIntegrationSelected && 'brightness(0) invert(1)',
  },
  noRowsMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    gap: '8px',
  },
});

export default getStyles;
