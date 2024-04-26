sap.ui.define(
  ["sap/ui/core/mvc/Controller"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller) {
    "use strict";

    return Controller.extend("aca20241q.controller.Table", {
      onInit: function () {
        this.getLuthiers();
      },

      getLuthiers: async () => {
        try {
          const oModel = this.getOwnerComponent().getModel();
          oModel = await fetch("/LuthierSet", { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            alert(JSON.stringify(data.results));
          } else {
            throw new Error("Error en la solicitud");
          }
        } catch (error) {
          console.error(error);
        }
      },
    });
  }
);
