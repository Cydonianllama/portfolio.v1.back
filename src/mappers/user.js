export const ToUserDTO = (user) => {
  return {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    creationDate: user.creationDate
  };
}