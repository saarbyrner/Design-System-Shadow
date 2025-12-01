// @flow

const parseCookie = (str) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v = ['', '']) => {
      // eslint-disable-next-line no-param-reassign
      if (!Array.isArray(v)) v = ['', ''];
      while (v.length < 2) v.push('');
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export default (name: string) => {
  return parseCookie(document.cookie)[name];
};
