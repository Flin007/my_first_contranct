// импорт модуля Node.js fs, который предоставляет функционал для работы с файловой системой.
import * as fs from "fs";
//Для работы с локальным исполнением
import process from "process";
//импорт Cell из модуля "ton-core". Cell представляет собой структуру данных, используемую в TON.
import { Cell } from "ton-core";
//импорт функции compileFunc из модуля "@ton-community/func-js". Эта функция компилирует FunC код в бинарный код TON.
import { compileFunc } from "@ton-community/func-js";

//определение асинхронной функции compileScript, которая будет выполнять компиляцию FunC кода.
async function compileScript() {

    console.log('Приступили к компеляции');
    
    //вызов функции compileFunc, которая компилирует FunC код из файла ./contracts/main.fc.
    //которая принимает путь к файлу x, считывает его содержимое с помощью fs.readFileSync(x) и преобразует его в строку с помощью toString("utf8").
    const colmpileResult = await compileFunc({
        targets: ["./contracts/main.fc"],
        sources: (x) => fs.readFileSync(x).toString('utf-8'),
    });

    // проверка результата компиляции. Если произошла ошибка, скрипт выводит сообщение об ошибке и завершает работу.
    if(colmpileResult.status === 'error'){
        console.log('Произошла ошибка:');
        console.log(colmpileResult.message);
        process.exit(1);
    }

    console.log("Компиляция прошла успешно");

    //Имя для основного скомпилированного json файла
    const hexArtifact = `build/main.compiled.json`;

    //Запишем в файл для получения 16 ричного арифакта
    fs.writeFileSync(
        hexArtifact,
        JSON.stringify({
            hex: Cell.fromBoc(Buffer.from(colmpileResult.codeBoc, 'base64'))[0]
            .toBoc()
            .toString("hex")
        })
    );

    console.log("Comiled code saved to " + hexArtifact);

}

//вызов функции compileScript для запуска компиляции.
compileScript();