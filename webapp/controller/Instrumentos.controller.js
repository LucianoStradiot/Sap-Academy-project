sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("aca20241q.controller.Instrumentos", {
    onInit: function () {
      sap.ui.core.UIComponent.getRouterFor(this);
    },

    handleNav: function (oEvent) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var sKey = oEvent.getParameter("key");
      oRouter.navTo(sKey);
    },
  });
});
