/* tslint:disable:no-use-before-declare */

import { client } from "./api";
import { random } from "lodash";

const SAVE_TIMEOUT_MS = 3000;
const COLUMN_COUNT = 4;

type UpdateHandler = (store: Store) => void;

export type Store = LoginStore | ColumnStore | RatingStore;

class BaseState {
  protected update: UpdateHandler;
  username = "";
  password = "";
  column = 0;

  constructor(arg: UpdateHandler | BaseState) {
    if (arg instanceof BaseState) {
      Object.assign(this, arg);
    } else {
      this.update = arg;
    }
  }
}

const LOGIN_LOCAL_STORAGE = "coffee-random-login";

export class LoginStore extends BaseState {
  failed = false;
  inProgress = false;
  initializing = true;

  constructor(arg: UpdateHandler | BaseState) {
    super(arg);
    this.tryLoadState();
  }

  onUsernameChange = (username: string) => {
    this.username = username;
    this.update(this);
  };

  onPasswordChange = (password: string) => {
    this.password = password;
    this.update(this);
  };

  async onLogin() {
    this.inProgress = true;
    this.failed = false;
    this.update(this);

    try {
      await client.checkCreds(this);
    } catch (e) {
      console.error(e); //tslint:disable-line:no-console
      this.failed = true;
    }
    this.inProgress = false;
    this.tryAdvance();
  }

  private tryAdvance() {
    if (this.failed) {
      this.update(this);
    } else {
      this.saveState();
      this.update(new ColumnStore(this));
    }
  }

  private async tryLoadState() {
    try {
      const s = localStorage.getItem(LOGIN_LOCAL_STORAGE);
      const v = JSON.parse(s || "");
      await client.checkCreds(v);
      this.username = v.username;
      this.password = v.password;
      this.tryAdvance();
    } catch (e) {
      console.error(e); //tslint:disable-line:no-console
      this.initializing = false;
      this.update(this);
    }
  }

  private saveState() {
    localStorage.setItem(
      LOGIN_LOCAL_STORAGE,
      JSON.stringify({ username: this.username, password: this.password }),
    );
  }
}

export class ColumnStore extends BaseState {
  column = this.random(-1);
  failed = false;

  private random(not: number): number {
    while (true) {
      const v = random(0, COLUMN_COUNT - 1);
      if (v !== not) {
        return v;
      }
    }
  }

  onDone = () => {
    this.update(new RatingStore(this));
  };

  onCannot = () => {
    this.column = this.random(this.column);
    this.failed = true;
    this.update(this);
  };
}

export interface Rating {
  quality: number;
  business: number;
}

export enum RatingState {
  Saving,
  Ok,
  Error,
}

export class RatingStore extends BaseState {
  private saving = false;
  private savedAt: Date | undefined;
  private timeoutHandle: NodeJS.Timer | undefined;
  rating: Rating | undefined;

  getState(): RatingState {
    if (this.saving) {
      return RatingState.Saving;
    }
    if (this.savedAt) {
      return RatingState.Ok;
    }
    return RatingState.Error;
  }

  getProgress(): number | undefined {
    if (!this.savedAt) {
      return;
    }
    const p = (Date.now() - +this.savedAt) / SAVE_TIMEOUT_MS;
    return Math.max(0, Math.min(1, p));
  }

  async onTapRating(rating: Rating) {
    this.rating = rating;
    this.saving = true;
    this.savedAt = undefined;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.update(this);

    try {
      await client.submit({
        ...rating,
        username: this.username,
        password: this.password,
        machineColumn: this.column,
      });
      this.savedAt = new Date();
    } catch (e) {
      console.error(e); //tslint:disable-line:no-console
    }
    this.saving = false;
    this.timeoutHandle = setTimeout(this.onTimeout, SAVE_TIMEOUT_MS);
    this.update(this);
  }

  private onTimeout = () => {
    this.update(new ColumnStore(this));
  };
}
