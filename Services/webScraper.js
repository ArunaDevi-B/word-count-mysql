const WebLinkModel = require('../Models/urlDataModel');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.webLinkScraper = async (req,res) => {
    try{
        let operation = req.params.operation;
        let data = req.body;
        let response;
        let message = '';
        switch (operation) {
            case 'CREATE':
                response = await checkWordCount(data.url);
                message = 'Data saved successfully';
                break;
            
            case 'READ':
                response = await getAllURL();
                message = 'Data fetched success';
                break;
                
            case 'UPDATE':
                response = await addFavourite(data);
                if(response == false){
                    message = 'URL not found';
                    break;
                }else {
                    message = 'Marked as favourite';
                    break;
                }

            case 'DELETE':
                response = await deleteURL(data.url);
                message = 'Data removed successfully';
                break;
            default:
                message = 'Unable to perform the operation';
                break;
        }
        const formattedResponse = formatResponse(message, response);
        res.send(formattedResponse);
    }catch(error){
        console.log(error,'error');
        res.status(500).send({Message: 'Data not fetched', data:error});
    }

}

const formatResponse = (message, data) => {
    return{
        'Message': message,
        "Data": data? data : null,
        "StatusCode": 200
    }
}

const checkWordCount = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        const data = cheerio.load(html);
        const parsedData = cheerio.load(removeScript(data.html()));
        const text = parsedData.text();
        const words = text.replace(/[\s]+/g, " ").split(' ');
        const word_count = words.filter(Boolean).length;
        const insertURL = {
            "domain_name": url,
            "word_count": word_count,
        }
        const insertedData = await WebLinkModel.create(insertURL);
        if(insertedData){
            const searchedURLs = await WebLinkModel.findAll({});
            const urlDataArray = searchedURLs.map(instance => instance.dataValues);
            return urlDataArray;
        } else {
            return null;
        }
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

function removeScript(text) {
    const SCRIPT_AND_NOSCRIPT_REGEX = /<(script|noscript|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi;
    text = text.replace(SCRIPT_AND_NOSCRIPT_REGEX, "");
    return text;
}

const getAllURL = async () => {
    try{
        const allURLData = await WebLinkModel.findAll({});
        const allURLs = allURLData.map(instance => instance.dataValues);
        return allURLData;
    }catch(error){
        console.log(error);
    }

}

const addFavourite = async (data) => {
    try{
        const isURLExist = await WebLinkModel.findOne({ where: { domain_name: data.url } });
        if(isURLExist != null){
           const condition = { domain_name: data.url };
           await WebLinkModel.update({favourite: data.favourite}, { where: condition });
           let remainingURL = await WebLinkModel.findAll({});
            const allUrlData = remainingURL.map(instance => instance.dataValues);
           return allUrlData;
        } else{
            return false;
        }
    }catch(error){
       console.log(error,'errror');
    }
}

const deleteURL = async (data) => {
    try{
        const isURLExist = await WebLinkModel.findOne({ where: { domain_name: data } });
        if(isURLExist != null){
            await WebLinkModel.destroy({ where: {domain_name: data}});
            let remainingURL = await WebLinkModel.findAll({});
            const allUrlData = remainingURL.map(instance => instance.dataValues);
            return allUrlData;
        }else{
            return false;
        }
}catch(error){
    console.log(error,'errror');
 }
}