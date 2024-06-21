import { LicenseRepository } from '../../repository/license.repository';
import { encryptData } from '../../utils/crypto';

const period = {
  trial: 1000 * 60 * 24 * 7,
  month: 1000 * 60 * 24 * 30,
  '3month': 1000 * 60 * 24 * 30 * 3,
  '6month': 1000 * 60 * 24 * 30 * 6,
  year: 1000 * 60 * 24 * 30 * 12,
};

export class LicenseService {
  constructor(private _licenseRepository: LicenseRepository) {}

  async getAllLicense() {
    const result = await this._licenseRepository.getLicense();

    return result;
  }

  async activatedLicense(desktopId: string, licenseKey: string) {
    await this._licenseRepository.activateLicense(desktopId, licenseKey);
  }

  async generateLicense(email: string, periodKey: 'trial' | 'month' | '3month' | '6month' | 'year') {
    const { licenseKey, dateEnd } = this._generateLicenseKey(periodKey);

    await this._licenseRepository.createLicenseKey(email, licenseKey, dateEnd);
  }

  async checkingLicense(licenseKey: string) {
    const result = await this._licenseRepository.checkLicense(licenseKey);

    return result;
  }

  private _generateLicenseKey(periodKey: 'trial' | 'month' | '3month' | '6month' | 'year'): {
    licenseKey: string;
    dateEnd: number;
  } {
    const date = +new Date() + period[periodKey];
    const crypto = {
      licenseKey: encryptData(date.toString()) + '_' + this.generateRandomString(),
      dateEnd: date,
    };

    return crypto;
  }

  private generateRandomString(length = 12): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }
}
