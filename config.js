var config = {};

//AWS storage
process.env.AWS_ACCESS_KEY_ID = 'AKIASBDNXAQLPOC7QAG3';
process.env.AWS_SECRET_ACCESS_KEY = '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';
process.env.S3_BUCKET_NAME = 'cached-pages';
process.env.S3_PREFIX_KEY = '';

//Azure storage
process.env.AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || 'DefaultEndpointsProtocol=https;AccountName=crowdpicprerenderstorage;AccountKey=u4Hx5ndQGC79lnsvJ7rvoW9/M70UVanXUINoRtlaB3cpfmTwLvUFHVdetez7ixwK9jHNJwIJusA1d30MGan/vw==;EndpointSuffix=core.windows.net';
process.env.AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'cached-pages';
process.env.AZURE_PREFIX_KEY = '';

process.env.PRERENDER_TOKEN = 'eyJ0eXAiOiJKV1QiLCJh';

module.exports = config;
