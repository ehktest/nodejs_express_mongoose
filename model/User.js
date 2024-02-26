const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

// (name: string, schema?: mongoose.Schema<...> | undefined, collection?: string | undefined, options?: mongoose.CompileModelOptions | undefined)
module.exports = mongoose.model("User", userSchema);
// default olarak mongoose model'i olustururken name argumanina girilen string'i lower case ve plural yaparak database'de collection olusturur -> User icin database'de users collection'i olusur.
// https://mongoosejs.com/docs/models.html#compiling
