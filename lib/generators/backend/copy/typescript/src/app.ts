// const logger = require('dva-logger');

/**
 * config dva plugins & emitter
 * e.g.
 *  const logger = require('dva-logger');
 *  export const dva = {
 *      config: {
 *          onError(err: ErrorEvent) {
 *              err.preventDefault();
 *          },
 *      },
 *      plugins: [logger()],
 *  };
 */

export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
        },
    },
};
