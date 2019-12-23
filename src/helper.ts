export const isEmptyArray = (a: any): boolean => Array.isArray(a) && a.length === 0
export const isSingleElemArray = (a: any): boolean => Array.isArray(a) && a.length === 1
export const log = (...a: (string | number)[]) => console.log(...a) 