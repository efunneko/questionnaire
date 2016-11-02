
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

    scoreFuncs: {
        volumeFunc: function(val, inRanges) {
            var score = 0;
            var ranges = inRanges || [[4,10], [3,20], [2,30], [1,40]];

            var weight = ranges[0][0];
            for (var i = 0; i < ranges.length; i++) {
                if (ranges[i][1] != -1 && val > ranges[i][1]) {
                    score += ranges[i][1] * weight;
                    weight = ranges[i+1][0];
                    val -= ranges[i][1];
                }
                else {
                    score += val * weight;
                    val = 0;
                }
            }

            if (val > 0) {
                score += val * (weight < 0 ? weight : 1);
            }
            
            return score;
        } 
    },

    title: "Header Text",
    scoreTitle: "Score",

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
                    type: "mfo",
                    name: "gender",
                    text: "What do you consider yourself?",
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
                            score: ["volumeFunc", [[3,15], [2,20], [1,-1]]]
                        },
                        {
                            name: "volume-male-two",
                            text: "This is question 2",
                            score: ["volumeFunc", [[5,10], [3,10], [2,20], [1,-1]]]
                        },
                        {
                            name: "volume-male-three",
                            text: "This is question 3",
                            score: ["volumeFunc", [[10,8], [8,10], [5,16], [3,20], [1,-1]]]
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
        },
        {  
            type: "group",
            name: "page-3",
            heading: "Welcome to page 3",
            linkText: "Page 3",
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