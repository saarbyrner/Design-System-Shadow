// @flow
import { colors } from '@kitman/common/src/variables';

const boldText = {
  fontFamily: 'Open Sans',
  fontSize: 14,
  fontWeight: 600,
  color: colors.grey_200,
};

const subText = {
  fontFamily: 'Open Sans',
  fontSize: 12,
  fontWeight: 400,
  color: colors.grey_300,
};

export default {
  container: {
    backgroundColor: colors.s23,
  },
  title: {
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontWeight: 600,
  },
  emptyDataGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  contactName: boldText,
  contactTitle: { ...subText, maxWidth: 180 },
  flag: {
    width: 33,
    height: 33,
    borderRadius: '50%',
  },
  organisation: boldText,
  drawerTitle: {
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontWeight: 600,
    color: colors.grey_300,
  },
  errorText: {
    color: colors.red_100,
    fontSize: '12px',
    marginLeft: 0,
  },
  label: {
    fontFamily: 'Open Sans',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '16px',
    color: colors.grey_100,
    marginLeft: 0,
  },
};
