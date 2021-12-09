export class Client {
  name: string = '';
  url: string = '';
  ssh: any = {
    host: '',
    port: 22,
    user: '',
    keyFile: ''
  };
  cms: any = {
    name: '',
    username: '',
    password: '',
    login_path: ''
  };
  forms: Array<any> = [
    {
      name: '',
      url: '',
      id: '',
      formData: []
    }
  ]

  load(data: any) {
    Object.assign(this, data);
  }

  addForm(){
    this.forms.push({
      name: '',
      url: '',
      id: '',
      formData: {}
    });
  }

  clear() {
    this.name = '';
    this.url = '';
    this.ssh = {
      host: '',
      port: 22,
      user: '',
      key_file: ''
    };
    this.cms = {
      name: '',
      username: '',
      password: '',
      login_path: ''
    };
    this.forms = [
      {
        name: '',
        url: '',
        id: '',
        formData: {}
      }
    ];
  }
}
