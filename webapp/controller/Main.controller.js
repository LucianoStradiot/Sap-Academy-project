sap.ui.define(
  ["sap/ui/core/mvc/Controller", "./BaseController"],
  function (BaseController, Controller) {
    "use strict";
    var that;

    return BaseController.extend("aca20241q.controller.Main", {
      onInit: function () {
        that = this;
      },

      handleNav: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        var sKey = oEvent.getParameter("key");
        oRouter.navTo(sKey);
      },
    });
  }
);
