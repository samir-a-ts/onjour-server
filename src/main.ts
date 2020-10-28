import constants from './infrastructure/config/constants';
import initialiseDB from './infrastructure/orm/mongoose';
import startServer from './infrastructure/webserver/server';

async function main() {
    await initialiseDB();

    await startServer();    
}

main()
    .catch(err => constants.logger.error(err));
