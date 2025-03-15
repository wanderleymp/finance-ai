// src/hooks/index.ts
var useLocalStorage = (key, initialValue) => {
};

// src/validators/index.ts
var isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
var isValidPassword = (password) => {
  return password.length >= 8;
};
export {
  isValidEmail,
  isValidPassword,
  useLocalStorage
};
