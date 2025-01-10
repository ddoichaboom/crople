export const initSuggestForm = {
  location: '',
  price: '',
  start_date: 'YYYY-MM-DD HH:MM:SS',
  end_date: 'YYYY-MM-DD HH:MM:SS',
  details: '',
  isLoading: false,
  disabled: true,
};

export const SuggestFormTypes = {
  UPDATE_FORM: 'UPDATE_FORM',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  RESET: 'RESET',
};

export const SuggestFormReducer = (state, action) => {
  switch (action.type) {
    case SuggestFormTypes.UPDATE_FORM:
      return { ...state, ...action.payload };
    case SuggestFormTypes.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case SuggestFormTypes.RESET:
      return initSuggestForm;
    default:
      return state;
  }
};
