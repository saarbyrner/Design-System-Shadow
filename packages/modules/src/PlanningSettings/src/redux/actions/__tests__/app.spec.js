import { expect } from 'chai';
import sinon from 'sinon';
import {
  requestPending,
  requestFailure,
  requestSuccess,
  setAssessmentTemplates,
  getAssessmentTemplates,
} from '../app';

describe('sessionAssessments actions', () => {
  it('has the correct action REQUEST_PENDING', () => {
    const expectedAction = {
      type: 'REQUEST_PENDING',
    };

    expect(requestPending()).to.deep.equal(expectedAction);
  });

  it('has the correct action REQUEST_FAILURE', () => {
    const expectedAction = {
      type: 'REQUEST_FAILURE',
    };

    expect(requestFailure()).to.deep.equal(expectedAction);
  });

  it('has the correct action REQUEST_SUCCESS', () => {
    const expectedAction = {
      type: 'REQUEST_SUCCESS',
    };

    expect(requestSuccess()).to.deep.equal(expectedAction);
  });

  it('has the correct action SET_ASSESSMENT_TEMPLATES', () => {
    const expectedAction = {
      type: 'SET_ASSESSMENT_TEMPLATES',
      payload: {
        assessmentTemplates: [
          {
            id: 182,
            name: 'Create Template',
          },
          {
            id: 15,
            name: 'Defender Assessment',
          },
          {
            id: 14,
            name: 'FMS',
          },
        ],
      },
    };

    expect(
      setAssessmentTemplates([
        {
          id: 182,
          name: 'Create Template',
        },
        {
          id: 15,
          name: 'Defender Assessment',
        },
        {
          id: 14,
          name: 'FMS',
        },
      ])
    ).to.deep.equal(expectedAction);
  });

  describe('when getting assessment templates', () => {
    let origXhr;
    let xhr;
    let requests;
    let server;

    beforeEach(() => {
      origXhr = window.XMLHttpRequest;
      xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = xhr;
      requests = [];
      xhr.onCreate = (req) => {
        requests.push(req);
      };
      server = sinon.fakeServer.create();
    });

    afterEach(() => {
      // we must clean up when tampering with globals.
      xhr.restore();
      window.XMLHttpRequest = origXhr;
      server.restore();
    });

    describe('when the server request is successful', () => {
      it('dispatches the correct actions', () => {
        server.respondWith((request) => {
          request.respond(
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
              assessment_templates: [
                {
                  id: 182,
                  name: 'Create Template',
                },
                {
                  id: 15,
                  name: 'Defender Assessment',
                },
                {
                  id: 14,
                  name: 'FMS',
                },
              ],
            })
          );
        });
        server.respondImmediately = true;

        const getState = sinon.stub();
        getState.returns({
          sessionAssessments: {
            requestStatus: 'SUCCESS',
          },
        });

        const thunk = getAssessmentTemplates();

        const dispatcher = sinon.spy();
        thunk(dispatcher, getState);
        expect(dispatcher.args[0][0]).to.deep.equal({
          type: 'REQUEST_PENDING',
        });
        expect(dispatcher.args[1][0]).to.deep.equal({
          type: 'SET_ASSESSMENT_TEMPLATES',
          payload: {
            assessmentTemplates: [
              {
                id: 182,
                name: 'Create Template',
              },
              {
                id: 15,
                name: 'Defender Assessment',
              },
              {
                id: 14,
                name: 'FMS',
              },
            ],
          },
        });
        expect(dispatcher.args[2][0]).to.deep.equal({
          type: 'REQUEST_SUCCESS',
        });
      });
    });
    describe('when the server request is unsuccessful', () => {
      it('calls the correct actions', () => {
        server.respondWith((request) => {
          request.respond(500, {}, 'ERROR');
        });
        server.respondImmediately = true;
        const getState = sinon.stub();
        getState.returns({
          sessionAssessments: {
            requestStatus: 'SUCCESS',
          },
        });
        const thunk = getAssessmentTemplates();
        const dispatcher = sinon.spy();
        thunk(dispatcher, getState);
        expect(dispatcher.args[0][0]).to.deep.equal({
          type: 'REQUEST_PENDING',
        });
        expect(dispatcher.args[1][0]).to.deep.equal({
          type: 'REQUEST_FAILURE',
        });
      });
    });
  });
});
