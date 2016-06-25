
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
                    pause: true,
                    templateName: "gender"
                },
                {
                    type: "numentry",
                    name: "age",
                    text: "What is your age?",
                    templateName: "age"
                },
                {
                    type: "stackedNumentry",
                    name: "volume-male",
                    text: "Volume info",
                    items: [
                        {
                            name: "volume-male-one",
                            text: "This is question 1",
                        },
                        {
                            name: "volume-male-two",
                            text: "This is question 2",
                        },
                        {
                            name: "volume-male-one",
                            text: "This is question 3",
                        },
                    ]
                },
                {
                    type: "checkbox",
                    name: "check-box-test",
                    text: "Where would you like to go?",
                    pause: false,
                    options: [
                        {
                            text: "Orlando",
                            name: "visit-orlando"
                        },
                        {
                            text: "Toronto",
                            name: "visit-toronto"
                        },
                        {
                            text: "New York",
                            name: "visit-ny"
                        },
                        {
                            text: "Barcelona",
                            name: "visit-barcelona"
                        },
                        {
                            text: "Paris",
                            name: "visit-paris"
                        }
                    ]
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
                            templateName: "boolquestions",
                            pause: true,
                        },
                    ],
                },
                {
                    type: "mfo",
                    name: "gender",
                    text: "question after sub-group",
                },
            ]
        },
        {  
            type: "group",
            name: "page-2",
            heading: "Welcome to page 2",
            linkText: "Page 2",
            newPage: true,
            items: [
                {
                    type: "text",
                    className: "heading1",
                    text: "Hi there!",
                },
                {
                    type: "mfo",
                    name: "gender",
                    text: "Hi $nickname! What do you consider yourself?",
                    pause: true,
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
                            pause: true,
                        },
                    ],
                },
                {
                    type: "mfo",
                    name: "gender",
                    text: "question after sub-group",
                },
            ]
        }

    ],


};