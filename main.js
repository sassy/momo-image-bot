'use strict';
const Botkit = require('botkit');
const request = require('request');
const fs = require('fs');

let imageArray = [];

const dataStr = fs.readFileSync('./data.json', 'utf-8');
console.log(dataStr);
const dataObj = JSON.parse(dataStr);
console.log(dataObj);

const controller = Botkit.slackbot({
  debug:true
});

const bot = controller.spawn({
  token: dataObj.bot_token,
}).startRTM((err, bot, payload) => {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  let url = 'https://api.tumblr.com/v2/blog/';
  url += dataObj.tumblr_url;
  url += '/posts/photo/?';
  url += 'api_key=';
  url += dataObj.tumblr_token;

  request(url, (error, response, body) => {
      const data = JSON.parse(body);
      data.response.posts.forEach(function(post) {
        imageArray.push(post.photos[0].alt_sizes[2].url);
      });
    });
});

controller.hears(["image"], ['direct_message','direct_mention','mention'], (bot,message) => {
  const random = Math.floor(Math.random() * (imageArray.length - 1));
  bot.reply(message, imageArray[random]);
});
