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
      },

      handleNav: function (oEvent) {
        var oRouter = this.getOwnerComponent().getRouter();
        var sKey = oEvent.getParameter("key");
        oRouter.navTo(sKey);
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

      deleteSelected: function () {
        var gridList = this.getView().byId("gridList");
        var selectedItems = gridList.getSelectedItems();

        if (selectedItems.length > 0) {
          var model = this.getView().getModel();
          selectedItems.forEach(function (item) {
            var context = item.getBindingContext();
            var path = context.getPath();
            model.remove(path);
          });
          gridList.removeSelections();
        } else {
          sap.m.MessageToast.show("Please select at least one item to delete.");
        }
      },

      deleteLuthier: function (oEvent) {
        let sPath = oEvent.getSource().getBindingContext().getPath();

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

      updateLuthier: function (oEvent) {
        // Obtener el índice del luthier seleccionado en la lista
        var sPath = oEvent.getSource().getBindingContext().getPath();

        // Obtener el modelo de datos
        var oDataModel = oEvent.getSource().getModel();

        // Obtener los datos del luthier seleccionado
        var oLuthier = oDataModel.getProperty(sPath);

        // Cargar el fragmento para la actualización del luthier
        if (!this.oUpdateFragment) {
          this.oUpdateFragment = sap.ui.core.Fragment.load({
            name: "aca20241q.view.fragments.UpdateLuthier",
            controller: that, // Asegúrate de que el controlador está accesible aquí
          }).then(
            function (oDialog) {
              that.getView().addDependent(oDialog);
              // Establecer el modelo con los datos del luthier seleccionado
              let oModel = new sap.ui.model.json.JSONModel(oLuthier);
              oModel.setDefaultBindingMode("TwoWay");
              oDialog.setModel(oModel, "UpdateLuthier");
              oDialog.attachAfterClose(that._afterCloseUpdateDialog);
              return oDialog;
            }.bind(that)
          );
        }

        // Abrir el fragmento de actualización
        this.oUpdateFragment.then(function (oDialog) {
          oDialog.open();
        });
      },

      onUpdateLuthierPress: function (oEvent) {
        // Obtener los datos actualizados del luthier del modelo
        let oUpdatedLuthier = oEvent
          .getSource()
          .getModel("UpdateLuthier")
          .getData();

        // Obtener el modelo de datos
        var oDataModel = that.getView().getModel();

        // Actualizar el luthier en el servidor
        oDataModel.update(oUpdatedLuthier.IdLuthier, oUpdatedLuthier, {
          success: function (oResponse) {
            sap.m.MessageBox.success("Luthier actualizado");
            that.getOwnerComponent().getModel().refresh(true, true);
            that.onCloseUpdateLuthierPress();
          },
          error: function () {
            sap.m.MessageBox.error("Error al intentar actualizar el luthier");
          },
        });
      },

      onCloseUpdateLuthierPress: function (oEvent) {
        // Cerrar el fragmento de actualización
        this.oUpdateFragment.then(function (oDialog) {
          oDialog.close();
        });
      },

      _afterCloseUpdateDialog: function (oEvent) {
        // Limpiar y destruir el fragmento de actualización
        oEvent.getSource().destroy();
        that.oUpdateFragment = null;
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

      /* onModeChange: function (oEvent) {
        var sMode = oEvent.getParameter("item").getKey();
        this.byId("gridList").setMode(sMode);
        this.byId("gridList").setHeaderText("GridList with mode " + sMode);
      },

      onSelectionChange: function (oEvent) {
        var bSelected = oEvent.getParameter("selected");
        MessageToast.show(
          (bSelected ? "Selected" : "Unselected") +
            " item with ID " +
            oEvent.getParameter("listItem").getId()
        );
      },

      onDelete: function (oEvent) {
        MessageToast.show(
          "Delete item with ID " + oEvent.getParameter("listItem").getId()
        );
      },

      onDetailPress: function (oEvent) {
        MessageToast.show(
          "Request details for item with ID " + oEvent.getSource().getId()
        );
      }, */
    });
  }
);
