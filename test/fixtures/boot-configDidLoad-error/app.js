'use strict';

const sleep = require('mz-modules/sleep');

module.exports = app => {
  return class extends app.Boot {
    constructor() {
      super();
      app.bootLog = [];
    }

    configDidLoad() {
      throw new Error('configDidLoad error');
    }

    async didLoad() {
      await sleep(1);
      app.bootLog.push('didLoad');
    }

    async willReady() {
      await sleep(1);
      app.bootLog.push('willReady');
    }

    async didReady() {
      await sleep(1);
      app.bootLog.push('didReady');
    }

    async beforeClose() {
      await sleep(1);
      app.bootLog.push('beforeClose');
    }
  }
};
