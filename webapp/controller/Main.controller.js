sap.ui.define(
  ["sap/ui/core/mvc/Controller", "./BaseController"],
  function (BaseController, Controller) {
    "use strict";
    var that;

    return BaseController.extend("aca20241q.controller.Main", {
      onInit: function () {
        that = this;
      },

      onForward: function (oEvent) {
        var oHistory = sap.ui.core.routing.History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
            window.history.go(-1);
        } else {
            this.getOwnerComponent().getRouter().navTo("Luthiers", {}, true /*no history*/);
        }
      },

      handleNav: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        var sKey = oEvent.getParameter("key");
        oRouter.navTo(sKey);
      },
    });
  }
);
