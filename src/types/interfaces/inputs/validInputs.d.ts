import {
  loginInputs,
  signupInputs,
  userProfileUpdateInputs,
  resetPassInputs,
  createAdminInputs,
  adminProfileUpdateInputs,
  placeRegisterInputs,
  createCelebrityInputs,
  updateCelebrityInputs
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
  | updateCelebrityInputs;

export { validInputs };
