﻿module DarkReader.Popup {

    export class PopupWindow extends xp.Window {
        constructor(ext: Extension) {
            super({ title: 'Dark Reader settings', scope: ext }, [

                //
                // ---- Logo ----

                new xp.Html({ html: '<img id="logo" src="img/dark-reader-type.svg" alt="Dark Reader" />', flex: 'none' }),

                //
                // ---- Top section ----

                new xp.HBox({ name: 'topSection', itemsAlign: 'top', flex: 'none' }, [
                    // new xp.Label({
                    //     name: 'appDescription',
                    //     style: 'description',
                    //     text: 'Adjust settings that\nbetter fit your screen'
                    // }),
                    new xp.VBox({ flex: 'stretch', style: 'controlContainer siteToggleContainer' }, [
                        new xp.Button({
                            name: 'siteToggle',
                            onClick: () => {
                                ext.toggleCurrentSite();
                            },
                            init: (btn) => this.initSiteToggleButton(btn, ext)
                        }),
                        new HotkeyLink({
                            commandName: 'addSite',
                            noHotkeyText: 'setup current site\ntoggle hotkey',
                            hotkeyTextTemplate: 'toggle current site\n#HOTKEY',
                            style: 'status'
                        })
                    ]),
                    new xp.VBox({ flex: 'stretch', style: 'controlContainer' }, [
                        new Toggle({
                            value: '{enabled}'
                        }),
                        new HotkeyLink({
                            commandName: 'toggle',
                            noHotkeyText: 'setup extension\ntoggle hotkey',
                            hotkeyTextTemplate: 'toggle extension\n#HOTKEY',
                            style: 'status'
                        })
                    ])
                ]),

                //
                // ---- Tab panel ----

                new TabPanel({ onTabSwitched: (t) => t.tabName === 'Site list' && this.siteList.focus(), flex: 'stretch', enabled: '{enabled}' }, [

                    //
                    // ---- Filter ----

                    new Tab({ tabName: 'Filter', itemsAlign: 'stretch' }, [
                        // Mode
                        new xp.VBox({ name: 'modeToggle', style: 'controlContainer' }, [
                            new xp.HBox({ style: 'line' }, [
                                new xp.ToggleButton({
                                    style: 'iconButton',
                                    icon: '.darkMode',
                                    item: 1/*FilterMode.dark*/,
                                    selectedItem: '{config.mode}'
                                }),
                                new Toggle({
                                    value: '{config.mode}',
                                    valueOn: 1,
                                    valueOff: 0,
                                    labelOn: 'Dark',
                                    labelOff: 'Light',
                                    flex: 'stretch'
                                }),
                                new xp.ToggleButton({
                                    style: 'iconButton',
                                    icon: '.lightMode',
                                    item: 0/*FilterMode.light*/,
                                    selectedItem: '{config.mode}'
                                })
                            ]),
                            new xp.Label({ style: 'status', text: 'Mode' })
                        ]),

                        // Brightness
                        new UpDown({
                            label: 'Brightness',
                            step: 0.1,
                            value: '{config.brightness}',
                            setterConvertor: (v: number) => (v - 50) / 100,
                            getterConvertor: (v: number) => Math.round(v * 100) + 50,
                            statusCreator: (v: number) => v > 100 ?
                                '+' + (v - 100)
                                : v < 100 ?
                                    '-' + (100 - v)
                                    : 'off'
                        }),

                        // Contrast
                        new UpDown({
                            label: 'Contrast',
                            step: 0.1,
                            value: '{config.contrast}',
                            setterConvertor: (v: number) => (v - 50) / 100,
                            getterConvertor: (v: number) => Math.round(v * 100) + 50,
                            statusCreator: (v: number) => v > 100 ?
                                '+' + (v - 100)
                                : v < 100 ?
                                    '-' + (100 - v)
                                    : 'off'
                        }),

                        // Grayscale
                        new UpDown({
                            label: 'Grayscale',
                            step: 0.1,
                            value: '{config.grayscale}',
                            setterConvertor: (v: number) => v / 100,
                            getterConvertor: (v: number) => Math.round(v * 100),
                            statusCreator: (v: number) => v > 0 ?
                                '+' + v
                                : 'off'
                        }),

                        // Sepia
                        new UpDown({
                            label: 'Sepia',
                            step: 0.1,
                            value: '{config.sepia}',
                            setterConvertor: (v: number) => v / 100,
                            getterConvertor: (v: number) => Math.round(v * 100),
                            statusCreator: (v: number) => v > 0 ?
                                '+' + v
                                : 'off'
                        }),
                    ]),
                    
                    //
                    // ---- Font ----

                    new Tab({ tabName: 'Font' }, [
                        // Select font
                        new xp.VBox({ style: 'controlContainer' }, [
                            new xp.HBox({ style: 'line' }, [
                                new xp.CheckBox({
                                    checked: '{config.useFont}'
                                }),
                                new FontSelect({
                                    fonts: '{fonts}',
                                    selectedFont: '{config.fontFamily}',
                                    flex: 'stretch',
                                }),
                            ]),
                            new xp.Label({ style: 'status', text: 'Select a font' })
                        ]),

                        // Text stroke
                        new UpDown({
                            label: 'Text stroke',
                            step: 0.1,
                            value: '{config.textStroke}',
                            //setterConvertor: (v: number) => (v - 50) / 100,
                            getterConvertor: (v: number) => Math.round(v * 10) / 10,
                            statusCreator: (v: number) => v > 0 ?
                                '+' + v
                                : v === 0 ?
                                    'off'
                                    : 'Wrong value'
                        })
                    ]),

                    //
                    // ---- Site list ----

                    new Tab({ tabName: 'Site list' }, [
                        new Toggle({
                            value: '{config.invertListed}',
                            labelOn: 'Invert listed only',
                            labelOff: 'Not invert listed',
                            flex: 'none'
                        }),
                        new xp.VBox({ flex: 'stretch', scrollBar: 'vertical', style: 'siteListParent' }, [
                            new SiteList({
                                sites: '{config.siteList}',
                                init: (sl) => this.siteList = sl
                            }),

                            new HotkeyLink({
                                commandName: 'addSite',
                                noHotkeyText: 'setup a hotkey for adding site',
                                hotkeyTextTemplate: 'hotkey for adding site: #HOTKEY',
                                style: 'description'
                            })
                        ])
                    ])

                ]),
                
                //
                // ---- Title ----

                new xp.Html({
                    flex: 'none',
                    html: `
                    <p class="description">Some things should not be inverted?
                        Please, send a website address at
                        <strong>darkReaderApp@gmail.com</strong></p>
                    `
                }),
            ]);
        }

        private siteList: SiteList;

        protected getTemplate() {
            // Clear body
            while (document.body.lastElementChild) {
                document.body.removeChild(
                    document.body.lastElementChild);
            }
            return super.getTemplate();
        }

        private initSiteToggleButton(btn: xp.Button, ext: Extension) {
            ext.getCurrentTabInfo((info) => {
                // NOTE: Disable button if toggle has no effect.
                var toggleHasEffect = () => {
                    return (!info.isChromePage
                        && !(!ext.config.invertListed
                            && info.isInDarkList));
                };
                btn.enabled = ext.enabled && toggleHasEffect();
                ext.onPropertyChanged.addHandler((prop) => {
                    if (prop === 'enabled') {
                        btn.enabled = ext.enabled && toggleHasEffect();
                    }
                });
                ext.config.onPropertyChanged.addHandler((prop) => {
                    if (prop === 'invertListed') {
                        btn.enabled = ext.enabled && toggleHasEffect();
                    }
                });

                // Set button text
                if (info.host) {
                    // HACK: Try to break URLs at dots.
                    btn.text = '*';
                    (<HTMLElement>btn.domElement.querySelector('.text')).innerHTML = '<wbr>' + info.host.replace(/\./g, '<wbr>.');
                } else {
                    btn.text = 'current site';
                }
            });
        }
    }
} 