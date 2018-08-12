import {  takeLatest, put, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { connect } from '../createSocketConnection'
import {
    setCustomerServiceAvailability
} from './../actions'

export function eventChannelBuilder(eventSource) {
    return new eventChannel(emit=>{

        const enableSupportMessage = ()=>{
            emit(true)
        };

        const disableSupportMessage = ()=>{
            emit(false)
        };

        eventSource.on(`SUPPORT_AVAILABLE`,enableSupportMessage);
        eventSource.on(`SUPPORT_NOT_AVAILABLE`,disableSupportMessage);

        return ()=>{
            eventSource.off(`SUPPORT_AVAILABLE`,enableSupportMessage);
            eventSource.off(`SUPPORT_NOT_AVAILABLE`,disableSupportMessage);
        }
    });
}

function* handleMessage(supportAvailable) {
    yield put(setCustomerServiceAvailability(supportAvailable));
}

export function* customerServiceAvailabilitySaga() {
    const socket = yield call(connect);
    const chan = yield call(eventChannelBuilder, socket);

    yield takeLatest(chan, handleMessage);
}