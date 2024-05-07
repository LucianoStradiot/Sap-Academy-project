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
                expand: "ToInstrumentoSet",
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

      createInstrumento: function (oEvent) {
        oEvent.getParameter("selected");
        var precio = parseInt(oEvent.getParameter("selected"));
        if (!this.oCreateFragment) {
          this.oCreateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.AddInstrumento",
            controller: that,
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              let oBody = new sap.ui.model.json.JSONModel({
                IdLuthier: "",
                NombreInstrumento: "",
                TipoInstrumento: "",
                AnioFabricacion: "",
                PrecioInstrumento: "",
                Descripcion: "",
              });
              oBody.setDefaultBindingMode("TwoWay");
              oDialog.setModel(oBody, "CreateInstrumento");
              oDialog.attachAfterClose(that._afterCloseDialog);
              return oDialog;
            }.bind(that)
          );
        }
        if (this.oCreateFragment) {
          this.oCreateFragment.then(
            function (oDialog) {
              oDialog.open();
            }.bind(that)
          );
        }
      },

      _afterCloseDialog: function (oEvent) {
        oEvent.getSource().destroy();
        that.oCreateFragment = null;
      },

      onCreateInstrumentoPress: function (oEvent) {
        let oEntry = oEvent.getSource().getModel("CreateInstrumento").getData();
        var oDataModel = that.getView().getModel();
        console.log(oEntry);
        oDataModel.create("/InstrumentoSet", oEntry, {
          success: function (oResponse) {
            var result = oResponse?.results;
            sap.m.MessageBox.success("Instrumento creado");
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseInstrumentoPress();
          },
          error: function () {
            sap.m.MessageBox.error(
              "Error al intentar crear un nuevo instrumento"
            );
          },
        });
      },

      onCloseInstrumentoPress: function (oEvent) {
        this.oCreateFragment.then(
          function (oDialog) {
            console.log(oDialog);
            oDialog.close();
          }.bind(that)
        );
      },

      updateLuthier: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var oLuthier = oContext.getObject();

        if (!this.oUpdateFragment) {
          this.oUpdateFragment = sap.ui.xmlfragment(
            "aca20241q.view.fragments.UpdateLuthier",
            this
          );
          this.getView().addDependent(this.oUpdateFragment);
        }

        this.oUpdateFragment.setModel(
          new sap.ui.model.json.JSONModel(oLuthier),
          "UpdateLuthier"
        );
        this.oUpdateFragment.open();
      },

      _afterCloseUpdateDialog: function (oEvent) {
        this.oUpdateFragment
          .then(function (oDialog) {
            oDialog.destroy();
          })
          .catch(function (error) {
            console.error(
              "Error al destruir el diálogo de actualización:",
              error
            );
          });
        this.oUpdateFragment = null;
      },

      onUpdateLuthierPress: function (oEvent) {
        var oDialog = oEvent.getSource().getParent();
        console.log(oDialog);
        var oLuthierModel = oDialog.getModel("UpdateLuthier");
        console.log(oLuthierModel);
        debugger;
        if (oLuthierModel) {
          var oLuthier = oLuthierModel.getData();
          var oContext = oEvent.getSource().getBindingContext();

          var oDataModel = this.getView().getModel();
          oDataModel.update(`${oContext.getPath()}`, oLuthier, {
            success: function (oResponse) {
              sap.m.MessageBox.success("Luthier actualizado correctamente");
              oDataModel.refresh(true, true);
              oDialog.close();
            },
            error: function (oError) {
              sap.m.MessageBox.error("Error al actualizar el luthier");
            },
          });
        } else {
          sap.m.MessageBox.error("No se pudo obtener el modelo del luthier");
        }
      },

      onCloseUpdateLuthierPress: function () {
        var oDialog = oEvent.getSource().getParent();
        oDialog.close();
      },

      deleteLuthier: function (oEvent) {
        var sPath = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath();

        sap.m.MessageBox.confirm(
          "¿Estás seguro de que quieres eliminar el Luthier?",
          {
            title: "Confirmación",
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                var oDataModel = oEvent.getSource().getModel();
                if (oDataModel) {
                  oDataModel.remove(`${sPath}`, {
                    success: function (oResponse) {
                      sap.m.MessageBox.success(
                        "Se eliminó correctamente el Luthier"
                      );
                      oDataModel.refresh(true, true);
                    },
                    error: function (oError) {
                      sap.m.MessageBox.error("Error al eliminar el luthier");
                    },
                  });
                } else {
                  sap.m.MessageBox.error(
                    "No se pudo obtener el modelo de datos"
                  );
                }
              }
            },
          }
        );
      },
    });
  }
);
