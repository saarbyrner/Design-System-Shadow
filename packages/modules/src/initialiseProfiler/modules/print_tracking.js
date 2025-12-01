const s4 = Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

const guid = `${s4}${s4}-${s4}-${s4}-${s4}-${s4}${s4}${s4}`;

export default () => {
  const GIF = `/print_tracking?path=${encodeURIComponent(
    document.location.pathname
  )}&cb=${guid}`;

  const rule = `body:after{content:url('${GIF}')}`;
  const head = document.head || document.getElementsByTagName('head')[0];
  const css = document.createElement('style');

  if (css && head) {
    css.setAttribute('type', 'text/css');
    css.setAttribute('media', 'print');

    if (css.styleSheet) {
      // For IE
      css.styleSheet.cssText = rule;
    } else {
      css.appendChild(document.createTextNode(rule));
    }

    head.appendChild(css);
  }
};
