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
    this.svgCode += `<text class="svg-text" x="${xOffset}" y="115" fill="${answers.textColor}">${answers.threeCharacters}</text>`

    // we close the svg tag, and make it work
    this.svgCode += '</svg>'

  }

  write(filename) {
    // TODO: here we will write the file from this.svgCode
    console.log(this.svgCode);
  }
}

const answers = {
  threeCharacters: 'ass',
  textColor: 'blue',
  shape: 'square',
  shapeColor: 'purple'
}

const mySVG = new SVG(answers);

mySVG.write('asidjokfghals;ikjdkgfhb');