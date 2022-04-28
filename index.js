const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3333,
});

//Add code here
app.event("app_home_opened", ({ event, say }) => {
    console.log(`Hello, <@${event.user}>! 😄`);
  say(`Hello, <@${event.user}>! 😄`);
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  console.log(`Hey there <@${message.user}>!`);
  await say(`Hey there <@${message.user}>!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
