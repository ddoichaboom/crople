export const initialState = {
  products: {
    location: '',
    title: '',
    price: '',
    status: '',
  },
  accommodation: {
    location: '',
    price: '',
    start_date: '',
    end_date: '',
    details: '',
    disabled: true,
  },
  tutoring: {
    location: '',
    subject: '',
    price_per_hour: '',
    availability: '',
    disabled: true,
  },
};

// 액션 타입 정의
export const ActionTypes = {
  SET_PRODUCT_LOCATION: 'SET_PRODUCT_LOCATION',
  SET_PRODUCT_TITLE: 'SET_PRODUCT_TITLE',
  SET_PRODUCT_PRICE: 'SET_PRODUCT_PRICE',
  SET_PRODUCT_STATUS: 'SET_PRODUCT_STATUS',

  SET_ACCOMMO_LOCATION: 'SET_ACCOMMO_LOCATION',
  SET_ACCOMMO_PRICE: 'SET_ACCOMMO_PRICE',
  SET_ACCOMMO_AVAILABLE_DATES: 'SET_ACCOMMO_AVAILABLE_DATES',
  SET_ACCOMMO_DETAILS: 'SET_ACCOMMO_DETAILS',
  UPDATE_ACCOMMO_DISABLED: 'UPDATE_ACCOMMO_DISABLED',

  SET_TUTORING_LOCATION: 'SET_TUTORING_LOCATION',
  SET_TUTORING_SUBJECT: 'SET_TUTORING_SUBJECT',
  SET_TUTORING_PRICE: 'SET_TUTORING_PRICE',
  SET_TUTORING_AVAILABILITY: 'SET_TUTORING_AVAILABILITY',
  UPDATE_TUTORING_DISABLED: 'UPDATE_TUTORING_DISABLED',
};

// 리듀서
export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PRODUCT_LOCATION:
      return {
        ...state,
        products: { ...state.products, location: action.payload },
      };
    case ActionTypes.SET_PRODUCT_TITLE:
      return {
        ...state,
        products: { ...state.products, title: action.payload },
      };
    case ActionTypes.SET_PRODUCT_PRICE:
      return {
        ...state,
        products: { ...state.products, price: action.payload },
      };
    case ActionTypes.SET_PRODUCT_STATUS:
      return {
        ...state,
        products: { ...state.products, status: action.payload },
      };

    case ActionTypes.SET_ACCOMMO_LOCATION:
      return {
        ...state,
        accommodation: { ...state.accommodation, location: action.payload },
      };
    case ActionTypes.SET_ACCOMMO_PRICE:
      return {
        ...state,
        accommodation: {
          ...state.accommodation,
          price: action.payload,
        },
      };
    case ActionTypes.SET_ACCOMMO_AVAILABLE_DATES:
      return {
        ...state,
        accommodation: {
          ...state.accommodation,
          available_dates: action.payload, // available_dates는 start_date와 end_date로 나누어야 할 것
        },
      };
    case ActionTypes.SET_ACCOMMO_DETAILS:
      return {
        ...state,
        accommodation: { ...state.accommodation, details: action.payload },
      };
    case ActionTypes.UPDATE_ACCOMMO_DISABLED:
      return {
        ...state,
        accommodation: { ...state.accommodation, disabled: action.payload },
      };

    case ActionTypes.SET_TUTORING_LOCATION:
      return {
        ...state,
        tutoring: { ...state.tutoring, location: action.payload },
      };
    case ActionTypes.SET_TUTORING_SUBJECT:
      return {
        ...state,
        tutoring: { ...state.tutoring, subject: action.payload },
      };
    case ActionTypes.SET_TUTORING_PRICE:
      return {
        ...state,
        tutoring: { ...state.tutoring, price: action.payload },
      };
    case ActionTypes.SET_TUTORING_AVAILABILITY:
      return {
        ...state,
        tutoring: { ...state.tutoring, availability: action.payload },
      };
    case ActionTypes.UPDATE_TUTORING_DISABLED:
      return {
        ...state,
        tutoring: { ...state.tutoring, disabled: action.payload },
      };

    default:
      return state; // 기본 상태를 반환
  }
};
