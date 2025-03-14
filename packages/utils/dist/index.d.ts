declare const useLocalStorage: (key: string, initialValue: any) => void;

declare const isValidEmail: (email: string) => boolean;
declare const isValidPassword: (password: string) => boolean;

export { isValidEmail, isValidPassword, useLocalStorage };
