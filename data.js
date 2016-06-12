
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
                    text: "Female"
                },
                {
                    text: "Other",
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
                            text: "Yes or No?",
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