import {Injectable} from '@angular/core';

@Injectable()
export class ValidationService {

  // RegEx validators
  public einValidRegEx = /^[1-9]\d?-\d{7}$/;
  public emailValidRegEx = /\S+@\S+\.\S+/;
  // public httpValidRegEx = /^https?:\/\//;
  public urlValidRegEx = /^(https?):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+([a-zA-Z]{2,9})(:\d{1,4})?([-\w\/#~:.?+=&%@~]*)$/;
  public zipValidRegEx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length

  public descMaxLength = 10000;
  public introMaxLength = 10000;
  public nameMaxLength = 120;

}
