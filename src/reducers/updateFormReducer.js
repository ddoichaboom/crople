// reducers/updateFormReducer.js

export const initUpdateForm = {
  nickname: '',
  email: '',
  name: '',
  phonenumber: '',
  isLoading: false,
  disabled: true,
};

export const UpdateFormTypes = {
  UPDATE_FORM: 'UPDATE_FORM',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  RESET: 'RESET',
};

export const updateFormReducer = (state, action) => {
  switch (action.type) {
    case UpdateFormTypes.UPDATE_FORM:
      return { ...state, ...action.payload };
    case UpdateFormTypes.TOGGLE_LOADING:
      return { ...state, isLoading: !state.isLoading };
    case UpdateFormTypes.RESET:
      return initUpdateForm;
    default:
      return state;
  }
};
