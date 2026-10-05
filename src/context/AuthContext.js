import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children
}) => {

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {

      return JSON.parse(savedUser);

    } catch {

      return null;

    }

  });


  const [token, setToken] = useState(() => {

    return (
      localStorage.getItem("token") ||
      null
    );

  });


  const loginUser = (
    userData,
    jwtToken
  ) => {

    setUser(userData);

    setToken(jwtToken);


    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      jwtToken
    );


    const id =
      userData?._id ||
      userData?.id ||
      userData?.userId;


    if (id) {

      localStorage.setItem(
        "userId",
        id
      );

    }

  };


  const logoutUser = () => {

    setUser(null);

    setToken(null);


    localStorage.removeItem("user");

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("user_id");

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        token,

        isLoggedIn:
          !!user && !!token,

        loginUser,
        logoutUser
      }}
    >

      {children}

    </AuthContext.Provider>

  );
};


export const useAuth = () => {

  return useContext(
    AuthContext
  );

};


export default AuthContext;