sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("aca20241q.controller.LuthierDetail", {
    onInit: function () {
      that = this;
      var oRouter = this.getRouter();
      oRouter
        .getRoute("LuthierDetail")
        .attachPatternMatched(this._onPatternMatched, this);
    },
    _onPatternMatched: function (oEvent) {
      var sLuthier = oEvent.getParameter("arguments").idLuthier;
      let oModel = this.getOwnerComponent().getModel();
      oModel.metadataLoaded().then(
        function () {
          this.getView().bindElement({
            path: `/LuthiersSet('${sLuthier}')`,
            events: {
              change: this._oBindingChange.bind(this),
              dataRequested: function () {
                that.getView().setBusy(true);
              },
              dataReceived: function () {
                that.getView().setBusy(false);
              },
            },
          });
        }.bind(this)
      );
    },

    _oBindingChange: function (oEvent) {
      debugger;
    },
  });
});
