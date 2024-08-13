/**
 * FHIR Bundle Helper Functions
 * 
 * This file contains utility functions that assist while working with FHIRBundle like
 * extracting attachment reference entries from response, extracting attachment by FhirBundleResponse, etc.
 */


/* eslint-disable @typescript-eslint/no-explicit-any */

const extractAttchmentReferenceEntriesFromResponse = (bundleInput: any) => {
    const allCompositions = bundleInput?.entry?.filter((entryItem: any) => {
        return entryItem?.resource?.resourceType === 'Composition'
    })

    const sectionList: any[] = []
    allCompositions?.forEach((composition: any) => {
        if (composition?.resource?.section) {
            composition?.resource?.section?.forEach((el: any) => {
                sectionList.push(el)
            })
        }
    })

    const referenceEntriesList: any[] = []
    sectionList?.forEach(section => {
        section?.entry?.forEach((entryItem: any) => {
            referenceEntriesList.push(entryItem)
        })
    })

    return referenceEntriesList
}

const extractDocumentReferenceAttachmentByReference = (
    input: any,
    sourceBundle: any,
) => {
    const ouputContent: FhirBundleDocumentReferenceAttachmentItemType[] = []
    input.forEach((el: any) => {
        sourceBundle?.entry?.forEach((entryItem: any) => {
            if (
                entryItem.resource?.resourceType === 'DocumentReference' &&
                entryItem?.fullUrl === el.reference
            ) {
                entryItem?.resource?.content?.forEach((content: any) => {
                    ouputContent.push(content?.attachment)
                })
            }
        })
    })
    return ouputContent as FhirBundleDocumentReferenceAttachmentItemType[]
}

const extractBinaryAttachmentByReference = (input: any, sourceBundle: any) => {
    const ouputContent: FhirBundleBinaryAttachmentItemType[] = []
    input.forEach((el: any) => {
        sourceBundle?.entry?.forEach((entryItem: any) => {
            if (
                entryItem.resource?.resourceType === 'Binary' &&
                entryItem?.fullUrl === el.reference
            ) {
                ouputContent.push(entryItem?.resource)
            }
        })
    })
    return ouputContent as FhirBundleBinaryAttachmentItemType[]
}

/**
 * Use this function directly by passing FHIR bundle json as argument
 * For reference please visit - https://nrces.in/ndhm/fhir/r4/index.html
 */
export const extractAttachmentByFhirBundleResponse = (input: any) => {
    const result: {
        documentReferenceAttachmentList: FhirBundleDocumentReferenceAttachmentItemType[]
        binaryAttachmentList: FhirBundleBinaryAttachmentItemType[]
    } = {
        documentReferenceAttachmentList: [],
        binaryAttachmentList: [],
    }

    let referenceEntriesList: any

    try {
        referenceEntriesList =
            extractAttchmentReferenceEntriesFromResponse(input)
    } catch (err) {
        console.error(err)
    }

    try {
        result.documentReferenceAttachmentList =
            extractDocumentReferenceAttachmentByReference(
                referenceEntriesList,
                input,
            )
    } catch (err) {
        console.error(err)
    }

    try {
        result.binaryAttachmentList = extractBinaryAttachmentByReference(
            referenceEntriesList,
            input,
        )
    } catch (err) {
        console.error(err)
    }

    return result
}

export interface FhirBundleDocumentReferenceAttachmentItemType {
    contentType: string
    language: string
    url?: string
    data?: string
    title?: string
    creation: string
    size?: number
    hash?: string
}

export interface FhirBundleBinaryAttachmentItemType {
    resourceType: 'Binary'
    id: string
    contentType: string
    securityContext?: {
        reference: string
    }
    data: string
}
