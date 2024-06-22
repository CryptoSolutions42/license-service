import { AbstractRepository } from './abstract.repository';
import { TableNameType } from './types/types';
import { decryptData } from '../utils/crypto';

export class LicenseRepository extends AbstractRepository {
  tableName: TableNameType = 'license';
  constructor() {
    super();
  }

  async getLicense() {
    const result = await this._selectQuery<{ email: string; licenseKey: string; dateEnd: number }>({
      tableName: this.tableName,
      column: ['email', 'license_key as "licenseKey"', 'date_end as "dateEnd"'],
    });

    if (!result) {
      return;
    }

    return result;
  }

  async setLicenseKey(licenseKey: string) {
    await this._updateQuery({
      tableName: this.tableName,
      value: [
        {
          column: 'license_key',
          value: licenseKey,
        },
        {
          column: 'date_end',
          value: +new Date(decryptData(licenseKey)),
        },
      ],
    });
  }

  async checkLicense(licenseKey: string, desktopId: string) {
    const result = await this._selectQuery<{ dateEnd: number }>({
      tableName: this.tableName,
      column: ['date_end as "dateEnd"'],
      where: [
        {
          column: 'license_key',
          value: licenseKey,
        },
        {
          column: 'desktop_id',
          value: desktopId,
        },
      ],
      operationCondition: 'and',
    });

    if (!result) {
      return false;
    }

    if (+new Date() <= +result[0].dateEnd) {
      return true;
    }

    return false;
  }

  async createLicenseKey(email: string, licenseKey: string, period: number): Promise<boolean> {
    try {
      const existingLicense = await this._selectQuery({
        tableName: this.tableName,
        column: ['license_key as "licenseKey"', 'dateEnd as "dateEnd"', 'desktop_id as "desktopId"'],
        where: [
          {
            column: 'email',
            value: email,
          },
          {
            column: 'license_key',
            value: licenseKey,
          },
        ],
        operationCondition: 'and',
      })[0];

      if (existingLicense) {
        const existingDateEnd = existingLicense.dateEnd;
        await this._updateQuery({
          tableName: this.tableName,
          value: [
            {
              column: 'license_key',
              value: licenseKey,
            },
            {
              column: 'date_end',
              value: existingDateEnd - +new Date() > 0 ? existingDateEnd - +new Date() + period : +new Date() + period,
            },
          ],
          where: [
            {
              column: 'desktop_id',
              value: existingLicense.desktopId,
            },
            {
              column: 'email',
              value: email,
            },
            {
              column: 'license_key',
              value: licenseKey,
            },
          ],
          operationCondition: 'and',
        });

        return true;
      }

      await this._insertQuery({
        tableName: this.tableName,
        value: [
          {
            column: 'email',
            value: email,
          },
          {
            column: 'license_key',
            value: licenseKey,
          },
          {
            column: 'date_end',
            value: period,
          },
          {
            column: 'is_active',
            value: 0,
          },
        ],
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async activateLicense(desktopId: string, licenseKey: string) {
    this._updateQuery({
      tableName: this.tableName,
      value: [
        {
          column: 'desktop_id',
          value: desktopId,
        },
        {
          column: 'is_active',
          value: 1,
        },
      ],
      where: [
        {
          column: 'license_key',
          value: licenseKey,
        },
        {
          column: 'desktop_id',
          value: null,
        },
      ],
      operationCondition: 'and',
    });
  }
}
