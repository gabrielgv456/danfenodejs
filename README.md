# danfenodejs

**Generate DANFE (Auxiliary Document of the Electronic Invoice) from an XML**  
This Node.js project allows you to parse a Brazilian NF-e XML file and generate its DANFE (Documento Auxiliar da Nota Fiscal Eletrônica), typically as a PDF output.

---

## Table of Contents

- [About](#about)  
- [Requirements](#requirements)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Configuration](#configuration)  
- [Available Scripts](#available-scripts)  
- [Contributing](#contributing)  
- [License](#license)  
- [Examples](#examples)  

---

## About

This application:

- Reads and parses a **NF-e XML file**.  
- Extracts all the relevant data for the DANFE.  
- Generates a PDF (or other supported format) with the proper DANFE layout.  
- Includes an example output file: `output.pdf`.

Repository: [gabrielgv456/danfenodejs](https://github.com/gabrielgv456/danfenodejs)

---

## Requirements

Before running the project, make sure you have:

- **Node.js** (LTS version recommended)  
- **npm** or **yarn** package manager  
- (Optional) Native libraries for PDF generation or HTML rendering (depending on your OS)  

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gabrielgv456/danfenodejs.git
   cd danfenodejs
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. (Optional) Install system dependencies if your PDF generator library requires them.

---

## Usage

Example of usage inside a Node.js project:

```js
const path = require('path');
const { generateDanfe } = require('./src'); // adjust path as needed

const xmlPath = path.join(__dirname, 'invoice.xml');
const outputPath = path.join(__dirname, 'danfe.pdf');

generateDanfe(xmlPath, outputPath)
  .then(() => {
    console.log('DANFE successfully generated at', outputPath);
  })
  .catch(err => {
    console.error('Failed to generate DANFE:', err);
  });
```

- `xmlPath`: path to the input NF-e XML file  
- `outputPath`: path where the generated DANFE PDF will be saved  

You can also run it directly from the command line if a CLI script is added:

```bash
node src/index.js ./examples/invoice.xml ./output/danfe.pdf
```

---

## Project Structure

```text
danfenodejs/
├── src/
│   ├── index.js             ← main entry point
│   ├── parser/              ← XML parsing logic
│   ├── template/            ← HTML/templates for DANFE
│   ├── pdf/                 ← PDF generation logic
│   └── utils/               ← helper utilities
├── output.pdf               ← sample generated DANFE
├── package.json  
├── yarn.lock / package-lock.json  
└── README.md
```

---

## Configuration

You may configure:

- **Templates**: HTML/CSS templates for DANFE layout  
- **Paper size & margins**: A4, margins, orientation  
- **Branding**: custom logos or headers  
- **Fonts**: make sure to include the fonts you want to embed in the PDF  

Environment variables may be added in the future for better flexibility.

---

## Available Scripts

Defined inside `package.json`, for example:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint .",
    "generate": "node generate.js",
    "clean": "rm -rf output.pdf"
  }
}
```

- `npm start` → runs the main application  
- `npm run dev` → runs in development mode with hot reload  
- `npm test` → runs unit tests (if implemented)  
- `npm run lint` → checks code style  
- `npm run generate` → generates a DANFE using a sample XML  

---

## Contributing

Contributions are welcome! To contribute:

1. Open an **issue** to discuss new features or bugs.  
2. Fork this repository.  
3. Create a feature branch: `git checkout -b feature/my-feature`.  
4. Commit your changes with a clear message.  
5. Push to your branch and submit a Pull Request.  

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

## Examples

### CLI Example

```bash
node src/index.js ./examples/sample.xml ./output/sample.pdf
```

### Programmatic Example

```js
const { generateDanfe } = require('danfenodejs');

generateDanfe('./invoice.xml', './danfe.pdf')
  .then(() => console.log('Done!'))
  .catch(console.error);
```

---

🚀 With this, you’re ready to generate DANFE from NF-e XML files using Node.js!
