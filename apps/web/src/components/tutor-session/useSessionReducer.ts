'use client';

import { useReducer } from 'react';
import { Message } from '../conversation-pane/ConversationPaneContainer';

export type SessionStatus = 'idle' | 'recording' | 'processing' | 'playing' | 'error';

export interface SessionState {
  status: SessionStatus;
  messages: Message[];
  showCorrections: boolean;
  error: string | null;
  audioPaused: boolean;
}

export type SessionAction =
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING' }
  | { 
      type: 'API_SUCCESS'; 
      userMessage: Message; 
      tutorMessage: Message;
    }
  | { type: 'API_ERROR'; error: string }
  | { type: 'AUDIO_PLAYING' }
  | { type: 'AUDIO_PAUSED' }
  | { type: 'AUDIO_ENDED' }
  | { type: 'TOGGLE_CORRECTIONS' }
  | { type: 'RESET_ERROR' };

export const initialState: SessionState = {
  status: 'idle',
  messages: [],
  showCorrections: true,
  error: null,
  audioPaused: false,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START_RECORDING':
      return {
        ...state,
        status: 'recording',
        error: null,
      };
    case 'STOP_RECORDING':
      return {
        ...state,
        status: 'processing',
        error: null,
      };
    case 'API_SUCCESS':
      return {
        ...state,
        status: 'playing',
        messages: [...state.messages, action.userMessage, action.tutorMessage],
        error: null,
        audioPaused: false,
      };
    case 'API_ERROR':
      return {
        ...state,
        status: 'error',
        error: action.error,
      };
    case 'AUDIO_PLAYING':
      return {
        ...state,
        status: 'playing',
        audioPaused: false,
      };
    case 'AUDIO_PAUSED':
      return {
        ...state,
        audioPaused: true,
      };
    case 'AUDIO_ENDED':
      return {
        ...state,
        status: 'idle',
        audioPaused: false,
      };
    case 'TOGGLE_CORRECTIONS':
      return {
        ...state,
        showCorrections: !state.showCorrections,
      };
    case 'RESET_ERROR':
      return {
        ...state,
        status: 'idle',
        error: null,
      };
    default:
      return state;
  }
}

export function useSessionReducer() {
  return useReducer(sessionReducer, initialState);
}
