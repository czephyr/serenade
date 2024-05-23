const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const italianNames = require('../public/italianNames.json');

const genHue = ({ seed }) => {

    const index = seed % italianNames.length;
    const relHue = italianNames[index];

    return relHue;
}

export default genHue;