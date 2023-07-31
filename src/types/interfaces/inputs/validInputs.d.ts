import {
  loginInputs,
  signupInputs,
  userProfileUpdateInputs,
  resetPassInputs,
  createAdminInputs,
  adminProfileUpdateInputs,
  placeRegisterInputs,
  createCelebrityInputs,
  updateCelebrityInputs,
  adminLogin,
  submitCreditCard
} from './';

type validInputs =
  | loginInputs
  | signupInputs
  | userProfileUpdateInputs
  | resetPassInputs
  | createAdminInputs
  | adminProfileUpdateInputs
  | placeRegisterInputs
  | createCelebrityInputs
  | updateCelebrityInputs
  | adminLogin
  | submitCreditCard;

export { validInputs };
