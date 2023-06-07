import { Request } from "express";
function jwtExtractorFromCookie(req: Request) {
  if (req.signedCookies.authToken === undefined) {
    return null;
  }

  return req.signedCookies.authToken;
}

export { jwtExtractorFromCookie };
