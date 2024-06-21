import { AbstractRepository } from "./abstract.repository";
import { TableNameType } from "./types/types";
import { decryptData } from "../utils/crypto";

export class LicenseRepository extends AbstractRepository {
    tableName: TableNameType = "license";
    constructor() {
        super();
    }

    async getLicense() {
        const result = await this._selectQuery<{ email: string; licenseKey: string; dateEnd: number }>({
            tableName: this.tableName,
            column: ["email", 'license_key as "licenseKey"', 'date_end as "dateEnd"'],
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
                    column: "license_key",
                    value: licenseKey,
                },
                {
                    column: "date_end",
                    value: +new Date(decryptData(licenseKey)),
                },
            ],
        });
    }

    async checkLicense(licenseKey: string) {
        const result = await this._selectQuery<{ dateEnd: number }>({
            tableName: this.tableName,
            column: ['date_end as "dateEnd"'],
            where: [
                {
                    column: "license_key",
                    value: licenseKey,
                },
            ],
        });

        if (!result) {
            return;
        }

        if (+new Date() <= +result[0].dateEnd) {
            return true;
        }

        return false;
    }

    async createLicenseKey(email: string, licenseKey: string, period: number) {
        await this._insertQuery({
            tableName: this.tableName,
            value: [
                {
                    column: "email",
                    value: email,
                },
                {
                    column: "license_key",
                    value: licenseKey,
                },
                {
                    column: "date_end",
                    value: period,
                },
            ],
        });
    }

    async activateLicense(desktopId: string, licenseKey: string) {
      this._updateQuery({
        tableName: this.tableName,
        value: [
          {
            column: 'desktop_id',
            value: desktopId
          }
        ],
        where: [{
          column: 'license_key',
          value: licenseKey
        }]
      })

    }
}
