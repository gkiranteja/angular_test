import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './app/app.config';
import { BootController } from '../src/app/providers/bootControler.service';

if (AppConfig.production) {
  enableProdMode();
}

// platformBrowserDynamic()
//   .bootstrapModule(AppModule, {
//     preserveWhitespaces: false
//   })
//   .catch(err => console.error(err));

const init = () => {
  platformBrowserDynamic().bootstrapModule(AppModule, { preserveWhitespaces: false })
    .then(() => (<any>window).appBootstrap && (<any>window).appBootstrap())
    .catch(err => console.error('NG Bootstrap Error =>', err));
}

// Init on first load
init();

// Init on reboot request
const boot = BootController.getbootControl().watchReboot().subscribe(() => init());

