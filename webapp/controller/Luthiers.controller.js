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
        var currentMode = gridList.getMode();
        var newMode =
          currentMode === "SingleSelectMaster"
            ? "Delete"
            : "SingleSelectMaster";
        gridList.setMode(newMode);
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
        let oEntry = oEvent.getSource().getModel("UpdateLuthier").getData();
        var oDataModel = that.getView().getModel();
        if (oDataModel) {
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
        if (this.oUpdateFragment) {
          this.oUpdateFragment.close();
        } else {
          console.error("Update fragment not found.");
        }
      },

      deleteLuthier: function (oEvent) {
        var sPath = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath();
        var oDataModel = oEvent.getSource().getModel();
        var oLuthier = oDataModel.getProperty(sPath);
        var sNombre = oLuthier.Nombre;
        var sApellido = oLuthier.Apellido;
        if (sNombre && sApellido) {
          var sAdminNombre = sNombre + " " + sApellido;

          sap.m.MessageBox.confirm(
            `¿Estás seguro que querés eliminar a ${sAdminNombre}?`,
            {
              title: "Confirmación",
              onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  if (oDataModel) {
                    oDataModel.remove(`${sPath}`, {
                      success: function (oResponse) {
                        sap.m.MessageBox.success(
                          `${sAdminNombre} se eliminó correctamente`
                        );
                        oDataModel.refresh(true, true);
                      },
                      error: function (oError) {
                        sap.m.MessageBox.error(
                          `Error al eliminar a ${sAdminNombre}`
                        );
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
        } else {
          sap.m.MessageBox.error(
            "No se pudo obtener el nombre y apellido del luthier"
          );
        }
      },

      onPressNavigation: function (oEvent) {
        var oListItem = oEvent.getParameter("listItem");
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
