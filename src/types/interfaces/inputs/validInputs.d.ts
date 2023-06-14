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
  | adminLogin;

export { validInputs };
