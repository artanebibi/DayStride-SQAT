export const setAuthenticatedUser = () => {
  localStorage.setItem("tokens", "dummy-token");
};

export const clearAuth = () => {
  localStorage.removeItem("tokens");
};
