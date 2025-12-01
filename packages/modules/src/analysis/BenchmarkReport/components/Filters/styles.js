// @flow
import { colors } from '@kitman/common/src/variables';

export const getFilterStyles = (widthCalc: number) => ({
  width: `calc((100% / ${widthCalc}))`,
  paddingRight: '30px',
  maxWidth: '450px',
});

export default {
  filtersRoot: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    height: ' 100%',
    width: '100%',
    padding: '14px',
    margin: '0 0 7px',
    borderRadius: ' 5px',
  },
  heading: {
    color: colors.grey_100,
    fontSize: '16px',
    fontWeight: 600,
    padding: '10px 0',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  testPanel: {
    flex: 4,
  },
  orgPanel: {
    flex: 1,
    paddingLeft: '7px',
  },
  orgText: {
    fontSize: '12px',
    fontWeight: 600,
    color: colors.grey_100,
    textAlign: 'center',
    margin: 0,
    paddingLeft: '6px',
  },
  orgRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  divider: {
    backgroundColor: colors.neutral_300,
    display: 'block',
    width: '100%',
    height: '1px',
    marginTop: '10px',
  },
  verticalDivider: {
    backgroundColor: colors.neutral_300,
    display: 'block',
    width: '1px',
    height: '100px',
    marginLeft: '7px',
    justifyContent: 'center',
  },
  filtersButtonsPanel: {
    flex: '1 0 100%',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-end',
    gap: '14px',
  },
  filtersButtons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: '14px',
    gap: '7px',
  },
};
