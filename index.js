const express = require('express');
const fs = require('fs'); //используем promises версию fs
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
app.use(cors({
    origin: '*'
})); //используем настройки CORS для всех роутов

app.use(bodyParser.json()); // Парсинг JSON
app.use(bodyParser.urlencoded({ extended: true }));

const filePath = './works.json';

app.post('/newPost', async (req, res) => { //используем async await для обработки ошибок
    try {
        const oldData = await fs.readFileSync(filePath, {encoding:'utf8'})
        const parsedData = JSON.parse(oldData)
        
        const newData = req.body;
        
        parsedData.projects.push(newData.workTemplate)
        
        await fs.writeFileSync(filePath, JSON.stringify(parsedData)); //используем await для writeFile
        console.log(`Данные успешно записаны в файл ${filePath}`);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/deletePost', async (req, res) => { //используем async await для обработки ошибок
    try {
        const deleteData = req.body.postTitle;
        const oldData = await fs.readFileSync(filePath, {encoding:'utf8'})
        const parsedData = JSON.parse(oldData)
        parsedData.projects = parsedData.projects.filter(item => item.title !== deleteData);
        
        await fs.writeFileSync(filePath, JSON.stringify(parsedData)); //используем await для writeFile
        res.send(JSON.stringify(parsedData));
        
        console.log(parsedData)
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get('/', async (req, res) => { //используем async await для обработки ошибок
    try {
        console.log('get')
        const data = await fs.readFileSync(filePath, 'utf8'); //используем await для readFile
        res.send(JSON.parse(data));
        console.log(data)
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
