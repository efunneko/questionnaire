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
            $.createHtml("configure", {installParentFunctions: true});
            this.start(options);
        };

        // Start the whole process
        this.start = function(options) {
            this.data  = options.data;
            this.uniquifyNames(this.data, {});
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
            
            var savedState = JSON.parse(localStorage.getItem("questionState"));
            console.log(savedState);
            this.state.answers = savedState.answers;
            this.state.templateVars = savedState.templateVars;

            this.processItems();
        };

        this.uniquifyNames = function(data, names) {
            var self = this;
            $.each(data.items, function(i, val) {
                var name = val.name;
                if (names[name]) {
                    var i = 0;
                    while(true) {
                        if (!names[name+i]) {
                            name = name+i;
                            val.name = name;
                            break;
                        }
                        i++;
                    }
                }
                names[name] = true;
                if (val.type == "group") {
                    self.uniquifyNames(val, names);
                }
            });
            console.log(data);
        }

        // Go through all the items in the list and handle them
        this.processItems = function() {
            var self = this;
            //console.log("itemStack", this.state.itemStack);

            while(true) {
                // console.log("Current state:", this.state.itemState, this.state.itemState.group.$el);

                if (this.state.itemState.i >= this.state.itemState.items.length) {
                    if (this.state.itemStack.length > 0) {
                        this.state.itemState = this.state.itemStack.pop();
                    }
                    else {
                        return;
                    }
                }

                var item = this.state.itemState.items[this.state.itemState.i];
                this.state.itemState.i++;

                var haveAnswer = typeof(this.state.answers[item.name]) != "undefined";

                if (item.type == "group") {
                    self.addGroup(item);
                }
                else {
                    self.addQuestion(item, haveAnswer);
                }

                if (!haveAnswer && item.pause) {
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
                console.fatal("Unknown type: " + question.type);
            }
        };

        // Add a new group
        this.addGroup = function(groupInfo) {
            console.log("adding group:", groupInfo, this);
            var group = $.extend({}, groupInfo);
            group.$el = this.state.itemState.group.$el.$div({id: "group-" + groupInfo.name, 
                                              'class': "group-" + groupInfo.name + " question-group"});
            if (group.items) {
                this.state.itemStack.push(this.state.itemState);
                this.state.itemState = {i: 0, 
                                        items: group.items,
                                        group: {
                                            $el: group.$el
                                        }
                                       };
            }
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
                $.each(typeInfo.options, function(i, opt) {                   
                    checkDiv.$div().$input_({type: "checkbox"}).$span(opt.text);
                });
                
            }

        };

        
        // Called whenever there is a new answer for a question
        this.processAnswer = function(question, val) {
            var typeInfo    = question.typeInfo;
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
