const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const genHue = ({ seed }) => {
    const relHue = uniqueNamesGenerator({
        dictionaries: [colors, animals],
        separator: ' ',
        length: 2,
        seed: seed,
    });

    return relHue;
}

export default genHue;