import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { requireAuth } from './util/authentication';
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage",
    requireAuth,
    async (req, res) => {
      const imageInputUrl = req.query.image_url;
      if (!imageInputUrl) {
        return res.status(400).send({ message: 'Missing image_url' });
      }
      try {
        const imageOutputUrl = await filterImageFromURL(imageInputUrl);
        res.sendFile(imageOutputUrl, err => {
          if (err) {
            console.log(err);
            res.status(500).end();
          } else {
            // cleaning up
            deleteLocalFiles([imageOutputUrl])
          }
        })
      } catch (err) {
        res.status(400).send({ message: 'Invalid input image' });
      }
    });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();