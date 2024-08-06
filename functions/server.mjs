import express from 'express';
import YTMusic from 'ytmusic-api';
import fetch from 'node-fetch';
import os from 'os';
import path from 'path';
import fs from 'fs';
import prism from 'prism-media';
import dfpwm from 'dfpwm';

const app = express();
const port = 3000;
const ytmusic = new YTMusic();

(async () => {
  await ytmusic.initialize();
})();

app.get('/', (req, res) => {
  if (req.query.id) {
    // Download youtube video and convert to dfpwm
    return new Promise((resolve, reject) => {
      fetch('https://api.cobalt.tools/api/json', {
        method: 'POST',
        body: JSON.stringify({
          url: 'https://www.youtube.com/watch?v=' + req.query.id,
          isAudioOnly: true,
          vQuality: '144',
          aFormat: 'opus'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => response.json())
        .then(json => {
          if (json.url) {
            const transcoder = new prism.FFmpeg({
              args: [
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's8',
                '-ar', '48000',
                '-ac', '1'
              ]
            });

            const filepath = path.join(os.tmpdir(), 'output.dfpwm');

            fetch(json.url, { method: 'GET' }).then(response => {
              if (response.ok) {
                response.body
                  .pipe(transcoder)
                  .pipe(new dfpwm.Encoder())
                  .pipe(fs.createWriteStream(filepath))
                  .on('finish', () => {
                    resolve(res.status(200).send(fs.readFileSync(filepath)));
                  })
                  .on('error', error => {
                    console.error(error);
                    reject(res.status(500).send("Error 500"));
                  });
              } else {
                console.log(response.status);
                reject(res.status(500).send("Error 500"));
              }
            }).catch(error => {
              console.error(error);
              reject(res.status(500).send("Error 500"));
            });

          } else {
            console.log(json);
            reject(res.status(500).send("Error 500"));
          }
        }).catch(error => {
          console.error(error);
          reject(res.status(500).send("Error 500"));
        });
    });

  } else if (req.query.search) {
    // Search for songs on youtube
    return new Promise((resolve, reject) => {
      let youtube_url_match = req.query.search.match(/((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
      if (youtube_url_match?.[5]) {
        ytmusic.getVideo(youtube_url_match[5]).then(result => {
          resolve(res.status(200).send(JSON.stringify([{
            id: result.videoId,
            name: result.name,
            artist: result.artist.name,
            album: result.artist.name,
            duration: result.duration
          }])));
        }).catch(error => {
          console.error(error);
          reject(res.status(500).send("Error 500"));
        });

      } else {
        ytmusic.search(req.query.search).then(result => {
          resolve(res.status(200).send(JSON.stringify(
            result
              .filter(a => ["SONG", "VIDEO"].includes(a.type))
              .map(a => {
                return {
                  id: a.videoId,
                  name: a.name,
                  artist: a.artist.name,
                  album: a.album?.name || a.artist.name,
                  duration: a.duration
                };
              })
          )));
        }).catch(error => {
          console.error(error);
          reject(res.status(500).send("Error 500"));
        });
      }
    });

  } else {
    res.status(400).send("Bad request");
  }
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

