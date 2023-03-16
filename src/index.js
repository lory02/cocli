const { program } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

program
  .version('1.0.0')
  .command('create <name>')
  .description('create a new project')
  .option('--template <type>')
  .action(async (name, options) => {
    // check file existence
    const projectPath = path.join(process.cwd(), name)
    const isExisted = fs.existsSync(projectPath)
    if(isExisted) {
      return console.error('current file already exists!')
    }

    let template = options.template
    let templatePath
    if(template && /^(vue|react)$/.test(template)) {
      templatePath = path.join(__dirname, `/templates/${template}.html`)
    } else {
      const questions = [
        {
          type: 'list',
          name: 'template',
          message: 'Which template do you want to use?',
          choices: ['vue', , 'react'],
        },
        {
          type: 'input',
          name: 'description',
          message: 'Please input project description:',
        }
      ]
      
      const answers = await inquirer.prompt(questions)
      template = answers.template
      templatePath = path.join(__dirname, `/templates/${answers.template}.html`)
    }

    fs.mkdirSync(`${process.cwd()}/${name}`)
    const targetFile = `${process.cwd()}/${name}/${template}.html`
    download(templatePath, targetFile)
  })

function download(sourcePath, targetFile) {
  fs.readFile(sourcePath, (err, data) => {
    if(err) {
      return console.error(err)
    } else {
      fs.writeFile(targetFile, data,  err => {
        if (err) {
          return console.error(err);
        }
      })
    }
  })
}

program.parse(process.argv);