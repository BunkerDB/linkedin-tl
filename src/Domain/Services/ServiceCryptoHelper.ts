import crypto = require("crypto");
import { SettingsInterface } from "../../Application/Setting";

export class ServiceCryptoHelper {
  private readonly _settings: SettingsInterface;

  constructor(args: { settings: SettingsInterface }) {
    this._settings = args.settings;
  }
  get settings() {
    return this._settings;
  }
  decryptImageData(hash: string): [string, string, number, string, string] {
    let decrypt = crypto.createDecipheriv(
      this.settings.CDN_HASH_CIPHER,
      Buffer.from(this.settings.CDN_HASH_KEY, "binary"),
      this.settings.CDN_HASH_IV
    );
    let text = decrypt.update(hash, "base64", "utf8") + decrypt.final("utf8");
    return JSON.parse(text);
  }

  encryptImageData(
    data: [
      type: string,
      postId: string,
      entityId: number,
      network: string,
      instance: string
    ]
  ): string {
    let text = Buffer.from(JSON.stringify(data), "utf8").toString("utf8");
    let cipher = crypto.createCipheriv(
      this.settings.CDN_HASH_CIPHER,
      Buffer.from(this.settings.CDN_HASH_KEY, "binary"),
      this.settings.CDN_HASH_IV
    );
    let encrypted =
      cipher.update(text, "utf8", "base64") + cipher.final("base64");
    return encrypted.toString();
  }
}
