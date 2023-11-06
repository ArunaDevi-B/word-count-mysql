const WebLinkModel = require('../Models/urlDataModel');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.webLinkScraper = async (req,res) => {
    try{
        let operation = req.params.operation;
        let data = req.body;
        let response;
        let message = '';
        let status;

// Function calling based on operation in switch case
        switch (operation) {
            case 'CREATE':
                response = await checkWordCount(data.url);
                if(response == true){
                    status = true;
                    message = 'Data saved successfully';
                    break;
                }else{
                    status = false;
                    message = 'Enter the valid URL';
                    break;
                }

            
            case 'READ':
                status = true;
                response = await getAllURL();
                message = 'Data fetched success';
                break;
                
            case 'UPDATE':
                response = await addFavourite(data);
                if(response == false){
                    status = false;
                    message = 'URL not found';
                    break;
                }else {
                    status = true;
                    message = 'Marked as favourite';
                    response = true;
                    break;
                }

            case 'DELETE':
                status = true;
                response = await deleteURL(data);
                message = 'Data removed successfully';
                break;
            default:
                status = false;
                message = 'Unable to perform the operation';
                break;
        }
        const formattedResponse = formatResponse(message, response, status);
        res.send(formattedResponse);
    }catch(error){
        console.log(error,'error');
        res.status(500).send({Message: 'Data not fetched', data:error});
    }

}

// Function for formating the response
const formatResponse = (message, data, status) => {
    return{
        'status': status,
        'message': message,
        "data": status == true ? data : [],
        "statusCode": status == true ? 200 : ''
    }
}

// Checking the word count of a web-link and saving the necessary data in the server
const checkWordCount = async (url) => {
    try {
// fetching the web-link
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
        }
// fetching the words from the url using cheerio
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
// Inserting the web-link data in the server
        const insertedData = await WebLinkModel.create(insertURL);
        if(insertedData){
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error('An error occurred:', err);
        return err;
    }
}

// Function to remove the script, style tags, etc... for calculating the word count
function removeScript(text) {
    const SCRIPT_AND_NOSCRIPT_REGEX = /<(script|noscript|style)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi;
    text = text.replace(SCRIPT_AND_NOSCRIPT_REGEX, "");
    return text;
}

// Listing the searched history
const getAllURL = async () => {
    try{
        const allURLData = await WebLinkModel.findAll({});
        return allURLData;
    }catch(error){
        console.log(error);
    }

}

// updating the favourite and removing from favourite
const addFavourite = async (data) => {
    try{
        const isURLExist = await WebLinkModel.findOne({ where: { url_id: data.url_id } });
        if(isURLExist != null){
            let updatedFavoutite;
            if(isURLExist.dataValues.favourite == true){
                updatedFavoutite = false;
            } else if(isURLExist.dataValues.favourite == false){
                updatedFavoutite =  true;
            }
           const condition = { url_id: data.url_id };
           await WebLinkModel.update({favourite: updatedFavoutite}, { where: condition });
           return true;
        } else{
            return false;
        }
    }catch(error){
       console.log(error,'errror');
    }
}

// Deleting the history based on id
const deleteURL = async (data) => {
    try{
        const isURLExist = await WebLinkModel.findOne({ where: { url_id: data.url_id } });
        if(isURLExist != null){
            await WebLinkModel.destroy({ where: {url_id: data.url_id}});
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