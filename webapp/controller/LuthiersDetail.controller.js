sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "./BaseController",
  ],
  function (BaseController, History) {
    "use strict";
    var that;
    return BaseController.extend("aca20241q.controller.LuthiersDetail", {
      onInit: function () {
        that = this;
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("LuthiersDetail")
          .attachPatternMatched(this._onPatternMatched, this);
      },
      _onPatternMatched: function (oEvent) {
        var sLuthier = oEvent.getParameter("arguments").idLuthier;
        var oModel = this.getOwnerComponent().getModel();
        oModel.metadataLoaded().then(
          function () {
            var sPath = `/LuthiersSet('${sLuthier}')`;
            this.getView().bindElement({
              path: sPath,
              parameters: {
                expand: "ToInstrumentoSet", // Expandir la relación con los instrumentos
              },
              events: {
                dataRequested: function () {
                  that.getView().setBusy(true);
                },
                dataReceived: function () {
                  that.getView().setBusy(false);
                  var oLuthier = this.getView().getBindingContext().getObject();
                  oLuthier.ToInstrumentoSet.results;
                }.bind(this),
              },
            });
          }.bind(this)
        );
      },

      onBack: function (oEvent) {
        var oHistory, sPreviousHash;
        oEvent.getParameter("selected");
        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getOwnerComponent()
            .getRouter()
            .navTo("Luthiers", {}, true /*no history*/);
        }
      },
    });
  }
);
