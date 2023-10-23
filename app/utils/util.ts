export const formToObj = (formData: FormData) => {
  var object: { [k: string]: any } = {};
  formData.forEach((value, key) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    object[key].push(value);
  });
  return object
};

export const objToForm = (obj: { [k: string]: any }) => Object.keys(obj).reduce((formData, key) => {
  formData.append(key, obj[key])
  return formData
}, new FormData())