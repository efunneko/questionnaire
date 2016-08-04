// use strict;

(function (ctx, $, questionData, undefined) {

    ctx.main = function() {

        ///////////////
        // Data members
        ///////////////

        // Reference to the codenet-canvas object
        this.state = {};

        this.builtinTypes = {
            text: {
                type: "text"
            },
            inputBar: {
                type: "inputBar"
            },
            checkbox: {
                type: "checkbox"
            },
            numentry: {
                type: "numentry"
            },
            stackedNumentry: {
                type: "stackedNumentry"
            },
            inputBarLarge: {
                type: "inputBar",
                className: "input-bar-large"
            },
            inputBarSmall: {
                type: "inputBar",
                className: "input-bar-small"
            },
            ypn: {
                type: "radio",
                options: [
                    {
                        text: "Yes",
                        pointMult: 1,
                    },
                    {
                        text: "No",
                        pointMult: 0,
                    },
                ],
            },
            ypnm: {
                type: "radio",
                options: [
                    {
                        text: "Yes",
                        pointMult: 1,
                    },
                    {
                        text: "No",
                        pointMult: -1,
                    },
                ],
            },
            yn: {
                type: "radio",
                options: [
                    {
                        text: "Yes",
                    },
                    {
                        text: "No",
                    },
                ],
            },

        };

        // Initialize 
        this.init = function (options) {
            var self = this;
            $.createHtml("configure", {installParentFunctions: true});

            History.Adapter.bind(window,'statechange',
                                 function() {
                                     var state = History.getState(); 
                                     console.log("history state: ", state);
                                     self.gotoPage(state.data);
                                 });

            self.focusedElement = null;
            $(document).on('focus', 'input', function () {
                if (self.focusedElement == this) return; 
                self.focusedElement = this;
                setTimeout(function () { 
                    self.focusedElement.select(); 
                }, 0); 
            });


            this.start(options);
        };

        // Start the whole process
        this.start = function(options) {
            this.data  = options.data;
            this.id    = options.id;
            this.uniquifyNames(this.data.items, {});
            this.state = {
                templateVars: {},
                answers:      {},
                radioSeq:     0,
                itemStack:    [],
                itemState: {
                    i: 0,
                    items: options.data.items,
                    group: {
                        $el: $('#' + options.id)
                    }
                }
            };

            // Put one more group on the end as the last marker
            this.data.items.push({
                type: "group",
                lastGroup: true
            });
            
            var savedState = localStorage.getItem("questionState");
            if (savedState) {
                savedState = JSON.parse(savedState);
                console.log(savedState);
                this.state.answers = savedState.answers;
                this.state.templateVars = savedState.templateVars;
            }

            var group = this.data.items[0];
            group.firstGroup = true;
            History.pushState({name: group.name}, group.heading, "?page="+group.name);
        };


        this.gotoPage = function(data) {
            if (!data.name) {
                console.error("Missing name in history state");
            }
            
            var pageInfo = this.findPage(this.data.items, data.name);

            if (!pageInfo) {
                console.error("Failed to find page name");
            }

            console.log("Found page: ", pageInfo);
            
            this.clearPage();
            this.state.pageGroup = pageInfo.items[pageInfo.index];
            this.state.prevGroup = data.prevGroup;
            this.state.itemState = {i: pageInfo.index, 
                                    items: pageInfo.items,
                                    group: {
                                        $el: $('#' + this.id).html("")
                                    }
                                   };
            this.processItems();

        }


        this.findPage = function(items, pageName) {
            var self = this;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.type == "group") {
                    if (item.name == pageName) {
                        return {items: items, index: i};
                    }
                    var page = self.findPage(item.items, pageName);
                    if (page) {
                        return page;
                    }
                }
                
            }

            return null;
        };

        this.clearPage = function() {
            $('#' + this.id).html("");
            this.pageStart = true;
        };

        this.uniquifyNames = function(items, names) {
            var self = this;
            $.each(items, function(i, val) {
                var name = val.name;
                if (names[name]) {
                    var i = 2;
                    while(true) {
                        if (!names[name+i]) {
                            name = name+"-"+i;
                            val.name = name;
                            break;
                        }
                        i++;
                    }
                }
                names[name] = true;
                if (val.type == "group") {
                    self.uniquifyNames(val.items, names);
                }
                else if (val.type == "checkbox") {
                    self.uniquifyNames(val.options, names);
                }
            });
        }

        // Go through all the items in the list and handle them
        this.processItems = function() {
            var self = this;
            //console.log("itemStack", this.state.itemStack);

            while(true) {
                // console.log("Current state:", this.state.itemState, this.state.itemState.group.$el);

                if (this.state.itemState.i >= this.state.itemState.items.length) {
                    while (this.state.itemStack.length > 0) {
                        this.state.itemState = this.state.itemStack.pop();
                        if (this.state.itemState.i < this.state.itemState.items.length) {
                            break;
                        }
                        else if (this.state.itemStack.length == 0) {
                            return;
                        }
                    }
                }

                var item = this.state.itemState.items[this.state.itemState.i];
                this.state.itemState.i++;

                var haveAnswer = typeof(this.state.answers[item.name]) != "undefined";

                if (item.type == "group") {
                    var rc = self.addGroup(item, self.pageStart);
                    if (rc.stop) {
                        return;
                    }
                }
                else {
                    self.addQuestion(item, haveAnswer);
                }

                self.pageStart = false;

                if (!haveAnswer && item.pause && item.type != "group") {
                    item.mustResume = true;
                    return;
                }
            }

        };

        // Add question
        this.addQuestion = function(question, haveAnswer) {
            // console.log("adding question:", question, this);            
            if (!this.state.itemState.group.$el) {
                console.error("All questions must be contained within a group");
            }
            var $el = this.state.itemState.group.$el;

            if (this.builtinTypes[question.type]) {
                this.renderQuestion(this.builtinTypes[question.type], question, haveAnswer);
            }
            else if (questionData.types[question.type]) {
                this.renderQuestion(questionData.types[question.type], question, haveAnswer);
            }
            else {
                console.error("Unknown type: " + question.type);
            }
        };

        // Add a new group
        this.addGroup = function(groupInfo, pageStart) {
            var self = this;
            console.log("adding group:", groupInfo, this);
            var group = $.extend({}, groupInfo);

            if (!pageStart && (group.newPage || group.lastGroup)) {

                var footer = self.state.itemState.group.$el.$div({'class': 'footer'});

                if (!self.state.pageGroup.firstGroup) {
                    var prev   = footer.$div({'class': 'prev-page-link'}).
                        $span("&lArr; " + self.state.prevGroup.linkText);
                    prev.bind("click", function(e) {
                        History.back();
                    });
                }

                if (!group.lastGroup) {
                    var next   = footer.$div({'class': 'next-page-link'}).
                        $span("Continue to " + group.linkText + " &rArr;");
                    next.bind("click", function(e) {
                        History.pushState({name: group.name, prevGroup: self.state.pageGroup}, 
                                          group.heading, "?page="+group.name);
                    });
                }

                return {stop: true};
            }

            group.$el = self.state.itemState.group.$el.$div({id: "group-" + groupInfo.name, 
                                              'class': "group-" + groupInfo.name + " question-group"});
            if (group.items) {
                self.state.itemStack.push(self.state.itemState);
                self.state.itemState = {i: 0, 
                                        items: group.items,
                                        group: {
                                            $el: group.$el
                                        }
                                       };
            }

            return {stop: false};
        };

        // Render the question
        this.renderQuestion = function(typeInfo, question, haveAnswer) {
            var self = this;
            question.typeInfo = typeInfo;
            var qDiv = this.state.itemState.group.$el.$div({'class': "question-input-bar " + (question.className ? question.className : ""),
                                            style: question.style ? question.style : " "});
            if (question.preText || question.text) {                
                var text = this.doTemplateSubs(question.preText ? question.preText : question.text);
                qDiv.$div(text);
            }

            if (typeInfo.type == "text") {
            }
            else if (typeInfo.type == "inputBar") {
                var opts = {};
                if (question.placeholder) {
                    opts.placeholder = question.placeholder;
                }
                var input = qDiv.$input(opts);
                if (haveAnswer) {
                    input.val(self.state.answers[question.name]);
                }
                question.form = input;
                input.bind("change", function(e) {
                    self.processAnswer(question, input.val());
                });
            }
            else if (typeInfo.type == "radio") {
                var self = this;
                var className = "radio-inline " + (typeInfo.className ? typeInfo.className : ""); 
                var div = qDiv.$div();
                var radioName = "radio" + this.state.radioSeq++;
                $.each(typeInfo.options, function(i, opt) {  
                    var radioOpts = {
                        type: "radio", 
                        'class': className, 
                        name: radioName, 
                        value: opt.text
                    };
                    if (haveAnswer &&
                        self.state.answers[question.name] == opt.text) {
                        radioOpts.checked = "checked";
                    }
                    var label = div.$label({'class': className}).
                        $input_(radioOpts).$span_(opt.text);
                    console.log(opt);
                    label.bind("change", function(e) {
                        var input = $(e.currentTarget).find("input");
                        if (input.is(":checked")) {
                            self.processAnswer(question, input.val());
                        }
                    });
                });
               
            }
            else if (typeInfo.type == "dropdown") {
                var div = qDiv.$div();
                var select = div.$select();
                $.each(typeInfo.options, function(i, opt) {                   
                    select.$option(opt.text);
                });
            }
            else if (typeInfo.type == "checkbox") {
                var checkDiv = qDiv.$div();
                var options = question.options ? question.options : typeInfo.options;
                var className = typeInfo.className ? typeInfo.className : ""; 
                $.each(options, function(i, opt) {
                    var checkboxOpts = {type: "checkbox"};
                    if (self.state.answers[opt.name]) {
                        checkboxOpts.checked = true;
                    }
                    var label = checkDiv.
                        $div({'class': 'checkbox'}).
                        $label({'class': className}).
                        $input_(checkboxOpts).
                        $span_(opt.text);

                    label.bind("change", function(e) {
                        var input = $(e.currentTarget).find("input");
                        self.processAnswer(opt, input.is(":checked"));
                    });
                });
                
            }
            else if (typeInfo.type == "numentry") {
                self.addNumEntry(question, typeInfo, qDiv, haveAnswer); 
            }
            else if (typeInfo.type == "stackedNumentry") {
                var table = qDiv.$table({'class': 'stackedNumentry'});
                $.each(question.items, function(i, val) {
                    var row = table.$tr();
                    row.$th(val.text);
                    self.addNumEntry(val, typeInfo, row.$td().$div(), haveAnswer); 
                });
                
            }

        };

        this.addNumEntry = function(question, typeInfo, qDiv, haveAnswer) {
            var self = this;
            var div = qDiv.$div();
            var className = typeInfo.className ? typeInfo.className : ""; 

            var leftArrow  = div.$div({'class': 'numentry-left-arrow'}).$span_("-");
            var input      = div.$div({'class': 'numentry-value'}).$input();
            var rightArrow = div.$div({'class': 'numentry-right-arrow'}).$span_("+");

            if (haveAnswer) {
                input.val(self.state.answers[question.name]);
            }
            else {
                input.val(0);
            }

            input.bind("change", function(e) {
                self.processAnswer(question, input.val());
            });
            leftArrow.bind("click", function(e) {
                var val = parseInt(input.val());
                if (val < 1) { val = 1; }
                input.val(val-1);
                self.processAnswer(question, input.val());
            });
            rightArrow.bind("click", function(e) {
                var val = parseInt(input.val());
                input.val(val+1);
                self.processAnswer(question, input.val());
            });
        };
        
        // Called whenever there is a new answer for a question
        this.processAnswer = function(question, val) {
            console.log(question, val);
            this.state.answers[question.name] = val;
            question.answer = val;
            
            if (question.templateName) {
                if (typeof(val) != "undefined") {
                    this.state.templateVars[question.templateName] = val;
                }
            }

            if (localStorage) {
                localStorage.setItem("questionState", JSON.stringify(this.state));
            }
            
            if (question.mustResume) {
                question.mustResume = false;
                this.processItems();
            }
            
        };

        // Called to substitute 
        this.doTemplateSubs = function(inText) {
            var self = this;
            return inText.replace(/\$([\w\d\-_]+)/g, function(str, name) {
                if (self.state.templateVars[name]) {
                    return self.state.templateVars[name];
                }
                else {
                    return "$" + name;
                }
            });
        };

    };


    $('document').ready(function() {
        var main = new ctx.main();
        main.init({
            id: "main",
            data: questionData
        });
    });


})(this, jQuery, questionData);
