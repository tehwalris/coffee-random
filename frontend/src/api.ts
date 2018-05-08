import { CheckCredsRequest, SubmitRequest } from "./generated/coffee_pb";
import { CoffeeSurveyClient } from "./generated/coffee_pb_service";

class Client {
  private client: CoffeeSurveyClient;

  constructor(host: string) {
    this.client = new CoffeeSurveyClient(host);
  }

  checkCreds(_req: CheckCredsRequest.AsObject): Promise<undefined> {
    const req = new CheckCredsRequest();
    req.setUsername(_req.username);
    req.setPassword(_req.password);
    return new Promise((resolve, reject) => {
      this.client.checkCreds(req, err => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  submit(_req: SubmitRequest.AsObject): Promise<undefined> {
    const req = new SubmitRequest();
    req.setUsername(_req.username);
    req.setPassword(_req.password);
    req.setMachineColumn(_req.machineColumn);
    req.setQuality(_req.quality);
    req.setBusiness(_req.business);
    return new Promise((resolve, reject) => {
      this.client.submit(req, err => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  }
}

export const client = new Client(
  process.env.REACT_APP_MAILALIAS_API_URL || "http://localhost:8080",
);
