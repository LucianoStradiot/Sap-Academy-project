sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  function (Controller, MessageToast) {
    "use strict";
    var that;

    return Controller.extend("aca20241q.controller.Luthiers", {
      onInit: function () {
        that = this;
      },

      createLuthier: function (oEvent) {
        if (!this.oCreateFragment) {
          this.oCreateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.AddLuthier",
            controller: that,
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              let oBody = new sap.ui.model.json.JSONModel({
                "IdLuthier": "",
                "Nombre": "",
                "Apellido": "",
                "Localidad": "",
                "TipoInstrumento": "",
                "Descripción": "",
              });
              oBody.setDefaultBindingMode("TwoWay");
              oDialog.setModel(oBody, "CreateLuthier");
              oDialog.attachAfterClose(that._afterCloseDialog);
              return oDialog;
            }.bind(that)
          );
        }
        that.oCreateFragment.then(
          function (oDialog) {
            oDialog.open();
          }.bind(that)
        );
      },

      _afterCloseDialog: function (oEvent) {
        oEvent.getSource().destroy();
        that.oCreateFragment = null;
      },

      onCreateLuthierPress: function (oEvent) {
        // llamada al odata:
        let oEntry = oEvent.getSource().getModel("CreateLuthier").getData();
        var oDataModel = that.getView().getModel();
        oDataModel.create("/LuthiersSet", oEntry, {
          success: function (oResponse) {
            var result = oResponse?.results;
            sap.m.MessageBox.success(
              "Se generó una nueva entrada en los equipos"
            );
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseLuthierPress();
          },
          error: function (oError) {
            // manejar excepción del servicio
            sap.m.MessageBox.error(
              "Se generó un error al intentar crear un nuevo equipo"
            );
          },
        });
      },
      onCloseLuthierPress: function (oEvent) {
        that.oCreateFragment.then(
          function (oDialog) {
            oDialog.close();
          }.bind(that)
        );
      },
    });
  }
);
