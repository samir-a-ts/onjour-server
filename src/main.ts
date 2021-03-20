import constants from './infrastructure/config/constants';
import initialiseDB from './infrastructure/orm/mongoose';
import startServer from './infrastructure/webserver/server';

/// Главная функция, запускающая
/// все приложение. Сначала запускает
/// базу данных, а затем уже запускает
/// сервер. 
async function main() {
    await initialiseDB();

    await startServer();    
}

/// Если поймает ошибки, то
/// сразу выводит их в консоль.
main()
    .catch(err => constants.logger.error(err));
