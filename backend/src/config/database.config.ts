import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): string => {
  return configService.get<string>(
    'MONGODB_URI',
    'mongodb://localhost:27017/project_management_app',
  );
};
