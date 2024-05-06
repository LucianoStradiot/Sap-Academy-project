sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";
    var that;
    return Controller.extend("aca20241q.controller.BaseController", {
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },
    });
  }
);
