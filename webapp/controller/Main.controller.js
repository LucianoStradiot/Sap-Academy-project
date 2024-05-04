sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView"],
  function (Controller, XMLView) {
    "use strict";

    return Controller.extend("aca20241q.controller.Main", {
      onInit: function () {
        sap.ui.core.UIComponent.getRouterFor(this);
      },

      handleNav: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var sKey = oEvent.getParameter("key");
        oRouter.navTo(sKey);
      },
    });
  }
);
