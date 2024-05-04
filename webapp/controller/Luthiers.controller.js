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
        sap.ui.core.UIComponent.getRouterFor(this);
      },

      handleNav: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
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
        that.oCreateFragment.then(
          function (oDialog) {
            oDialog.open();
          }.bind(that)
        );
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
        that.oCreateFragment.then(
          function (oDialog) {
            oDialog.close();
          }.bind(that)
        );
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

      onPress: function (oEvent) {
        var oListItem = oEvent.getParameter("listItem");
        console.log("ListItem:", oListItem);
        var sLuthier = oListItem.getBindingContext().getProperty("IdLuthier");
        var router = that.getOwnerComponent().getRouter();
        router.navTo("LuthierDetail", {
          idLuthier: sLuthier,
        });
      },

      _afterCloseDialog: function (oEvent) {
        oEvent.getSource().destroy();
        that.oCreateFragment = null;
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
