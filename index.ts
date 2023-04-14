import { Client, MessageEmbed } from 'revolt.io';
import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const PREFIX: string = '/';

let client = new Client();

client.on('ready', (): void => {
  console.log('Bot is operational 🤖');
});

client.on('message', (message): void => {
  if (message.content[0] === PREFIX) {
    let user_message: string = message.content.split('/')[1];
    if (user_message === 'help') {
      message.channel.send(
        "Hello! I'm donke from Shrek! My goal is to aid you to uncover the definitions of unknown words! Type **/define** followed by a word!"
      );
    } else if (user_message.split(' ')[0] === 'define') {
      let word: string = message.content.split(' ')[1];
      let definition: string = '';

      async function getDefinition() {
        try {
          let response: any = await axios.get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
          );
          response = response.data;
          let definition: string =
            response[0].meanings[0].definitions[0].definition;
          let embed = new MessageEmbed()
            .setTitle(`Definition of the word ${word}:`)
            .setColor('#44dd44')
            .setDescription(definition);

          message.channel.send({ embeds: [embed] });

          getImage(word)
            .then((image_url) => {
              message.channel.send(image_url);
            })
            .catch((err) => {
              console.log(err);
            });
        } catch (err) {
          let embed = new MessageEmbed()
            .setTitle(`Error:`)
            .setColor('#dd4444')
            .setDescription('Word not found 🤷');

          message.channel.send({ embeds: [embed] });
        }
      }
      getDefinition();
    }
  }
});

client.login(process.env.TOKEN);

async function getImage(word) {
  const response = await axios.get(
    `https://api.unsplash.com/photos/random?query=${word}&orientation=landscape&order_by=relevant`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS}`
      }
    }
  );

  return response.data.urls.regular;
}
