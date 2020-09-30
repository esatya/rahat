const getAllKeys = (obj, prefix = '') => Object.keys(obj).reduce((res, el) => {
  if (Array.isArray(obj[el])) {
    return res;
  } if (typeof obj[el] === 'object' && obj[el] !== null) {
    return [...res, ...getAllKeys(obj[el], `${prefix + el}.`)];
  }
  return [...res, prefix + el];
}, []);

const getAllValues = (obj, prefix = '') => Object.keys(obj).reduce((res, el) => {
  if (Array.isArray(obj[el])) {
    return res;
  } if (typeof obj[el] === 'object' && obj[el] !== null) {
    return [...res, ...getAllValues(obj[el], obj[`${prefix + el}.`])];
  }
  return [...res, obj[prefix + el]];
}, []);

module.exports = {
  getAllKeys, getAllValues,
};
