sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/mvc/XMLView"],
  function (Controller, XMLView) {
    "use strict";

    return Controller.extend("aca20241q.controller.Main", {
      onInit: function () {
        this.loadHomeView();
      },

      handleTabHeader: function (oEvent) {
        var sSelectedTabKey = oEvent.getParameter("key");
        var oContentArea = this.getView().byId("contentArea");
        oContentArea.destroyItems();

        switch (sSelectedTabKey) {
          case "Home":
            this.loadHomeView();
            break;
          case "Luthiers":
            oContentArea.addItem(this.createView("aca20241q.view.Luthiers"));
            break;
          case "Instrumentos":
            oContentArea.addItem(
              this.createView("aca20241q.view.Instrumentos")
            );
            break;
          default:
            break;
        }
      },

      createView: function (sViewName) {
        var oView = sap.ui.xmlview({
          viewName: sViewName,
        });

        this.getView().addDependent(oView);
        return oView;
      },
      loadHomeView: function () {
        var oContentArea = this.getView().byId("contentArea");
        oContentArea.destroyItems();
        oContentArea.addItem(this.createView("aca20241q.view.Home"));
      },
    });
  }
);
