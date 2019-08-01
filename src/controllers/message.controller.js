const uniq = require("lodash.uniq");
const Message = require("../models/message.model");

exports.findWith = (req, res, next) => {
  if (!req.params.userId)
    return res.status(400).json({ message: "Missing userId" });

  if (req.params.userId === req.user.id)
    return res
      .status(403)
      .json({ message: "You can't message yourself, don't be silly." });

  return Message.find({
    $or: [
      { from: req.params.userId, to: req.user.id },
      { from: req.user.id, to: req.params.userId }
    ]
  })
    .sort({ createdAt: 1 })
    .then(messages => {
      if (!messages || messages.length === 0)
        return res.status(404).json({ message: "Not found" });

      return res.json(messages);
    })
    .catch(e => next(e));
};

exports.sendTo = (req, res, next) => {
  if (req.body.to === req.user.id)
    return res
      .status(403)
      .json({ message: "You can't message yourself, don't be silly." });
  if (!req.body.to || !req.body.message)
    return res.status(400).json({
      message: 'Missing fields (please include "to" user ID & message'
    });
  const message = new Message({
    from: req.user.id,
    to: req.body.to,
    message: req.body.message
  });
  return message
    .save()
    .then(doc => res.json(doc))
    .catch(error => next(error));
};

exports.findContacts = async (req, res, next) => {
  let contacts = [];
  await Message.find({ to: req.user.id })
    .sort({ createdAt: "desc" })
    .distinct("from")
    // .populate("from")
    .then(result => {
      contacts.push(...result);
    })
    .catch(e => next(e));
  await Message.find({ from: req.user.id })
    .sort({ createdAt: "desc" })
    .distinct("to")
    // .populate("to")
    .then(result => {
      contacts.push(...result);
    })
    .catch(e => next(e));

  // Convert Mongo ObjectIDS to strings to apply lodash uniq on it.
  contacts = contacts.map(id => id.toHexString());

  // Distinct is not supported with populate so we have to call the user service manually and populate the contacts array.
  // We'll populate by making requests from the frontend
  // https://github.com/Automattic/mongoose/issues/1549

  res.json({ contacts: uniq(contacts) });
};
