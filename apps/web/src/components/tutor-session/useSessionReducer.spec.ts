import { sessionReducer, initialState, SessionState } from './useSessionReducer';
import { Message } from '../conversation-pane/ConversationPaneContainer';

describe('sessionReducer', () => {
  it('handles START_RECORDING action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'idle',
      error: 'Some previous error',
    };
    const action = { type: 'START_RECORDING' as const };
    const nextState = sessionReducer(state, action);
    expect(nextState.status).toBe('recording');
    expect(nextState.error).toBeNull();
  });

  it('handles STOP_RECORDING action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'recording',
      error: 'Some previous error',
    };
    const action = { type: 'STOP_RECORDING' as const };
    const nextState = sessionReducer(state, action);
    expect(nextState.status).toBe('processing');
    expect(nextState.error).toBeNull();
  });

  it('handles API_SUCCESS action and appends messages', () => {
    const state: SessionState = {
      ...initialState,
      status: 'processing',
      messages: [],
    };
    
    const userMessage: Message = { id: 'u1', role: 'user', text: 'Hello' };
    const tutorMessage: Message = { id: 't1', role: 'tutor', text: 'Hi there' };
    
    const action = { 
      type: 'API_SUCCESS' as const, 
      userMessage, 
      tutorMessage 
    };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.status).toBe('playing');
    expect(nextState.messages).toEqual([userMessage, tutorMessage]);
    expect(nextState.error).toBeNull();
    expect(nextState.audioPaused).toBe(false);
  });

  it('handles API_ERROR action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'processing',
    };
    const action = { type: 'API_ERROR' as const, error: 'Failed request' };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.status).toBe('error');
    expect(nextState.error).toBe('Failed request');
  });

  it('handles AUDIO_PLAYING action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'playing',
      audioPaused: true,
    };
    const action = { type: 'AUDIO_PLAYING' as const };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.status).toBe('playing');
    expect(nextState.audioPaused).toBe(false);
  });

  it('handles AUDIO_PAUSED action', () => {
    const state: SessionState = {
      ...initialState,
      audioPaused: false,
    };
    const action = { type: 'AUDIO_PAUSED' as const };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.audioPaused).toBe(true);
  });

  it('handles AUDIO_ENDED action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'playing',
      audioPaused: true,
    };
    const action = { type: 'AUDIO_ENDED' as const };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.status).toBe('idle');
    expect(nextState.audioPaused).toBe(false);
  });

  it('handles TOGGLE_CORRECTIONS action', () => {
    const state: SessionState = {
      ...initialState,
      showCorrections: true,
    };
    const action = { type: 'TOGGLE_CORRECTIONS' as const };
    
    let nextState = sessionReducer(state, action);
    expect(nextState.showCorrections).toBe(false);
    
    nextState = sessionReducer(nextState, action);
    expect(nextState.showCorrections).toBe(true);
  });

  it('handles RESET_ERROR action', () => {
    const state: SessionState = {
      ...initialState,
      status: 'error',
      error: 'Some error message',
    };
    const action = { type: 'RESET_ERROR' as const };
    const nextState = sessionReducer(state, action);
    
    expect(nextState.status).toBe('idle');
    expect(nextState.error).toBeNull();
  });
});
