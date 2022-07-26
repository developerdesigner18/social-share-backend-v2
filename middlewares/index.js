import bodyParser from 'body-parser'
import helmet from 'helmet'

const setGlobalMiddleware = app => {
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.text({ type: "application/x-ndjson" }));
  app.use(helmet());
  app.use(helmet.xssFilter())
  app.disable("x-powered-by");

  const sixtyDaysInSeconds = 5184000;
  app.use(
    helmet.hsts({
      maxAge: sixtyDaysInSeconds
    })
  );
};

export default setGlobalMiddleware;
