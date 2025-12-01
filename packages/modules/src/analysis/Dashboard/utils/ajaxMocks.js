// @flow
type AjaxMock = {
  done: (cb: (response: any) => void) => AjaxMock,
  fail: (cb: () => void) => AjaxMock,
};

export const fakeAjaxSuccess = (response: any): AjaxMock => {
  const ajaxMock: AjaxMock = {
    done(cb) {
      cb(response);
      return ajaxMock;
    },
    fail() {
      return ajaxMock;
    },
  };
  return ajaxMock;
};

export const fakeAjaxFailure = (): AjaxMock => {
  const ajaxMock: AjaxMock = {
    done() {
      return ajaxMock;
    },
    fail(cb) {
      cb();
      return ajaxMock;
    },
  };
  return ajaxMock;
};
