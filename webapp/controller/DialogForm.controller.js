sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    Fragment,
    syncStyleClass,
    JSONModel,
    Filter,
    FilterOperator,
    MessageToast
  ) {
    "use strict";

    return Controller.extend("aca20241q.controller.DialogForm", {
      onInit: function () {
        console.log("holis");
      },
    });
  }
);
