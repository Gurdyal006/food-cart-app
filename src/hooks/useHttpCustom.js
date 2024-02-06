import { useCallback, useEffect, useState } from "react";

// helper function
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
  const resData = await response.json();

  // check error
  if (!response.ok) {
    throw new Error(
      resData.message || "Something went wrong fething details.."
    );
  }

  return resData;
}

export default function useHttpCustom(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState();

  function clearData() {
    setData(initialData);
  }

  const sendRequest = useCallback(
    async function sendRequest(data) {
      setIsLoading(true);
      try {
        const resData = await sendHttpRequest(url, { ...config, body: data });
        setData(resData);
      } catch (error) {
        setError(error.message || "something wrong");
      }
      setIsLoading(false);
    },
    [url, config]
  );

  useEffect(() => {
    if ((config && (config.method === "GET" || !config.method)) || !config) {
      sendRequest();
    }
  }, [sendRequest]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData,
  };
}
