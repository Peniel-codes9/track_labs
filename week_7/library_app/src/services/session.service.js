// Session documents aren't a Mongoose model — connect-mongo writes them
// directly to a plain collection. Still, every database touch belongs in
// services/, so this wraps that access the same way book.service.js and
// user.service.js do.
const mongoose = require("mongoose");

function collection() {
  return mongoose.connection.collection("sessions");
}

async function listForUser(userId, currentSessionId) {
  const docs = await collection().find({ "session.userId": userId }).toArray();
  return docs.map(function (doc) {
    return { id: doc._id, current: doc._id === currentSessionId, expires: doc.expires };
  });
}

async function revokeOthers(userId, currentSessionId) {
  await collection().deleteMany({ "session.userId": userId, _id: { $ne: currentSessionId } });
}

module.exports = { listForUser, revokeOthers };
