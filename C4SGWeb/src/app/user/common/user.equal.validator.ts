import { FormGroup } from '@angular/forms';

export function equalValidator(group: FormGroup): {equal: boolean} {
  let firstValue;
  const equal = Object.keys(group.controls).reduce((acc, key, keyIndex) => {
    if (keyIndex === 0) {
      firstValue = group.controls[key].value;
      return true;
    }
    return acc && firstValue === group.controls[key].value;
  }, true);
  return equal ? null : {equal: true};
}
