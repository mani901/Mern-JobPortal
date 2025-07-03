import { useState } from "react";

const usePost = (requestFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestFunction(payload);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export default usePost;
