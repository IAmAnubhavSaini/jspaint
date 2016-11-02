var getLogger = function(givenLogger) {
  /* givenLogger MUST have log, info and error methods */
  var logger;
  if(!givenLogger && console && console.log) {
    logger = {
      info: console.info.bind(console),
      error: console.error.bind(console),
      log: console.log.bind(console)
    };
  } else {
    logger = givenLogger;
  }
  return logger;
};

var logger = getLogger();
logger.log('logger initialized in logging.js');
logger.log('Exiting logging.js');
