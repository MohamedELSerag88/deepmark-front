export const PHONE_PATTERN_VALIDATOR = {
  value: /^(\+?\d{1,2})?\(?\d{3}\)?\d{3}\d{4}$/,
  errorMessage:
    " invalid phone number format e.g. +000000000000 or 0000000000 ",
};

export const EMAIL_PATTERN_VALIDATOR = {
  value:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  errorMessage: "please type a valid email address",
};
export const POSITIVE_NUMBER_PATTERN_VALIDATOR = {
  value: 1,
  errorMessage: "this field must hold positive value",
};

export const LETTER_PATTERN_VALIDATOR = {
  value: /^[\w\s/',.&!@()#]*$/,
  errorMessage: "this field accepts only letters",
};
export const TITLE_PATTERN_VALIDATOR = {
  value: /^[a-zA-Z\s/'.]*$/,
  errorMessage: "this field accepts only letters",
};
export const LETTER_NUMBER_PATTERN_VALIDATOR = {
  value: /^[\w\s/',.&!@()#]*$/,
  errorMessage: "this field accepts only letters",
};
export const REGISTERATION_CODE_PATTERN_VALIDATOR = {
  value: /^[0-9]{4,}$/,
  errorMessage: "this field accepts only minimum of 4 digits ",
};
export const ADDRESS_PATTERN_VALIDATOR = {
  value: /^[A-Za-z0-9'\.\-\s\,]*$/,
  errorMessage: "this field has invalid address format",
};
export const POSITIVE_FLOAT_NUMBER_PATTERN = {
  value: /^(?=.+)(?:[1-9]\d{0,6}|0)?(?:\.\d+)?$/,
  errorMessage: "this must be a positive number with at most 7 digits",
};

export const POSITIVE_INTERGER_PATTERN = {
  value: /^([1-9][0-9]{0,6})$/,
  errorMessage: "field should have only digtis with at most 7 digits",
};
export const DATE_PATTERN = {
  value: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
  errorMessage: "please add a valid date",
};
