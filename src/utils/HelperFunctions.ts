/**
 * Helper Functions
 * 
 * This file contains utility functions that assist with common tasks such as converting
 * Base64 strings to files, triggering file downloads from links and date difference in hours, in days, etc.
 * These functions are used throughout the application to simplify and standardize file handling operations.
 */


import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
export function dateDiffInHours(a: Date, b: Date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    const differenceMilliseconds = Math.abs(utc2 - utc1)

    const durationDays = Math.ceil(differenceMilliseconds / millisecondsPerDay)
    return durationDays
}

export function dateDiffInDays(a: Date, b: Date) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    const differenceMilliseconds = Math.abs(utc2 - utc1)

    const durationDays = Math.ceil(differenceMilliseconds / millisecondsPerDay)
    return durationDays + 1
}

export const downloadFileFromLink = (
    fileName: string,
    downloadLink: string,
) => {
    const link = document.createElement('a')
    link.download = fileName
    link.target = '_blank"'
    link.href = downloadLink
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const downloadByFileObject = (file: File) => {
    const blobUrl = URL.createObjectURL(file)
    downloadFileFromLink(file.name, blobUrl)
}

export const formatSecondToMSS = (s: number) =>
    Math.trunc((s - (s %= 60)) / 60) + (9 < s ? ':' : ':0') + Math.trunc(s)

export const convertFiletoBase64String = (file: File) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
    })

export const extractBase64Data = (fileBase64String: string) => {
    return fileBase64String.split(',')[1];
}

export function convertAadharCardNumber(data: string) {
    // key and iv values should be  same as present in backend
    const key = CryptoJS.enc.Latin1.parse('Wishfoundation24')
    const iv = CryptoJS.enc.Latin1.parse('Wishfoundation95')
    const encryptedAadharNumber = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    })
    return encryptedAadharNumber
}

export function encryptPassword(data: string) {
    // key and iv values should be  same as present in backend
    const key = CryptoJS.enc.Latin1.parse('v#N/R1V]5z1Nb%|7')
    const iv = CryptoJS.enc.Latin1.parse('aN[6|3s-O29x_n:c')
        const encryptedPassword = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.ZeroPadding,
        })
        return encryptedPassword
    
    
}

export function decryptUsername(encryptedData: string) {
    // key and iv values should be same as present in the backend
    const key = CryptoJS.enc.Latin1.parse('Wishfoundation24');
    const iv = CryptoJS.enc.Latin1.parse('Wishfoundation95');

    // Decrypt the encrypted data using AES
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    });

    // Convert the decrypted bytes to plaintext
    const decryptedUsername = decryptedBytes.toString(CryptoJS.enc.Utf8);

    return decryptedUsername;
}

export function generateUUID() {
    return uuidv4().toString()
}
/**
     * This method is used to convert base64 string to file.
     * @param data is base64 string which needs to be converted in file.
     * @param fileName is name of the file.
     */
export const convertBase64ToFile = (data: any, fileName: string, contentType: string) => {
    try {
        const fileType = contentType;
        const fileData = atob(data);
        let n = fileData.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = fileData.charCodeAt(n);
        }
        const file = new File([u8arr], fileName, { type: fileType });
        downloadByFileObject(file);
    } catch (error) {
        console.error(error)
    }

}
/**
     * This method is used to convert base64 string to file.
     * @param data is base64 string which needs to be converted in file.
     * @param fileName is name of the file.
     */
export const convertBase64ToImage = (data: any, fileName: string, contentType: string) => {
    const fileType = contentType;
    const fileData = atob(data);
    let n = fileData.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = fileData.charCodeAt(n);
    }
    const file = new File([u8arr], fileName, { type: fileType });
    const blobUrl = URL.createObjectURL(file)
    return blobUrl
}

export const downloadByBlobObject = (blob: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(blob)
    downloadFileFromLink(fileName, blobUrl)
}

// should contain contentType within base64 string
export const downloadBase64StringAsFile = (
    base64: string,
    fileName: string
) => {
    fetch(base64)
        .then(response => response.blob())
        .then(blob => {
            downloadByBlobObject(blob, fileName)
        })
}
export const calculateAgeFromDateOfBirth = (dob: string) => {
    const formattedDate = dob.split('/').reverse().join('-')
    const birthDate = new Date(formattedDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
