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
                class: "input-bar-large"
            },
            inputBarSmall: {
                type: "inputBar",
                class: "input-bar-small"
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
            this.group = {
                $el: $('#' + options.id)
            };
            this.templateVars = {};
            this.data = options.data;
            this.radioSeq = 0;
            this.start();
        };

        // Start the whole process
        this.start = function() {
            this.groupStack = [];

            this.itemStack = [];
            this.itemState = {
                i: 0,
                items: this.data.items
            };

            this.processItems();
        };

        // Go through all the items in the list and handle them
        this.processItems = function() {
            var self = this;
            var itemState = this.itemState;
            while(true) {
                console.log(itemState);
                if (itemState.i >= itemState.items.length) {
                    if (this.itemStack.length > 0) {
                        itemState = this.itemStack.pop();
                        this.processItems();
                    }
                    return;
                }

                var item = itemState.items[itemState.i];
                console.log(item);
                itemState.i++;

                if (item.type == "group") {
                    self.addGroup(item);
                }
                else {
                    self.addQuestion(item);
                }

                if (item.pause) {
                    item.mustResume = true;
                    return;
                }
            }

        };

        // Add question
        this.addQuestion = function(question) {
            console.log(question);            
            if (!this.group.$el) {
                console.error("All questions must be contained within a group");
            }
            var $el = this.group.$el;

            if (this.builtinTypes[question.type]) {
                this.renderQuestion(this.builtinTypes[question.type], question);
            }
            else if (questionData.types[question.type]) {
                this.renderQuestion(questionData.types[question.type], question);
            }
            else {
                console.fatal("Unknown type: " + question.type);
            }
        };

        // Add a new group
        this.addGroup = function(groupInfo) {
            var group = groupInfo;
            group.$el = this.group.$el.$div({id: "group-" + groupInfo.name, 
                                              class: "group-" + groupInfo.name + " question-group"});
            // this.groupStack.push(this.group);
            this.group = group;

            if (group.items) {
                this.itemStack.push(this.itemState);
                this.itemState = {i: 0, items: group.items};
            }
            
            // this.group = this.groupStack.pop();
            
        };

        // Render the question
        this.renderQuestion = function(typeInfo, question) {
            var self = this;
            question.typeInfo = typeInfo;
            var qDiv = this.group.$el.$div({class: "question-input-bar " + question.class ? question.class : "",
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
                question.form = input;
                input.bind("change", function(e) {
                    self.processAnswer(question);
                });
            }
            else if (typeInfo.type == "radio") {
                var div = qDiv.$div();
                var radioName = "radio" + this.radioSeq++;
                $.each(typeInfo.options, function(i, opt) {                   
                    div.$input_({type: "radio", name: radioName, value: opt.text}).$span(opt.text);
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

        this.processAnswer = function(question) {
            var typeInfo = question.typeInfo;
            var form     = question.form;
            var val;

            if (typeInfo.type == "tbd") {
            }
            else {
                val = form.val();
                console.log("val:", val);
            }
            
            if (question.templateName) {
                if (val) {
                    this.templateVars[question.templateName] = val;
                }
            }
            
            if (question.mustResume) {
                this.processItems();
            }
            
        };

        this.doTemplateSubs = function(inText) {
            var self = this;
            return inText.replace(/\$([\w\d\-_]+)/g, function(str, name) {
                console.log("inreplace", name);
                if (self.templateVars[name]) {
                    return self.templateVars[name];
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
