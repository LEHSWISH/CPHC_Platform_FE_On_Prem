/**
 * Validation Rules and Schemas
 * 
 * This file contains validation rules and schemas for form fields used in the application.
 * It defines functions to validate usernames, passwords, and other form fields, and sets up
 * validation schemas using Yup for form data validation. These rules and schemas ensure 
 * data integrity and provide meaningful error messages to users.
 */


import { TFunction } from 'i18next'
import * as Yup from 'yup'

const usernameValidationRules = {
    length: (username: string) => username.length >= 5 && username.length <= 20,
    alphabet: (username: string) => /[A-Za-z]/.test(username),
    number: (username: string) => /\d/.test(username),
    noSpace: (username: string) => !/\s/.test(username),
    noSpecialChar: (username: string) =>
        !/[!@#$%^&*(),.?":{}|<>_]/.test(username),
}

export const validateUsername = (username: string) => {
    return {
        length: usernameValidationRules.length(username),
        alphabet: usernameValidationRules.alphabet(username),
        number: usernameValidationRules.number(username),
        noSpace: usernameValidationRules.noSpace(username),
        noSpecialChar: usernameValidationRules.noSpecialChar(username),
    }
}

const passwordValidationRules = {
    length: (password: string) => password.length >= 8,
    upperCase: (password: string) => /[A-Z]/.test(password),
    lowerCase: (password: string) => /[a-z]/.test(password),
    number: (password: string) => /\d/.test(password),
    specialChar: (password: string) => /[!@#$%^&*(),.?":{}|<>_]/.test(password),
}

export const validatePassword = (password: string) => {
    return {
        length: passwordValidationRules.length(password),
        upperCase: passwordValidationRules.upperCase(password),
        lowerCase: passwordValidationRules.lowerCase(password),
        number: passwordValidationRules.number(password),
        specialChar: passwordValidationRules.specialChar(password),
    }
}

export const validateConfirmPassword = (
    password: string,
    confirmpassword: string,
) => {
    return {
        equal: password === confirmpassword,
    }
}

export const createAbhaFormSchema = ({ t }: { t: TFunction }) =>
    Yup.object().shape({
        aadharNumber: Yup.string()
            .length(12, t('common_error_messages.invalid-aadhar-length'))
            .required(t('common_error_messages.required-aadhar')),
        phoneNumber: Yup.string()
            .length(10, t('common_error_messages.invalid-phone-length'))
            .required(t('common_error_messages.required-phone-number')),
    })

export const linkAbhaFormSchema = ({ t }: { t: TFunction }) =>
    Yup.object().shape({
        abhaId: Yup.string()
            .length(14, t('common_error_messages.invalid-abha-length'))
            .required(t('common_error_messages.required-abha')),
    })


export const createAbhaViaTourismIdvalidationSchema = Yup.object({
    tourismPortalId: Yup.string().required(
        'Please enter your tourism portal id',
    ),
})

export const uploadDetailsFormvalidationSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select a document type'),
    hospitalLabName: Yup.string().required('Please enter Hospital/Lab name'),
    visitPurpose: Yup.string().required('Please enter Visit Purpose'),
    consent: Yup.bool().oneOf([true], 'Please share your consent'),
})

export const careRequestFormvalidationSchema = Yup.object().shape({
    userNameOrPhoneNumber: Yup.string().required(
        'Please enter a valid Username/Phone number.',
    ),
    consent: Yup.bool().oneOf([true], 'Please provide your consent'),
})