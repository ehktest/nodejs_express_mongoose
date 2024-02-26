const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const dbEvents = async (data, modelName) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "model"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "model"));
    }

    await fsPromises
      .writeFile(
        path.join(__dirname, "..", "model", modelName),
        JSON.stringify(data, null, 2)
      )
      .then(() => console.log("Model basariyla guncellendi."))
      .catch((err) => console.error("Dosyaya yazma hatası:", err));
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbEvents;
