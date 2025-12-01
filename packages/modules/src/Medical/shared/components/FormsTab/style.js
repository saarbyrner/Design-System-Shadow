// @flow
import { colors } from '@kitman/common/src/variables';

const style = {
  content: {
    background: colors.p06,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '70px',
  },
  footer: {
    position: 'fixed',
    bottom: '0',
    paddingLeft: '10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    height: '50px',
    width: '100%',
    background: colors.p06,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '26px 24px 15px',
  },

  title: {
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '24px',
  },

  loader: {
    color: colors.grey_300,
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '20px',
    marginTop: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },

  wrapper: {
    minHeight: '540px',
  },

  noFormsText: {
    color: colors.grey_200,
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '20px',
    marginTop: '24px',
    textAlign: 'center',
  },
};

export default style;
