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
        var precio = parseFloat(oEvent.getParameter("selected"));
        if (!this.oCreateFragment) {
          this.oCreateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.AddInstrumento",
            controller: that,
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              let oBody = new sap.ui.model.json.JSONModel({
                NombreInstrumento: "",
                TipoInstrumento: "",
                AnioFabricacion: "",
                PrecioInstrumento: precio,
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
        oEntry.IdLuthier = this.getView()
          .getBindingContext()
          .getObject().IdLuthier;
        oDataModel.create("/InstrumentoSet", oEntry, {
          success: function (oResponse) {
            var result = oResponse?.results;
            sap.m.MessageBox.success(
              `${oEntry.NombreInstrumento} ha sido creado correctamente.`,
              {
                title: "Éxito!",
              }
            );
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseInstrumentoPress();
          },
          error: function (oError) {
            sap.m.MessageBox.error(`Los campos no pueden estar vacíos.`);
          },
        });
      },

      onCloseInstrumentoPress: function (oEvent) {
        this.oCreateFragment.then(
          function (oDialog) {
            oDialog.close();
          }.bind(that)
        );
      },

      updateInstrumento: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext();
        var oInstrumento = oContext.getObject();

        if (!this.oUpdateFragment) {
          this.oUpdateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.UpdateInstrumento",
            controller: that,
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              var oUpdateModel = new sap.ui.model.json.JSONModel(oInstrumento);
              oDialog.setModel(oUpdateModel, "UpdateInstrumento");
              oDialog.attachAfterClose(that._afterCloseUpdateDialog);
              return oDialog;
            }.bind(that)
          );
        }
        if (this.oUpdateFragment) {
          this.oUpdateFragment.then(
            function (oDialog) {
              oDialog.open();
            }.bind(that)
          );
        }
      },

      _afterCloseUpdateDialog: function (oEvent) {
        oEvent.getSource().destroy();
        that.oUpdateFragment = null;
      },

      onUpdateInstrumentoPress: function (oEvent) {
        var oEntry = oEvent
          .getSource()
          .getParent()
          .getModel("UpdateInstrumento")
          .getData();
        var sIdInstrumento = oEntry.IdInstrumento;
        var sIdLuthier = oEntry.IdLuthier;
        var oDataModel = that.getView().getModel();

        oDataModel.update(
          `/InstrumentoSet(IdInstrumento='${sIdInstrumento}',IdLuthier='${sIdLuthier}')`,
          oEntry,
          {
            success: function (oResponse) {
              sap.m.MessageBox.success(
                `${oEntry.NombreInstrumento} actualizado correctamente.`,
                {
                  title: "Éxito!",
                }
              );
              that.getOwnerComponent().getModel().refresh(true, true);
              that.onCloseUpdateInstrumentoPress();
            },
            error: function (oError) {
              sap.m.MessageBox.error(
                `Error al actualizar ${oEntry.NombreInstrumento}.`
              );
            },
          }
        );
      },

      onCloseUpdateInstrumentoPress: function () {
        this.oUpdateFragment.then(
          function (oDialog) {
            oDialog.close();
          }.bind(that)
        );
      },

      deleteInstrumento: function (oEvent) {
        var sPath = oEvent.getSource().getBindingContext().getPath();
        var oDataModel = oEvent.getSource().getModel();
        var sInstrumentoNombre = oDataModel.getProperty(
          sPath + "/NombreInstrumento"
        );
        sap.m.MessageBox.confirm(
          `¿Estás seguro que querés eliminar ${sInstrumentoNombre}?`,
          {
            title: "Advertencia!",
            icon: sap.m.MessageBox.Icon.WARNING,
            onClose: function (oAction) {
              if (oAction === sap.m.MessageBox.Action.OK) {
                if (oDataModel) {
                  oDataModel.remove(`${sPath}`, {
                    success: function (oResponse) {
                      sap.m.MessageBox.success(
                        `${sInstrumentoNombre} se eliminó correctamente `,
                        {
                          title: "Éxito!",
                        }
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

      onLiveChange: function (oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();
        var iMaxDigits = 4;
        if (sValue && sValue.toString().length > iMaxDigits) {
          var sTruncatedValue = sValue.toString().slice(0, iMaxDigits);
          oInput.setValue(sTruncatedValue);
        }
      },

      onSearch: function (oEvent) {
        var aFilters = [],
          sNombreInstrumento,
          sTipoInstrumento,
          sAnioFabricacion,
          sPrecioInstrumento;
        var aSelectionSet = oEvent.getParameter("selectionSet");
        aSelectionSet.forEach((x) => {
          switch (x.getName()) {
            case "NombreInstrumento":
              sNombreInstrumento = x.getValue();
              break;
            case "TipoInstrumento":
              sTipoInstrumento = x.getValue();
              break;
            case "AnioFabricacion":
              sAnioFabricacion = x.getValue();
              break;
            case "PrecioInstrumento":
              sPrecioInstrumento = x.getValue();
              break;
            default:
          }
        });
        if (sNombreInstrumento) {
          let oFilterNombreInstrumento = new sap.ui.model.Filter({
            path: "NombreInstrumento",
            operator: "EQ",
            value1: sNombreInstrumento,
          });
          aFilters.push(oFilterNombreInstrumento);
        }
        if (sTipoInstrumento) {
          let oFilterTipoInstrumento = new sap.ui.model.Filter({
            path: "TipoInstrumento",
            operator: "EQ",
            value1: sTipoInstrumento,
          });
          aFilters.push(oFilterTipoInstrumento);
        }
        if (sAnioFabricacion) {
          let oFilterAnioFabricacion = new sap.ui.model.Filter({
            path: "AnioFabricacion",
            operator: "EQ",
            value1: sAnioFabricacion,
          });
          aFilters.push(oFilterAnioFabricacion);
        }
        if (sPrecioInstrumento) {
          let oFilterPrecioInstrumento = new sap.ui.model.Filter({
            path: "PrecioInstrumento",
            operator: "EQ",
            value1: sPrecioInstrumento,
          });
          aFilters.push(oFilterPrecioInstrumento);
        }

        this.getView()
          .byId("idInstrumentosTable")
          .getBinding("items")
          .filter(aFilters);
      },
    });
  }
);
