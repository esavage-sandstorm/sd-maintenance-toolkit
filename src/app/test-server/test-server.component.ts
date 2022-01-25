import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'test-server',
  templateUrl: './test-server.component.html',
  styleUrls: ['./test-server.component.scss']
})
export class TestServerComponent implements OnInit {
  client: any = {};
  testing: any = {
    memory: false,
    disk: false,
    opcache: false,
    php: false
  };

  data: any = {
    server: {
      opCacheEnabled: '',
      memory: [],
      disk: [],
      php: {
        current: null,
        latest: null
      }
    }
  };

  constructor(private router: Router, protected api: ApiService, protected dataService: DataService, protected clientService: ClientService) { }

  ngOnInit(): void {
    const self = this;
    this.dataService.data().subscribe((data: any) => {
      Object.assign(this.data, data);
    });
    this.clientService.data().subscribe((client: any) => {

      if (client && client.ssh.host) {
        self.client = client;
      } else {
        this.router.navigate(['/clients']);
      }
    });
  }

  updateData(){
    this.dataService.update(this.data);
  }

  serverTestAll() {
    this.testing = {
      memory: true,
      disk: true,
      opcache: true,
      php: true
    };
    this.getMemory().then(memory => {
      this.getDisks().then(disks => {
        this.checkPhpVersions().then(php => {
          this.testOpCacheEnabled().then(opCache => {
          });
        });
      });
    });
  }

  clientJSON(){
    return JSON.stringify(this.client.clientData);
  }



  testOpCacheEnabled() {
    this.testing.opcache = true;
    const data: any = this.clientService.clientSSH();
    if (data) {
      data.module_name = 'Zend OPcache';
      return this.api.post('server/php-module', data).then( (result: any) => {
        this.testing.opcache = false;
        this.data.server.opCacheEnabled = result;
        this.updateData();
      });
    } else {
      this.testing.opcache = false;
      return new Promise((resolve, reject) => {
        reject('no client data provided');
      });
    }
  }

  getMemory() {
    this.testing.memory = true;
    const data: any = this.clientService.clientSSH();
    console.log('client', data);
    if (data) {
      return this.api.post('server/memory', data).then( (result: any) => {
        this.testing.memory = false;
        this.data.server.memory = result;
        this.updateData();
      });
    } else {
      this.testing.memory = false;
      return new Promise((resolve, reject) => {
        reject('no client data provided');
      });
    }
  }

  rootDisk() {
    var root = this.data.server.disk.filter((disk: any) => {
      return disk.mounted_on == '/';
    });
    if (root.length == 1){
      return root[0];
    } else {
      return false;
    }
  }

  otherDisks() {
    var disks = this.data.server.disk.filter((disk: any) => {
      return disk.mounted_on != '/';
    });
    if (disks.length > 0){
      return disks;
    } else {
      return false;
    }
  }
  getDisks() {
    this.testing.disk = true;
    const data: any = this.clientService.clientSSH();
    if (data) {
      return this.api.post('server/disk', data).then( (result: any) => {
        this.testing.disk = false;
        const disks = result.sort((a: any, b:any) => {
          return a.mounted_on.length - b.mounted_on.length;
        });
        this.data.server.disk = disks;
        this.updateData();
      });
    } else {
      this.testing.disk = false;
      return new Promise((resolve, reject) => {
        reject('no client data provided');
      });
    }
  }

  checkPhpVersions() {
    this.testing.php = true;
    const data: any = this.clientService.clientSSH();
    if (data) {
      return this.api.post('server/php-version', data).then( (result: any) => {
        this.testing.php = false;
        this.data.server.php = result;
        this.updateData();
      });
    } else {
      this.testing.php = false;
      return new Promise((resolve, reject) => {
        reject('no client data provided');
      });
    }
  }

}
