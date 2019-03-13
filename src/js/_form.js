export default class HandleForm {

  constructor(form) {
    this.form = form
    this.inputs = [...form.querySelectorAll('input')]
    this.errors = {}
    this.textarea = [...form.querySelectorAll('textarea')]
    this.init()
  }

  init() {
    this.inputs.forEach(element => {
      element.addEventListener("input", e => {
        this.validator(e.target)
      });
    });
    this.textarea.forEach(element => {
      element.addEventListener("input", e => {
        this.validator(e.target)
      })
    })
    this.form.onsubmit = (e) => this.formSubmit(e)
  }

  validator(tag) {
    let check;
    switch (tag.type) {
      case 'email':
        check = this.validEmail(tag.value);
        break;
      case 'tel':
        check = this.validPhone(tag.value);
        break;
      default:
        check = this.validMinLength(tag.value);
        break;
    }
    return this.frontStyles(check, tag)
  }

  validSuccess (arr) {
    return arr.every((element) => element.dataset.valid === 'true')
  }

  validMinLength(message) {
    if (message.length === 0) {
      this.errors['message'] = 'Please enter words.';
    } else if (message.length < 3) {
      this.errors['message'] = 'Your message is too short.';
    }
    const re = /[\w\u0430-\u044f]{3}/ig;
    const result = re.test(message)
    const errorMessage = this.errors.message
    return {
      result,
      errorMessage
    }
  }

  validEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const result = re.test(String(email).toLowerCase())
    if (email.length === 0) {
      this.errors['email'] = 'Please enter a email.';
    } else if (email.length < 3) {
      this.errors['email'] = 'Your email is too short.';
    } else if (!result) {
      this.errors['email'] = 'Your email is invalid.';
    }
    const errorMessage = this.errors.email
    return {
      result,
      errorMessage
    }
  }

  validPhone(phone) {
    const re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
    const result = re.test(phone)
    if (phone.length === 0) {
      this.errors['phone'] = 'Please enter a phone.';
    } else if (phone.length < 3) {
      this.errors['phone'] = 'Your phone is too short.';
    } else if (!result) {
      this.errors['phone'] = 'Your phone is invalid.';
    }
    const errorMessage = this.errors.phone
    return {
      result,
      errorMessage
    }
  }

  frontStyles(validObj, tag) {
    if (!validObj.result) {
      tag.dataset.valid = false
      tag.className = "error";
      if (tag.parentElement.querySelector('.invalid-feedback')) {
        tag.parentElement.querySelector('.invalid-feedback').innerHTML = validObj.errorMessage
      } else {
        this.showErrorMessage(tag, validObj.errorMessage)
      }
    } else {
      tag.dataset.valid = true
      tag.className = "success"
      if (tag.parentElement.querySelector('.invalid-feedback')) {
        tag.parentElement.querySelector('.invalid-feedback').remove()
      } 
    }
  }
  showErrorMessage(node, message) {
    node.insertAdjacentHTML('afterend',`
      <div class="invalid-feedback">
        ${ message}
      </div>
    `);
  }

  formSubmit(e) {
    e.preventDefault()
    if (this.validSuccess([...this.inputs, ...this.textarea])) {
      const resultObj = (element) => element.map(input => {
        const inputRes = new Object;
        inputRes[input.name] = input.value
        return inputRes
      })
      const res = Object.assign({}, ...resultObj(this.inputs), ...resultObj(this.textarea))
      console.log('res', res)
    }
  }
}
