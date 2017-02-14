/*!
 * ${copyright}
 */
/*global jQuery, sap */
/**
 * Provides control sap.ushell.ui.shell.ShellAppTitle
 *
 * This control is responsible to display the Shell Header Title.
 * This control could be rendered in two different states:
 * 1. Title only: only the title will be rendered inside the Shell Header
 * 2. Title with popover button: A button will be placed in the Shell Header Title area.
 *    When the user clicks on the button, a popover will raise and render the innerControl as its content.
 *
 *    innerControl: the content of the popover. Will be destroyed by the ShellAppTitle control.
 */
sap.ui.define(['jquery.sap.global', 'sap/m/Button', 'sap/ui/core/IconPool', 'sap/ushell/library', './ShellNavigationMenu'],
    function (jQuery, Button, IconPool) {
        "use strict";

        var ShellAppTitle = Button.extend("sap.ushell.ui.shell.ShellAppTitle",
            {
                metadata: {
                    properties: {
                        text: {type : "string", group : "Misc", defaultValue : null},
                        tooltip: {type : "string", group : "Misc", defaultValue : null}
                    },
                    associations : {
                        navigationMenu: {type: "sap.ushell.ui.shell.ShellNavigationMenu"}
                    },
                    events: {
                        press: {},
                        textChanged : {}
                    }
                },

                renderer: {
                    render:  function (oRm, oControl) {

                        var sNavMenu = oControl.getNavigationMenu();
                        var sTitle = oControl.getText();
                        var bVisible = false;
                        if (sNavMenu) {
                            var oNavMenu = sap.ui.getCore().byId(sNavMenu);
                            bVisible = oNavMenu ? oNavMenu.getItems() && oNavMenu.getItems().length > 0 : false;
                            oControl.bIconVisible = bVisible;
                        }

                        // render the title
                        oRm.write('<div ');
                        oRm.writeControlData(oControl);
                        oRm.addClass("sapUshellShellAppTitleContainer sapUshellAppTitle");
                        if (bVisible) {
                            oRm.write('tabindex="0" ');
                            oRm.addClass("sapUshellAppTitleClickable");
                            oRm.writeAttributeEscaped("role", "button");
                            oRm.writeAttributeEscaped("aria-haspopup", "true");
                            oRm.writeAttributeEscaped("aria-expanded", "false");
                            oRm.writeAttributeEscaped("aria-label", sap.ushell.resources.i18n.getText("ShellNavigationMenu_AriaLabel", [sTitle]));
                        } else {
                            // remove the 'heading' role because JAWS has a known bug that when you use this role + tabindex=0
                            // it announces the word 'edit' at the end of the announcement:
                            // https://dequeuniversity.com/testsuite/aria/aria-describedby/results/heading
                            //oRm.writeAttributeEscaped("role", "heading");
                            oRm.writeAttributeEscaped("aria-label", sTitle);
                            oRm.writeAttributeEscaped("aria-haspopup", "false");
                        }
                        oRm.writeClasses();
                        oRm.write(">");

                        if (bVisible) {
                            oRm.write("<div ");
                            oRm.addClass("sapUshellShellHeadAction");
                            oRm.writeClasses();
                            oRm.write("><span class='sapUshellShellHeadActionImg sapUshellShellAppTitleHeadActionImg'>");
                            oRm.renderControl(oControl.oIcon);
                            oRm.write("</span>");
                            oRm.write("</div>");
                        }

                        oRm.write('<h1 class="sapUshellHeadTitle" aria-level="1">');
                        if (sTitle) {
                            oRm.writeEscaped(sTitle);
                        }
                        oRm.write("</h1>");

                        oRm.write("</div>");
                    }
                }
            });

        ShellAppTitle.prototype.init = function () {
            //call the parent sap.m.Button init method
            if (Button.prototype.init) {
                Button.prototype.init.apply(this, arguments);
            }

            this.oIcon = IconPool.createControlByURI(sap.ui.core.IconPool.getIconURI("slim-arrow-down"));
            this.oIcon.addStyleClass("sapUshellAppTitleMenuIcon");

            // only for desktop
            if (sap.ui.Device.system.desktop) {

                // add acc support for open menu
                this.addEventDelegate({
                    onkeydown: function (oEvent) {

                        // support for open the menu with Alt&Down arrow
                        if (oEvent.altKey && oEvent.keyCode == 40) {
                            oEvent.preventDefault();
                            this.onclick();
                        }
                    }.bind(this)
                });
            }

            this._bTextChanged = false;
        };

        ShellAppTitle.prototype.setText = function (sText) {
            this.setProperty("text",sText, false);
            this._bTextChanged = true;
        };

        ShellAppTitle.prototype.onAfterRendering = function () {
            if (this._bTextChanged) {
                this.fireTextChanged();
            }
            this._bTextChanged = false;
        };

        ShellAppTitle.prototype.onclick = function (oEvent) {

            // it may be that the Title was clicked on (and not the icon which opens the menu)
            // we need to make sure the icon is displayed (e.g. rendered) - in case not we do not
            // open the menu
            if (!this.bIconVisible) {
                return;
            }

            if (!this.oPopover) {

                this.oPopover = new sap.m.Popover("sapUshellAppTitlePopover", {
                    showHeader: false,
                    showArrow: true,
                    placement: sap.m.PlacementType.Bottom
                }).addStyleClass("sapUshellAppTitleNavigationMenuPopover");

                // This parameter will be 'true' if the click to close popover came from the ShellAppTitle
                this.bAppTitleClick = false;

                var oNavMenu = sap.ui.getCore().byId(this.getNavigationMenu());
                this.oPopover.addContent(oNavMenu);

                // before popover open - call to before menu open
                this.oPopover.attachBeforeOpen(function () {
                    oNavMenu._beforeOpen();
                });

                // after popover open - fix scrolling for IOS and call to menu after open
                this.oPopover.attachAfterOpen(function () {

                    // fix for scrolling (By @Alexander Pashkov) on sap.m.Popover being override
                    // in Mobile by UI5
                    this.oPopover.$().on("touchmove.scrollFix", function (e) {
                        e.stopPropagation();
                    });


                    // calls to afterOpen on the navigation menu itself in case some things needed to be made;
                    // initialize the keyboard navigation on the navigation menu only in case we
                    oNavMenu._afterOpen();

                    // adjusting aria-expanded property
                    this._adjustAccProperties(true);
                }.bind(this));

                this.oPopover.attachBeforeClose(function(event) {
                    // By using document.activeElement.id we can identify what is the element
                    // that the user clicked on in order to close the popover
                    // if he clicked on the shellAppTitle, the flag will turn to true
                    if (document.activeElement.id === this.getId()) {
                        this.bAppTitleClick = true;
                    }
                }.bind(this));

                this.oPopover.attachAfterClose(function(event) {
                    // adjusting aria-expanded property
                    this._adjustAccProperties(false);
                }.bind(this));
            }

            // desktop handling
            if (!sap.ui.Device.system.desktop) {
                if (this.oPopover.isOpen()) {
                    this.oPopover.close();
                } else {
                    this.oPopover.openBy(this);
                    this.firePress();
                }
            } else {
                // mobile & tablet handling
                if (!this.bAppTitleClick) {
                    this.oPopover.openBy(this);
                    this.firePress();
                } else {
                    this.bAppTitleClick = false;
                }
            }
        };

        // adjusting aria-expanded property
        ShellAppTitle.prototype._adjustAccProperties = function(bIsOpen) {
            var jqTitle = jQuery(this.getDomRef());
            var bIsOpen = !!bIsOpen;

            jqTitle.attr("aria-expanded", bIsOpen);
        };

        ShellAppTitle.prototype.close = function () {
            if (this.oPopover && this.oPopover.isOpen()) {
                this.oPopover.close();
            }
        };

        ShellAppTitle.prototype.setTooltip = function (sTooltip) {
            this.oIcon.setTooltip(sTooltip);
        };

        ShellAppTitle.prototype.onsapspace = ShellAppTitle.prototype.onclick;

        ShellAppTitle.prototype.onsapenter = ShellAppTitle.prototype.onclick;

        ShellAppTitle.prototype.exit = function () {

            var oNavMenu = sap.ui.getCore().byId(this.getNavigationMenu());
            if (oNavMenu) {
                oNavMenu.destroy();
            }
            if (this.oPopover) {
                this.oPopover.destroy();
            }
        };

        return ShellAppTitle;
    }, true);