import fileSizeLabel from '../fileSizeLabel';

describe('fileSizeLabel', () => {
  it('formats different byte sizes', () => {
    expect(fileSizeLabel(2456, true)).toEqual('2.5 kB');
    expect(fileSizeLabel(2456, true, 2)).toEqual('2.46 kB');
    expect(fileSizeLabel(2456)).toEqual('2.4 KiB');

    // MB
    expect(fileSizeLabel(1234000, true)).toEqual('1.2 MB');
    expect(fileSizeLabel(1234000, true, 2)).toEqual('1.23 MB');
    expect(fileSizeLabel(1234000)).toEqual('1.2 MiB');

    // GB
    expect(fileSizeLabel(1230000000, true)).toEqual('1.2 GB');
    expect(fileSizeLabel(1230000000, true, 2)).toEqual('1.23 GB');
    expect(fileSizeLabel(1230000000)).toEqual('1.1 GiB');
  });
});
