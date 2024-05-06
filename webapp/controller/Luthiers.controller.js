sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/XMLView",
  ],
  function (Controller, MessageToast) {
    "use strict";
    var that;

    return Controller.extend("aca20241q.controller.Luthiers", {
      onInit: function () {
        that = this;
        var gridList = this.getView().byId("gridList");
        var mode = gridList.getMode();
        if (mode === "SingleSelectMaster") {
          gridList.attachSelectionChange(this.onPressNavigation);
        }
      },

      handleNav: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        var sKey = oEvent.getParameter("key");
        oRouter.navTo(sKey);
      },

      onPressDelete: function (oEvent) {
        this.onModeChange(oEvent);
      },

      onModeChange: function (oEvent) {
        var oButton = this.byId("idDeleteButton2");
        var gridList = this.getView().byId("gridList");

        // Verifica el modo actual del GridList
        var currentMode = gridList.getMode();

        // Cambia al otro modo
        var newMode =
          currentMode === "SingleSelectMaster"
            ? "Delete"
            : "SingleSelectMaster";

        // Establece el nuevo modo
        gridList.setMode(newMode);

        // Si se cambió al modo "Delete", desvincula la función deleteLuthier del evento de selección
        if (newMode === "Delete") {
          gridList.detachSelectionChange(this.deleteLuthier);
        }
      },

      createLuthier: function (oEvent) {
        oEvent.getParameter("selected");
        if (!this.oCreateFragment) {
          this.oCreateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.AddLuthier",
            controller: that,
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              let oBody = new sap.ui.model.json.JSONModel({
                IdLuthier: "",
                Nombre: "",
                Apellido: "",
                Localidad: "",
                TipoInstrumento: "",
                Descripcion: "",
              });
              oBody.setDefaultBindingMode("TwoWay");
              oDialog.setModel(oBody, "CreateLuthier");
              oDialog.attachAfterClose(that._afterCloseDialog);
              return oDialog;
            }.bind(that)
          );
        }
        if (this.oCreateFragment) {
          this.oCreateFragment.then(
            function (oDialog) {
              console.log(oDialog);
              oDialog.open();
            }.bind(that)
          );
        }
      },

      _afterCloseDialog: function (oEvent) {
        oEvent.getSource().destroy();
        that.oCreateFragment = null;
      },

      onCreateLuthierPress: function (oEvent) {
        let oEntry = oEvent.getSource().getModel("CreateLuthier").getData();
        var oDataModel = that.getView().getModel();
        oDataModel.create("/LuthiersSet", oEntry, {
          success: function (oResponse) {
            var result = oResponse?.results;
            sap.m.MessageBox.success("Luthier creado");
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseLuthierPress();
          },
          error: function () {
            sap.m.MessageBox.error("Error al intentar crear un nuevo luthier");
          },
        });
      },

      onCloseLuthierPress: function (oEvent) {
        this.oCreateFragment.then(
          function (oDialog) {
            console.log(oDialog);
            oDialog.close();
          }.bind(that)
        );
      },

      updateLuthier: function (oEvent) {
        var oListItem = oEvent.getSource();
        var sPath = oListItem.getBindingContext().getPath();
        var oDataModel = oListItem.getModel();
        var oLuthier = oDataModel.getProperty(sPath);

        if (!this.oUpdateFragment) {
          this.oUpdateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.UpdateLuthier",
            controller: this,
          }).then(function (oDialog) {
            that.getView().addDependent(oDialog);
            var oModel = new sap.ui.model.json.JSONModel(oLuthier);
            oModel.setDefaultBindingMode("TwoWay");
            oDialog.setModel(oModel, "UpdateLuthier");
            oDialog.attachAfterClose(that._afterCloseUpdateDialog);
            console.log(oDialog);
            return oDialog;
          });
        }
        this.oUpdateFragment.then(function (oDialog) {
          oDialog.open();
        });
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
        let oEntry = oEvent.getSource().getModel("UpdateLuthier").getData();
        let oId = oEvent
          .getSource()
          .getBindingContext()
          .getProperty("IdLuthier");
        var oDataModel = that.getView().getModel();
        oDataModel.update(`/LuthiersSet('${oId}')`, oEntry, {
          success: function (oResponse) {
            var result = oResponse?.results;
            sap.m.MessageBox.success("Luthier actualizado correctamente");
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseLuthierPress();
          },
          error: function () {
            sap.m.MessageBox.error(
              "Error al intentar actualizar un nuevo luthier"
            );
          },
        });
      },

      onCloseUpdateLuthierPress: function () {
        this.oUpdateFragment.then(function (oDialog) {
          oDialog.close();
        });
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

      onPressNavigation: function (oEvent) {
        var oListItem = oEvent.getParameter("listItem");
        console.log(oListItem.getBindingContext());
        var sLuthier = oListItem.getBindingContext().getProperty("IdLuthier");
        var router = that.getOwnerComponent().getRouter();
        router.navTo("LuthiersDetail", {
          idLuthier: sLuthier,
        });
      },

      onSearch: function (oEvent) {
        var aFilters = [],
          sApellido,
          sLocalidad,
          sTipoInstrumento;
        var aSelectionSet = oEvent.getParameter("selectionSet");
        aSelectionSet.forEach((x) => {
          switch (x.getName()) {
            case "Apellido":
              sApellido = x.getValue();
              break;
            case "Localidad":
              sLocalidad = x.getValue();
              break;
            case "TipoInstrumento":
              sTipoInstrumento = x.getValue();
              break;
            default:
          }
        });
        if (sApellido) {
          let oFilterApellido = new sap.ui.model.Filter({
            path: "Apellido",
            operator: "EQ",
            value1: sApellido,
          });
          aFilters.push(oFilterApellido);
        }
        if (sLocalidad) {
          let oFilterLocalidad = new sap.ui.model.Filter({
            path: "Localidad",
            operator: "EQ",
            value1: sLocalidad,
          });
          aFilters.push(oFilterLocalidad);
        }
        if (sTipoInstrumento) {
          let oFilterTipoInstrumento = new sap.ui.model.Filter({
            path: "TipoInstrumento",
            operator: "EQ",
            value1: sTipoInstrumento,
          });
          aFilters.push(oFilterTipoInstrumento);
        }

        this.getView().byId("gridList").getBinding("items").filter(aFilters);
      },
    });
  }
);
