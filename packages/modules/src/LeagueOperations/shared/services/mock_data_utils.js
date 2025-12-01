// This will not be tested. It's purely here to help with the mock data in the FE for a demo
// eslint-disable-next-line flowtype/require-valid-file-annotation
const filterTestData = (filters, item) => {
  return Object.entries(filters).every(([key, value]) => {
    if (value) {
      if (key === 'type' && item.role?.length > 0) {
        return item.role.includes(value);
      }
      if (typeof value === 'string') {
        return item[key].toLowerCase().includes(value.toString().toLowerCase());
      }
      if (typeof value === 'number') {
        return item[key] === value;
      }
      return item[key].toLowerCase().includes(value.toLowerCase());
    }
    return true;
  });
};

export const buildLogoPath = (partialPath) => {
  const asset = partialPath || 'kitman_logo_full_bleed.png';
  return `https://kitman-staging.imgix.net/${asset}?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=96&h=96`;
};

export default filterTestData;
