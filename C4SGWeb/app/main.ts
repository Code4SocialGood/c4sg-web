import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import '../styles.css';
import 'materialize-css/dist/css/materialize.css';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
