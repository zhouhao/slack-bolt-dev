const {App} = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3333,
});

const getDatetime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

//Add code here
app.event("app_home_opened", async ({event, say}) => {
  console.log(`Hello, <@${event.user}>! 😄`);
  await say(`Hello, <@${event.user}>! 😄`);
});

app.event("link_shared", async ({event, say}) => {
  console.log(`link_shared, ${JSON.stringify(event)}! 😄`);
  await say(`Hello, <@${event.user}> ${event.links[0].url}! 😄`);
  await app.client.chat.unfurl({
    channel: event.channel,
    ts: event.message_ts,
    unfurls: {
      [event.links[0].url]: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Current Datetime:*\n ${await getDatetime()}`,
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "action_id": "refresh_button_click",
                "text": {
                  "type": "plain_text",
                  "text": "Refresh"
                }
              },
              {
                "type": "button",
                "action_id": "remove_button_click",
                "text": {
                  "type": "plain_text",
                  "text": "Remove"
                },
                "style": "danger"
              }
            ]
          }
        ]
      }
    }
  });
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({message, say}) => {
  // say() sends a message to the channel where the event was triggered
  console.log(`Hey there <@${message.user}>!`);
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.action("button_click", async ({body, ack, say}) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

app.action("refresh_button_click", async ({body, ack, say}) => {
  // Acknowledge the action
  console.warn(JSON.stringify(body));
  await ack();
  await app.client.chat.unfurl({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    unfurls: {
      [body.container.app_unfurl_url]: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Current Datetime:*\n ${await getDatetime()}`,
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "action_id": "refresh_button_click",
                "text": {
                  "type": "plain_text",
                  "text": "Refresh"
                }
              },
              {
                "type": "button",
                "action_id": "remove_button_click",
                "text": {
                  "type": "plain_text",
                  "text": "Remove"
                },
                "style": "danger"
              }
            ]
          }
        ]
      }
    }
  });
});

app.action("remove_button_click", async ({body, ack, say}) => {
  // Acknowledge the action
  await ack();
  await app.client.chat.unfurl({
    channel: body.container.channel_id,
    ts: body.container.message_ts,
    unfurls: {
      [body.container.app_unfurl_url]: {
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🗑`,
            }
          }
        ]
      }
    }
  });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
