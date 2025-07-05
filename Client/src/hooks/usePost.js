import { useState } from "react";

const usePost = (requestFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const execute = async (functionOrPayload) => {
    console.log("🔧 usePost: execute called with:", functionOrPayload);
    setLoading(true);
    setError(null);
    try {
      let res;
      // Check if the parameter is a function (new usage) or data (original usage)
      if (typeof functionOrPayload === 'function') {
        console.log("🔧 usePost: Executing function...");
        res = await functionOrPayload();
      } else if (requestFunction) {
        console.log("🔧 usePost: Using pre-configured request function...");
        res = await requestFunction(functionOrPayload);
      } else {
        throw new Error("No request function provided");
      }

      console.log("🔧 usePost: Response received:", res);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.log("🔧 usePost: Error occurred:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export default usePost;
