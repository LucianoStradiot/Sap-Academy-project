sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    var that;
    var homeLoaded = false;
    var luthiersTableLoaded = false;
    var instrumentosLoaded = false;
    return Controller.extend("aca20241q.controller.Main", {
        onInit: function () {
            that = this;
        },

        handleTabHeader:  function (oEvent) {
            let key = oEvent.getParameter("key");

            if (key === "Home") {
                if (!homeLoaded) {
                    console.log('home');
                     this.loadAndShowFragment("aca20241q.view.fragments.Home");
                    homeLoaded = true;
                }
                this.showFragment("Home");
            } else if (key === "LuthiersTable") {
                if (!luthiersTableLoaded) {
                    console.log('luthier');
                     this.loadAndShowFragment("aca20241q.view.fragments.LuthiersTable");
                    luthiersTableLoaded = true;
                }
               this.showFragment("LuthiersTable");
                console.log('luthiershow');
            } /* else if (key === "Instrumentos") {
                if (!instrumentosLoaded) {
                    console.log('instrumentos');
                     this.loadAndShowFragment("aca20241q.view.fragments.Instrumentos");
                    instrumentosLoaded = true;
                }
                this.showFragment("Instrumentos");
            } */
        },

        loadAndShowFragment:  function (fragmentName) {
            return new Promise(function (resolve, reject) {
                sap.ui.core.Fragment.load({
                    name: fragmentName,
                    controller: that
                }).then(function () {
                    that.getView().addDependent();
                    resolve();
                    console.log(fragmentName);
                }).catch(function (error) {
                    reject(error);
                });
            });
        },

        showFragment: function (fragmentId) {
            var oNavCon = that.byId("navContainer");
            var oFragment = that.byId(fragmentId);
            console.log("oNavCon:", oNavCon);
            console.log("oFragment:", oFragment);
            oNavCon.removeAllPages();
            oNavCon.to(oFragment);
            console.log('navegacion');
            return
        }
    });
});
