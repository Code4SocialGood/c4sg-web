import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'jquery';
import '../styles.css';
import 'materialize-css/dist/css/materialize.css';
import 'mdi/css/materialdesignicons.min.css';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
