import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import '../styles.css';
import 'materialize-css/bin/materialize.css';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
