// @flow
/*
 * Initiates Material UI Pro on the single page application
 * Based on: https://mui.com/x/introduction/licensing/#license-key-installation
 */

import { LicenseInfo } from '@mui/x-license-pro';

export default (muiLicenceKey: string) => {
  LicenseInfo.setLicenseKey(muiLicenceKey);
};
