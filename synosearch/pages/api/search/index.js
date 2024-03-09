import Exa from "exa-js"

const exa = new Exa(process.env.EXA_API_KEY)

export const search = async (data) => {
    const response = await exa.search(data.query, {
        numResults: data.numResults,
        useAutoprompt: data.useAutoprompt,
    });

    return response;
};