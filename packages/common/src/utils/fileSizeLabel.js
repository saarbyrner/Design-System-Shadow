// @flow

const label = (bytes: number, thresh: number, units: string[], dp: number) => {
  let byteSize = bytes;
  let u = -1;
  const r = 10 ** dp;

  do {
    byteSize /= thresh;
    u += 1;
  } while (
    Math.round(Math.abs(byteSize) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${byteSize.toFixed(dp)} ${units[u]}`;
};

export default (bytes: number, si: boolean = false, dp: number = 1) => {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  return label(bytes, thresh, units, dp);
};
