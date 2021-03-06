/* tslint:disable:no-use-before-declare */

import { client } from "./api";
import { ANIMATION_SLOWDOWN } from "./util";

// This file contains all the non-animation logic in coffee-random.
// I experimented with doing some unusal state management here,
// by (ab)using inheritance. It's interesting to look at, but
// I don't recommend using it in a real app.

const SAVE_TIMEOUT_MS = 3000 * ANIMATION_SLOWDOWN;
export const COLUMN_COUNT = 4;

type UpdateHandler = (store: Store) => void;

export type Store = LoginStore | ColumnStore | RatingStore;

class BaseState {
  protected update: UpdateHandler;
  username = "";
  password = "";
  didAutoLogin = false;
  column: number | undefined = undefined;

  constructor(arg: UpdateHandler | BaseState) {
    if (arg instanceof BaseState) {
      this.update = arg.update;
      this.username = arg.username;
      this.password = arg.password;
      this.didAutoLogin = arg.didAutoLogin;
      this.column = arg.column;
    } else {
      this.update = arg;
    }
  }
}

const LOGIN_LOCAL_STORAGE = "coffee-random-login";

export class LoginStore extends BaseState {
  beforeFirstManualLogin = true;
  failed = false;
  inProgress = false;
  initializing = true;

  constructor(arg: UpdateHandler | BaseState) {
    super(arg);
    this.tryLoadState();
  }

  onUsernameChange = (username: string) => {
    this.username = username;
    this.failed = false;
    this.update(this);
  };

  onPasswordChange = (password: string) => {
    this.password = password;
    this.failed = false;
    this.update(this);
  };

  async onLogin() {
    this.beforeFirstManualLogin = false;
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
      this.didAutoLogin = true;
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
  constructor(arg: UpdateHandler | BaseState) {
    super(arg);
    this.loadNextColumn();
  }

  private async loadNextColumn(): Promise<void> {
    try {
      const res = await client.nextColumn({
        username: this.username,
        password: this.password,
        notColumn: this.column || 0,
      });
      this.column = res.machineColumn;
      this.update(this);
    } catch (e) {
      console.error(e); //tslint:disable-line:no-console
    }
  }

  private hasColumn(): this is { column: number } {
    return this.column !== undefined;
  }

  onDone = () => {
    if (this.hasColumn()) {
      this.update(new RatingStore(this));
    }
  };

  onCannot = this.loadNextColumn.bind(this);
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
  private failed = false;
  private saveCount = 0;
  private timeoutHandle: NodeJS.Timer | undefined;
  column: number;
  rating: Rating | undefined;

  constructor(arg: UpdateHandler | (BaseState & { column: number })) {
    super(arg);
  }

  getState(): RatingState {
    if (this.saving) {
      return RatingState.Saving;
    }
    if (this.failed) {
      return RatingState.Error;
    }
    return RatingState.Ok;
  }

  async onTapRating(rating: Rating) {
    this.saveCount += 1;
    const ownCount = this.saveCount;
    this.rating = rating;
    this.saving = true;
    this.failed = false;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.update(this);

    let failed = false;
    try {
      await client.submit({
        ...rating,
        username: this.username,
        password: this.password,
        machineColumn: this.column,
      });
    } catch (e) {
      console.error(e); //tslint:disable-line:no-console
      failed = true;
    }

    if (this.saveCount !== ownCount) {
      // another save finished before this one, don't modify the state
      return;
    }

    this.saving = false;
    this.failed = failed;
    if (!failed) {
      this.timeoutHandle = setTimeout(this.onTimeout, SAVE_TIMEOUT_MS);
    }
    this.update(this);
  }

  private onTimeout = () => {
    this.update(new ColumnStore(this));
  };
}
