import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'
import appConfig from "./config";
import colors from 'colors'

mongoose.Promise = global.Promise;
mongoose.plugin(timestamps);

export const connect = (config = appConfig) => {
  mongoose.set("useCreateIndex", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.connect(
    appConfig.db.url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  ).then(() => { console.log("DB CONNECTED".yellow.bold) })
    .catch((err) => { console.log(`ERROR ::: ${err}`.red.bold) }
    )
};
