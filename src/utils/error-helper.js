export function getErrMessage(err, t) {
  // we meaybe wann use t later to create real good messages
  // so we keep it in the function for now

  if (err.isAxiosError) {
    console.log({ err });
    if (err.response) {
      return `${err.response.statusText} (${err.response.status})`;
    } else {
      return err.message;
    }
  } else {
    return err.message;
  }
}
