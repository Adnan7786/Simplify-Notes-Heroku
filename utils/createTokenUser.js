const createTokenUser = (user) => {
  return {
    email: user.email,
    userId: user._id,
    role: user.role,
    currentDocID: user.currentDocID,
    googleRefreshToken: user.googleRefreshToken
  }
};

module.exports = createTokenUser