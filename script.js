const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

// TODO: use this site to further the list of colors https://www.w3.org/wiki/CSS/Properties/color/keywords
const colorList = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",    
]

// these regular expressions were created using https://regex101.com/
function validateColor(value) {
    if (colorList.includes(value.toLowerCase())) {
        return true;
    }

    // match 3 character hex colors like '#f0f'
    if (/^#[\d,a-f]{3}$/gmi.test(value)) {
        return true;
    }

    // match 6 character hex colors like '#f0f0f0'
    if (/^#[\d,a-f]{6}$/gmi.test(value)) {
        return true;
    }

    throw Error(`Please provide a hexidecimal color code formatted like \`#f0f\` or \`#ff00ff\`, or select color from the following list:\n${colorList}`);
}

const questions = [
    {
        name: 'threeCharacters',
        type: 'input',
        message: 'Please input up to three characters',
        // here we need to validate the length of the response
        validate(input) {
            if (input.length <= 3) {
                return true;
            }
            throw Error('Please provide up to three characters');
        },
    },
    {
        name: 'textColor',
        type: 'input',
        message: 'Please input text color',
        // should be able to enter a name or hexidecimal color
        validate: validateColor,
        filter(value) {
            return value.toLowerCase();
        },
    },
    {
        name: 'shape',
        type: 'list',
        message: 'Please select a shape',
        // here we need to display a list of circle, square, triangle to choose from
        choices: ['circle', 'square', 'triangle']
    },
    {
        name: 'shapeColor',
        type: 'input',
        message: 'Please input shape color',
        // should be able to enter a name or hexidecimal color
        validate: validateColor,
        filter(value) {
            return value.toLowerCase();
        },
    },
]

function handleAnswers(answers) {
    // console.log(answers);
    const mySVG = new SVG(answers);
    mySVG.write('logo.svg');
}

class SVG {
    constructor(answers) {
        // here we introduce the minimum shit needed for the svg
        this.svgCode = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">'
        this.svgCode += `<style>
      .svg-text {
        font-size: 60px;
        font-family: monospace;
      }
    </style>`

        // here, we draw in the shape the user picked
        switch (answers.shape) {
            case 'circle':
                this.svgCode += `<circle cx="150" cy="100" r="90" fill="${answers.shapeColor}"/>`
                break;

            case 'square':
                this.svgCode += `<rect width="180" height="180" x="60" y="10" fill="${answers.shapeColor}"/>`
                break;

            case 'triangle':
                this.svgCode += `<polygon points="150,10 50,190 250,190" style="fill:${answers.shapeColor}"/>`
                break;

            default:
                throw Error('fucked up shape dawg')
        }

        // we can ignore the vertical offset, and just keep it at the same height
        // 36.13 is the width of one monospace character at size 60px
        // we use this to calculate the x offset of the text and center it
        const xOffset = 150 - (answers.threeCharacters.length * 36.13) / 2

        // we are using this turnery because we want the text to appear lower on triangles but not on circles or squares
        const yOffset = answers.shape == 'triangle'? 170 : 125
        this.svgCode += `<text class="svg-text" x="${xOffset}" y="${yOffset}" fill="${answers.textColor}">${answers.threeCharacters}</text>`

        // we close the svg tag, and make it work
        this.svgCode += '</svg>'

    }

    write(filename) {
        fs.writeFileSync(filename, this.svgCode, {encoding: 'utf-8'})
        console.log('Generated logo.svg');
    }
}


// we will use this as an example of a minimal svg file
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Introduction

inquirer
    .prompt(questions)
    .then(handleAnswers)
    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });