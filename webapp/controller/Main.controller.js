sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";
  var that;
  var homeLoaded = false;
  var luthiersTableLoaded = false;
  var instrumentosLoaded = false;
  return Controller.extend("aca20241q.controller.Main", {
    onInit: function () {
      that = this;
    },

    handleTabHeader: function (oEvent) {
      let key = oEvent.getParameter("key");

      if (key === "Home") {
        if (!homeLoaded) {
          console.log("home");
          this.loadAndShowFragment("aca20241q.view.fragments.Home");
          homeLoaded = true;
        }
        this.showFragment("pageHome");
      } else if (key === "LuthiersTable") {
        if (!luthiersTableLoaded) {
          console.log("luthier");
          this.loadAndShowFragment("aca20241q.view.fragments.LuthiersTable");
          luthiersTableLoaded = true;
        }
        this.showFragment("pageLuthiersTable");
        console.log("luthiershow");
      } else if (key === "Instrumentos") {
        if (!instrumentosLoaded) {
          console.log("instrumentos");
          this.loadAndShowFragment("aca20241q.view.fragments.Instrumentos");
          instrumentosLoaded = true;
        }
        this.showFragment("pageInstrumentos");
      }
    },

    loadAndShowFragment: function (fragmentName) {
      return new Promise(function (resolve, reject) {
        console.log("Cargando fragmento:", fragmentName);
        sap.ui.core.Fragment.load({
          name: fragmentName,
          controller: that,
        })
          .then(function (oFragment) {
            that.getView().addDependent(oFragment);
            console.log(
              "Fragmento cargado y agregado como dependiente:",
              oFragment
            );
            resolve(oFragment);
          })
          .catch(function (error) {
            reject(error);
          });
      });
    },

    showFragment: function (fragmentId) {
      var oNavCon = that.byId("navContainer");
      var oFragment = that.byId(fragmentId); //Llama al id de la page dentro del main
      console.log("Intentando mostrar fragmento:", fragmentId);
      console.log("oNavCon:", oNavCon);
      console.log("oFragment:", oFragment);
      oNavCon.to(oFragment);
      console.log("Navegación completada");
    },
  });
});
