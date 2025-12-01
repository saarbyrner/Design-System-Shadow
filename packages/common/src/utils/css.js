// @flow

// em is relative to the font-size of its direct or nearest parent, rem is only
// relative to the html (root) font-size.
export const convertPixelsToREM = (pixels: number): string => {
  const conversion = Number(Number(pixels / 16.0).toFixed(3));

  return `${conversion}rem`;
};
