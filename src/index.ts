import path from 'node:path';
import { connect } from './repositories/base';
import { createApp } from './tasks-manager';
import { createLogger } from './modules';

try {
	const { PORT, DB_URI, DB_PORT } = process.env;
	if (!PORT) console.error("PORT isn't defined");
	if (!DB_PORT || !DB_URI) {
		console.error("DB_PORT or DB_URI isn't defined");
		throw new Error("DB_PORT or DB_URI isn't defined");
	}
	connect(`${DB_URI}:${DB_PORT}`)
		.then(() => {
			const logs = path.join(__dirname, 'logs');
			const logger = createLogger(logs);
			const app = createApp({ logFilePath: logger });
			app.listen(PORT, () =>
				logger.info(
					`Server running at http://localhost:${PORT}/`,
				),
			);
		})
		.catch((error) => {
			console.error(
				'An error occurred while connecting to JSON server',
				{
					error,
				},
			);
		});
} catch (error) {
	console.error('An error occurred while starting an app', {
		error,
	});
	process.exit(1);
}
