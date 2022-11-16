const User = require('../users/users-model')

module.exports = (req, res, next) => {
  if(req.body.username) {
  User.findByUsername(req.body.username).then(user => {
    if (!user) {
      next()
    } else {
      res.status(422).json({message: 'username taken'})
    }
  })
} else {
  next()
}
};
