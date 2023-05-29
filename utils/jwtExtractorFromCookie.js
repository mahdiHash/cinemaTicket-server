function jwtExtractorFromCookie(req) {
  if (!req.signedCookies?.authToken) {
    return null;
  }
  
  return req.signedCookies.authToken;
}

module.exports = jwtExtractorFromCookie;
