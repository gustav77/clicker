import {ActionReducer, Action} from '@ngrx/store';
export const mediaStatus: ActionReducer<number> = (state: number = 0, action: Action) => {
  switch (action.type) {
    case 'SET_MEDIA_STATUS':
      return action.payload;
    default:
      return state;
  }
};
