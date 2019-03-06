const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const {table,id,fileIDs} = event
  try {
    return await db.collection(table).doc(id).update({
      data: {
        photoMediaPaths: _.push(fileIDs)
      }
    }) 
  } catch (e) {
    console.error(e)
  }
}