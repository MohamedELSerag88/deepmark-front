export const getUserType = () => {
    const user = localStorage.getItem("auth");
    if (!user) return "buyer";
    const { user_type } = JSON.parse(user);
    return user_type;
  };
  export const getUser = () => {
    const user = localStorage.getItem("auth");
    if (!user) return null;
    return JSON.parse(user);
  };
  