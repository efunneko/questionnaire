
var questionData = {

    types: {
        ynwlt: {
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
                {
                    text: "No, but would like to",
                    pointMult: 0.2,
                    help: "Just haven't found time yet?"
                },
            ],
        },
        mfo: {
            type: "radio",
            options: [
                {
                    text: "Male",
                },
                {
                    text: "Female",
                    help: "You go girl"
                },
                {
                    text: "Neither",
                    help: "You can't label me"
                },
                {
                    text: "Both",
                    help: "You be what you want to be"
                },
            ],
        },

    },

    items: [
        {  
            type: "group",
            name: "welcome",
            heading: "Welcome!",
            linkText: "Welcome Page",
            items: [
                {
                    type: "text",
                    className: "heading1",
                    text: "Hi there!",
                },
                {
                    type: "inputBar",
                    name: "nickname",
                    text: "What would you like me to call you?",
                    placeholder: "firstname/nickname/intials",
                    pause: true,
                    templateName: "nickname"
                },
                {
                    type: "mfo",
                    name: "gender",
                    text: "Hi $nickname! What do you consider yourself?",
                    templateName: "gender"
                },
                {  
                    type: "group",
                    name: "sub-group",
                    heading: "Sub group!",
                    linkText: "Group (sub)",
                    items: [
                        {
                            type: "yn",
                            name: "boolquestions",
                            text: "Yes or No? $gender",
                            templateName: "boolquestions"
                        },
                    ],
                },
                {
                    type: "mfo",
                    name: "gender",
                    text: "question after sub-group",
                    templateName: "gender"
                },
            ]
        }

    ],


};