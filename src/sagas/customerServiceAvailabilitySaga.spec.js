import {takeLatest, call, cancelled} from 'redux-saga/effects';
import { connect } from '../createSocketConnection'
import {customerServiceAvailabilitySaga, eventChannelBuilder} from './customerServiceAvailabilitySaga';

class MockSocket {
    constructor() {
        this.listenersOn = {};
        this.listenersOff = {};
    }

    on(message, fn){
        this.listenersOn[message] = fn;
    }


    off(message, fn){
        this.listenersOff[message] = fn;
    }

    receiveMessage(message, value){
        this.listenersOn[message](value);
    }
}

describe('customerServiceAvailabilitySaga', () => {

    it('should emit that customer service is available when SUPPORT_AVAILABLE is emmited from the socket', async () => {
        const socket = new MockSocket();
        const channel = eventChannelBuilder(socket);

        const taken = new Promise(resolve => channel.take(resolve));
        socket.receiveMessage('SUPPORT_AVAILABLE');

        const value = await taken;
        expect(value).toEqual(true);
    });

    it('should emit that customer service is unavailable when SUPPORT_UNAVAILABLE is emmited from the socket', async () => {
        const socket = new MockSocket();
        const channel = eventChannelBuilder(socket);

        const taken = new Promise(resolve => channel.take(resolve));
        socket.receiveMessage('SUPPORT_NOT_AVAILABLE');

        const value = await taken;
        expect(value).toEqual(false);
    });
});