import { useTheme } from "@mui/material";
import { useMatches } from "@remix-run/react";
import { type SessionData } from "~/session";

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
  if (!key.startsWith('_'))
    formData.append(key, obj[key])
  return formData
}, new FormData())

export const useAuth = () => {
  const {userInfo, token} = useMatches()[0].data as SessionData
  return {userInfo, token}
}

export const useTypographyStyles = () => {
  const theme = useTheme()
  const nestedRules = {
    '& > h1': {...theme.typography.h1, margin: 0},
    '& > h2': {...theme.typography.h2, margin: 0},
    '& > h3': {...theme.typography.h3, margin: 0},
    '& > h4': {...theme.typography.h4, margin: 0},
    '& > h5': {...theme.typography.h5, margin: 0},
    '& > h6': {...theme.typography.h6, margin: 0},
    '& > p': {...theme.typography.body1, margin: 0}
  };

  return nestedRules
};