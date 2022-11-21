import { SEC_TIMEOUT } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // means that the data that will be sent would be in JSON format
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(SEC_TIMEOUT)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`Can't find the recipe (${data.message})`);

    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async url => {
  try {
    const fetchPromise = fetch(url);
    const res = await Promise.race([fetchPromise, timeout(SEC_TIMEOUT)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`Can't find the recipe (${data.message})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// Send the new recipe to the API
export const sendJSON = async (url, uploadData) => {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // means that the data that will be sent would be in JSON format
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPromise, timeout(SEC_TIMEOUT)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`Can't find the recipe (${data.message})`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
