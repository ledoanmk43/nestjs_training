export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_EXP_H':
        return '3600';
      case 'JWT_REF_EXP_H':
        return '36000';
    }
  },
};
