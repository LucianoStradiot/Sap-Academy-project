sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  var that;
  return Controller.extend("aca20241q.controller.Instrumentos", {
    onInit: function () {
      that = this;
    },

    handleNav: function (oEvent) {
      var oRouter = this.getOwnerComponent().getRouter();
      var sKey = oEvent.getParameter("key");
      oRouter.navTo(sKey);
    },
  });
});
