var keys = require("./Secrets.json");
let search=["Nitain","Orokin"];
let TelegramBot = require('node-telegram-bot-api');
const Twitter = require('twitter');
 
const WARFRAME_ALERTS_ID=keys.WARFRAME_ALERTS_ID;
 
telegram = new TelegramBot(keys.TelegramToken, { polling: true });
 
var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});
 
telegram.on("text", (message) => {//////////////////////////When the bot is sent a message
    if(message.chat.id==WARFRAME_ALERTS_ID)
        telegram.deleteMessage(WARFRAME_ALERTS_ID,message.message_id);
    if(message.text.indexOf("/add")===0||message.text.indexOf("/Add")===0)
    {
        var init=0;
        for(var i=0;i<search.length;i++)
            if (search[i]===message.text.split(" ")[1])
                init=1;
        if(init===0)
        {
            search.push(message.text.split(" ")[1]);
            telegram.sendMessage(WARFRAME_ALERTS_ID,"Added: "+message.text.split(" ")[1]);
            setTimeout(function(){ }, 500);
            telegram.sendMessage(WARFRAME_ALERTS_ID,"Updated search list: "+search.toString());
        }
        else
            telegram.sendMessage(WARFRAME_ALERTS_ID,message.text.split(" ")[1]+" is already being searched for");
    }
    if(message.text.indexOf("/remove")===0||message.text.indexOf("/Remove")===0)
    {
        var init=0;
        for(var i=0;i<search.length;i++)
            if (search[i]===message.text.split(" ")[1])
                init=1;
        if(init===1)
        {
            search.splice(search.indexOf(message.text.split(" ")[1]),1);
            telegram.sendMessage(WARFRAME_ALERTS_ID,"Removed: "+message.text.split(" ")[1]);
            setTimeout(function(){ }, 500);
            telegram.sendMessage(WARFRAME_ALERTS_ID,"Updated search list: "+search.toString());
        }
        else
            telegram.sendMessage(WARFRAME_ALERTS_ID,message.text.split(" ")[1]+" is not in the current search list");
    }
    if(message.text.indexOf("/search")===0||message.text.indexOf("/Search")===0)
    {
        telegram.sendMessage(WARFRAME_ALERTS_ID,"Here is the current search list: "+search.toString());
    }
});
 
telegram.sendMessage(WARFRAME_ALERTS_ID,"Currently looking for these keywords: "+search.toString());
var mostRecentID = null;
 
check_tweet();
function check_tweet()///////////////////////////Looking at twitter and evaluating
{
    var params = {screen_name: "Warframe_BOT", count: 1};


    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if(error)
            return;
        if (mostRecentID == null || tweets[0].id != mostRecentID)
        {
            mostRecentID = tweets[0].id;
            var tweet=tweets[0].text;
       
            var tweetArr=tweet.split("-");

            var Do=0;
            var important=0;

            for(var i=0;i<tweetArr.length;i++)
                for(var j=0;j<search.length;j++)
                    if(tweetArr[i].includes(search[j]))
                    {
                        Do=1;
                        important=i;
                    }

            if(Do===1)
                telegram.sendMessage(WARFRAME_ALERTS_ID,"There is currently an alert for"+tweetArr[important]+" for the next"+tweetArr[1]);
        }
    });

    setTimeout(function(){ check_tweet(); }, 30000);
}
