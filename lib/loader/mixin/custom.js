'use strict';

const path = require('path');
const is = require('is-type-of');

module.exports = {

  /**
   * load app.js
   *
   * @example
   * ```js
   * module.exports = function(app) {
   *   // can do everything
   *   do();
   *
   *   // if you will invoke asynchronous, you can use readyCallback
   *   const done = app.readyCallback();
   *   doAsync(done);
   * }
   * ```
   * @since 1.0.0
   */
  loadCustomApp() {
    this.loadBootFile('app');
    this.lifecycle.triggerDidLoad();
  },

  /**
   * Load agent.js, same as {@link EggLoader#loadCustomApp}
   */
  loadCustomAgent() {
    this.loadBootFile('agent');
    this.lifecycle.triggerDidLoad();
  },

  loadBootFile(fileName) {
    this.timing.start(`Load ${fileName}.js`);
    const legacyAgentFiles = [];
    for (const unit of this.getLoadUnits()) {
      const bootFilePath = this.resolveModule(path.join(unit.path, fileName));
      if (!bootFilePath) {
        continue;
      }
      const bootFile = this.requireFile(bootFilePath);
      // if use boot class, add to lifecycle
      if (is.class(bootFile)) {
        this.lifecycle.addBootFile(bootFile);
      } else {
        legacyAgentFiles.push(bootFile);
      }
    }
    // init boots and trigger config did load
    this.lifecycle.init();
    this.lifecycle.triggerConfigDidLoad();
    // call app.js use legacy function
    for (const agentFile of legacyAgentFiles) {
      agentFile(this.app);
    }
    this.timing.end(`Load ${fileName}.js`);
  },
};
