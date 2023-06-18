import {
  getAllCelebrities,
  getAllCreditCardReqs,
  getAllPlaceRegisters,
} from './';

type validQueries = getAllCelebrities 
  | getAllCreditCardReqs
  | getAllPlaceRegisters;

export { validQueries };
