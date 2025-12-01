// @flow

import { combineReducers } from 'redux';
import appStatus from './appStatus';
import staticData from './staticData';
import participantForm from './participantForm';

export default combineReducers({ staticData, participantForm, appStatus });
