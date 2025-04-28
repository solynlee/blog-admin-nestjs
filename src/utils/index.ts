export function success(data: any, message: string = 'success') {
  return {
    code: 200,
    data,
    message,
  };
}

export function fail(message: string = 'fail') {
  return {
    code: -1,
    message,
  };
}

export function wrapperResponse(P: Promise<any>, message: string) {
  return P.then((res) => {
    return success(res, message);
  }).catch((err) => {
    return fail(err.message);
  });
}
