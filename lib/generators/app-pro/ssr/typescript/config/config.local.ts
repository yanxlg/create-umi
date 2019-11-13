import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.logger = {
    level: 'NONE',
    consoleLevel: 'DEBUG',
  };
  return config;
};
